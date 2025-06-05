import { supabase } from '../lib/supabase';

// Google Calendar API configuration
const GOOGLE_CALENDAR_API = {
  CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  API_KEY: import.meta.env.VITE_GOOGLE_API_KEY,
  DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
  SCOPES: 'https://www.googleapis.com/auth/calendar.events'
};

let isInitialized = false;
let isInitializing = false;
let initializationError: Error | null = null;

// Function to initialize Google Calendar API
export const initGoogleCalendarApi = async () => {
  // Return early if already initialized successfully
  if (isInitialized) {
    return;
  }

  // Return the previous error if initialization previously failed
  if (initializationError) {
    throw initializationError;
  }

  // Prevent multiple simultaneous initialization attempts
  if (isInitializing) {
    throw new Error('Google Calendar API initialization already in progress');
  }

  try {
    isInitializing = true;

    // Validate credentials
    if (!GOOGLE_CALENDAR_API.CLIENT_ID || !GOOGLE_CALENDAR_API.API_KEY) {
      throw new Error('Google Calendar API credentials not configured');
    }

    // Check if gapi is available
    if (typeof gapi === 'undefined') {
      throw new Error('Google API client not loaded');
    }

    // Initialize the client
    await new Promise<void>((resolve, reject) => {
      gapi.load('client:auth2', {
        callback: async () => {
          try {
            await gapi.client.init({
              apiKey: GOOGLE_CALENDAR_API.API_KEY,
              clientId: GOOGLE_CALENDAR_API.CLIENT_ID,
              discoveryDocs: [GOOGLE_CALENDAR_API.DISCOVERY_DOC],
              scope: GOOGLE_CALENDAR_API.SCOPES
            });

            // Check if initialization was successful
            if (!gapi.client?.calendar) {
              throw new Error('Google Calendar API client not initialized properly');
            }

            resolve();
          } catch (error) {
            reject(error);
          }
        },
        onerror: () => reject(new Error('Failed to load Google API client')),
        timeout: 5000,
        ontimeout: () => reject(new Error('Google API client load timeout'))
      });
    });

    // Sign in the user if not already signed in
    if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
      await gapi.auth2.getAuthInstance().signIn({
        prompt: 'select_account'
      });
    }

    isInitialized = true;
    initializationError = null;
  } catch (error) {
    console.error('Error initializing Google Calendar API:', error);
    initializationError = error instanceof Error ? error : new Error('Unknown initialization error');
    throw initializationError;
  } finally {
    isInitializing = false;
  }
};

// Function to check if Google Calendar API is initialized
export const isGoogleCalendarInitialized = () => isInitialized;

// Function to sync Freek's activities with Google Calendar
export const syncFreekActivities = async (activities: any[]) => {
  try {
    if (!isInitialized) {
      await initGoogleCalendarApi();
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No authenticated session');
    }

    // Ensure user is signed in to Google
    if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
      await gapi.auth2.getAuthInstance().signIn({
        prompt: 'select_account'
      });
    }

    // Get Google Calendar events for the next month
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    
    const response = await gapi.client.calendar.events.list({
      'calendarId': 'primary', // Use primary calendar instead of hardcoded email
      'timeMin': now.toISOString(),
      'timeMax': nextMonth.toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 100,
      'orderBy': 'startTime'
    });

    // Get existing events to avoid duplicates
    const existingEvents = response.result.items || [];
    const existingEventIds = new Set(existingEvents.map(e => e.description?.split('\nID: ')[1]));

    // Map activities to Google Calendar events
    const events = activities.map(activity => ({
      'summary': `${activity.type.toUpperCase()}: ${activity.customerName}`,
      'location': activity.company,
      'description': `${activity.description}\n\nCompany: ${activity.company}\nID: ${activity.id}`,
      'start': {
        'dateTime': new Date(activity.date).toISOString(),
        'timeZone': 'Africa/Johannesburg'
      },
      'end': {
        'dateTime': new Date(new Date(activity.date).getTime() + 60*60*1000).toISOString(),
        'timeZone': 'Africa/Johannesburg'
      },
      'reminders': {
        'useDefault': true
      }
    }));

    // Create events in Google Calendar (only new ones)
    const results = await Promise.allSettled(
      events.map(async event => {
        const activityId = event.description.split('\nID: ')[1];
        if (!existingEventIds.has(activityId)) {
          return gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': event
          });
        }
        return null;
      })
    );

    // Log any failures but don't throw
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Failed to create event ${index}:`, result.reason);
      }
    });

    return true;
  } catch (error) {
    console.error('Error syncing with Google Calendar:', error);
    throw error;
  }
};