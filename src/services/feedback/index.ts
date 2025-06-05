import { getDocs } from 'firebase/firestore';
import { getFeedbackQuery, getActivitiesQuery } from './queries';
import { formatFeedbackData, formatActivityData } from './utils';
import { FeedbackWithActivity, FeedbackError } from './types';

export const getFeedbackWithActivities = async (repId: string): Promise<FeedbackWithActivity[]> => {
  try {
    // Get feedback
    const feedbackSnapshot = await getDocs(getFeedbackQuery(repId));
    const feedbackList = feedbackSnapshot.docs.map(formatFeedbackData);

    if (feedbackList.length === 0) {
      return [];
    }

    // Get activities
    const activitiesSnapshot = await getDocs(getActivitiesQuery(repId));
    const activities = activitiesSnapshot.docs.reduce((acc, doc) => {
      acc[doc.id] = formatActivityData(doc);
      return acc;
    }, {} as Record<string, any>);

    // Combine feedback with activities
    return feedbackList.map(feedback => ({
      ...feedback,
      activity: activities[feedback.activityId]
    }));
  } catch (error) {
    const feedbackError = error as FeedbackError;
    console.error('Error getting feedback:', feedbackError);
    
    // Handle specific Firebase errors
    if (feedbackError.code === 'failed-precondition') {
      console.error('Firebase not properly initialized');
    }
    
    return []; // Return empty array instead of throwing
  }
};

export * from './types';