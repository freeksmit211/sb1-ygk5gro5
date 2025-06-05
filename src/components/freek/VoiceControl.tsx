import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceControlProps {
  onAddActivity: (data: {
    customerName: string;
    company: string;
    description: string;
    type: 'meeting' | 'call' | 'quote' | 'order' | 'delivery';
    date: Date;
  }) => void;
  onOpenModal?: (data: {
    customerName: string;
    company: string;
    date: Date;
  }) => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ onAddActivity, onOpenModal }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const recognitionRef = useRef<any>(null);
  const isProcessingRef = useRef(false);
  const shouldRestartRef = useRef(false);
  const intentionalAbortRef = useRef(false);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 3;
  
  const [bookingStep, setBookingStep] = useState<'initial' | 'customer' | 'company' | 'date' | 'review' | 'submit'>('initial');
  const [bookingData, setBookingData] = useState({
    customerName: '',
    company: '',
    date: new Date(),
    type: 'meeting' as const
  });

  const speak = useCallback(async (text: string) => {
    return new Promise<void>((resolve) => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-ZA';
      utterance.onend = () => {
        if (shouldRestartRef.current && recognitionRef.current && !isProcessingRef.current && !intentionalAbortRef.current) {
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.error('Failed to restart recognition after speaking:', error);
          }
        }
        resolve();
      };
      window.speechSynthesis.speak(utterance);
    });
  }, []);

  const initializeRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) return null;

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-ZA';

    recognition.onstart = () => {
      setIsListening(true);
      intentionalAbortRef.current = false;
      retryCountRef.current = 0;
      if (bookingStep === 'initial') {
        setFeedback('How can I help you today?');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (shouldRestartRef.current && !isProcessingRef.current && !intentionalAbortRef.current) {
        if (retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current++;
          setTimeout(() => {
            if (recognitionRef.current && !isProcessingRef.current && !intentionalAbortRef.current) {
              try {
                recognitionRef.current.start();
              } catch (error) {
                console.error('Failed to restart recognition:', error);
              }
            }
          }, 1000);
        } else {
          setFeedback('Voice recognition stopped due to multiple errors. Please try again.');
          shouldRestartRef.current = false;
          retryCountRef.current = 0;
        }
      }
    };

    recognition.onerror = async (event: any) => {
      if (event.error === 'aborted' && intentionalAbortRef.current) {
        return;
      }

      console.error('Speech recognition error:', event.error);
      if (event.error !== 'aborted') {
        setFeedback('Error: Please try again');
        await speak('Sorry, there was an error. Please try again.');
      }
      setIsListening(false);
      isProcessingRef.current = false;
    };

    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      if (result.isFinal) {
        const transcript = result[0].transcript.toLowerCase();
        console.log('Captured voice:', transcript);
        setTranscript(transcript);
        isProcessingRef.current = true;
        processVoiceInput(transcript).finally(() => {
          isProcessingRef.current = false;
        });
      }
    };

    return recognition;
  }, [bookingStep, speak]);

  useEffect(() => {
    recognitionRef.current = initializeRecognition();
    shouldRestartRef.current = false;
    intentionalAbortRef.current = false;
    retryCountRef.current = 0;

    return () => {
      shouldRestartRef.current = false;
      intentionalAbortRef.current = true;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (error) {
          console.error('Error cleaning up recognition:', error);
        }
      }
    };
  }, [initializeRecognition]);

  const resetBooking = () => {
    setBookingStep('initial');
    setBookingData({
      customerName: '',
      company: '',
      date: new Date(),
      type: 'meeting'
    });
    isProcessingRef.current = false;
    shouldRestartRef.current = false;
    intentionalAbortRef.current = false;
    retryCountRef.current = 0;
  };

  const submitMeeting = async () => {
    try {
      intentionalAbortRef.current = true;
      
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      if (onOpenModal) {
        onOpenModal(bookingData);
        const successText = "Meeting details are ready. Would you like me to submit the form now?";
        setFeedback(successText);
        await speak(successText);
        setBookingStep('submit');
      } else {
        await onAddActivity({
          customerName: bookingData.customerName,
          company: bookingData.company,
          description: `Meeting with ${bookingData.customerName} from ${bookingData.company}`,
          type: 'meeting',
          date: bookingData.date
        });
        
        const successText = "Meeting scheduled successfully! Would you like to schedule another meeting?";
        setFeedback(successText);
        await speak(successText);
        resetBooking();
      }
      
      intentionalAbortRef.current = false;
      shouldRestartRef.current = true;
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error('Error submitting meeting:', error);
      const errorText = 'Sorry, there was an error scheduling the meeting. Would you like to try again?';
      setFeedback(errorText);
      await speak(errorText);
      resetBooking();
    }
  };

  const processVoiceInput = async (input: string) => {
    try {
      shouldRestartRef.current = true;
      
      switch (bookingStep) {
        case 'initial':
          if (input.includes('schedule') || input.includes('book') || input.includes('new')) {
            setBookingStep('customer');
            const question = "Who is the meeting with?";
            setFeedback(question);
            await speak(question);
          } else {
            const helpText = "Please say 'schedule meeting' to begin booking";
            setFeedback(helpText);
            await speak(helpText);
          }
          break;

        case 'customer':
          const nameMatch = input.match(/(?:with\s+)?([a-z\s]+)$/i);
          if (nameMatch) {
            const customerName = nameMatch[1].trim();
            setBookingData(prev => ({ ...prev, customerName }));
            setBookingStep('company');
            const question = `Which company is ${customerName} from?`;
            setFeedback(question);
            await speak(question);
          } else {
            const retryText = "Please tell me the person's name";
            setFeedback(retryText);
            await speak(retryText);
          }
          break;

        case 'company':
          const company = input.replace(/^(?:at|from)\s+/i, '').trim();
          setBookingData(prev => ({ ...prev, company }));
          setBookingStep('date');
          const dateQuestion = "When would you like to schedule this for? You can say 'today', 'tomorrow', or a specific date";
          setFeedback(dateQuestion);
          await speak(dateQuestion);
          break;

        case 'date':
          let meetingDate = new Date();
          
          if (input.includes('tomorrow')) {
            meetingDate.setDate(meetingDate.getDate() + 1);
          } else if (input.includes('today')) {
            // Keep today's date
          } else {
            const dateMatch = input.match(/(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(january|february|march|april|may|june|july|august|september|october|november|december)/i);
            if (dateMatch) {
              const [_, day, month] = dateMatch;
              const monthIndex = new Date(Date.parse(month + " 1, 2024")).getMonth();
              meetingDate = new Date(meetingDate.getFullYear(), monthIndex, parseInt(day));
            } else {
              const retryText = "Please specify a date like 'tomorrow' or '15th of March'";
              setFeedback(retryText);
              await speak(retryText);
              return;
            }
          }

          setBookingData(prev => ({ ...prev, date: meetingDate }));
          setBookingStep('review');
          
          const confirmText = `I'll schedule a meeting with ${bookingData.customerName} from ${bookingData.company} for ${meetingDate.toLocaleDateString()}. Is this correct?`;
          setFeedback(confirmText);
          await speak(confirmText);
          break;

        case 'review':
          const positiveResponses = ['yes', 'yeah', 'correct', 'right', 'okay', 'sure', 'confirm'];
          const negativeResponses = ['no', 'nope', 'cancel', 'wrong', 'incorrect'];

          if (positiveResponses.some(word => input.includes(word))) {
            await submitMeeting();
          } else if (negativeResponses.some(word => input.includes(word))) {
            const cancelText = "Let's start over. How can I help you?";
            setFeedback(cancelText);
            await speak(cancelText);
            resetBooking();
          } else {
            const retryText = "Please say yes to confirm or no to cancel";
            setFeedback(retryText);
            await speak(retryText);
          }
          break;

        case 'submit':
          const submitPositive = ['yes', 'yeah', 'submit', 'okay', 'sure', 'go ahead'];
          const submitNegative = ['no', 'nope', 'cancel', 'wait'];

          if (submitPositive.some(word => input.includes(word))) {
            const form = document.querySelector('form') as HTMLFormElement;
            if (form) {
              form.dispatchEvent(new Event('submit', { cancelable: true }));
              const successText = "Form submitted successfully! Would you like to schedule another meeting?";
              setFeedback(successText);
              await speak(successText);
              resetBooking();
            }
          } else if (submitNegative.some(word => input.includes(word))) {
            const cancelText = "Okay, I'll let you review the form manually. Say 'submit' when you're ready to submit.";
            setFeedback(cancelText);
            await speak(cancelText);
          } else {
            const retryText = "Please say yes to submit the form or no to review it manually";
            setFeedback(retryText);
            await speak(retryText);
          }
          break;
      }
    } catch (error) {
      console.error('Error processing voice input:', error);
      const errorText = 'Sorry, there was an error. Please try again.';
      setFeedback(errorText);
      await speak(errorText);
      resetBooking();
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      shouldRestartRef.current = false;
      intentionalAbortRef.current = true;
      try {
        recognitionRef.current.abort();
        window.speechSynthesis.cancel();
        setIsListening(false);
        setFeedback('');
        resetBooking();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    } else {
      shouldRestartRef.current = true;
      intentionalAbortRef.current = false;
      retryCountRef.current = 0;
      try {
        window.speechSynthesis.cancel();
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        setFeedback('Error starting voice recognition. Please try again.');
      }
    }
  };

  if (!recognitionRef.current) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <MicOff className="w-5 h-5" />
        <span>Voice control not supported</span>
      </div>
    );
  }

  return (
    <div className="relative flex items-center gap-2">
      <button
        onClick={toggleListening}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
          isListening 
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
        title={isListening ? 'Stop voice control' : 'Start voice control'}
      >
        {isListening ? (
          <>
            <MicOff className="w-4 h-4" />
            <span className="text-sm">Stop</span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" />
            <span className="text-sm">Voice</span>
          </>
        )}
      </button>

      {isListening && (
        <div className="flex items-center gap-1 text-green-600">
          <Volume2 className="w-4 h-4" />
          <span className="text-sm">Listening...</span>
        </div>
      )}

      {feedback && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg p-4 text-sm max-w-md z-10">
          <p className="text-gray-600">{feedback}</p>
          {transcript && (
            <p className="text-gray-500 mt-2 text-xs italic">
              You said: "{transcript}"
            </p>
          )}
          {bookingStep !== 'initial' && (
            <div className="mt-2 text-xs text-blue-600">
              Step {['initial', 'customer', 'company', 'date', 'review', 'submit'].indexOf(bookingStep)} of 5: {
                bookingStep === 'customer' ? 'Customer Name' :
                bookingStep === 'company' ? 'Company' :
                bookingStep === 'date' ? 'Meeting Date' :
                bookingStep === 'review' ? 'Review Details' :
                bookingStep === 'submit' ? 'Submit Form' : ''
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceControl;