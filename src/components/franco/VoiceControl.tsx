import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceControlProps {
  onAddActivity: (date: Date) => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ onAddActivity }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const recognitionRef = useRef<any>(null);
  const isProcessingRef = useRef(false);
  const shouldRestartRef = useRef(false);
  const intentionalAbortRef = useRef(false);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 3;

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
      setFeedback('How can I help you today?');
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
  }, [speak]);

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

  const processVoiceInput = async (input: string) => {
    try {
      shouldRestartRef.current = true;
      
      if (input.includes('schedule') || input.includes('book') || input.includes('new')) {
        const date = new Date();
        onAddActivity(date);
        const successText = "Opening the activity form. Please fill in the details.";
        setFeedback(successText);
        await speak(successText);
      } else {
        const helpText = "Please say 'schedule activity' to begin";
        setFeedback(helpText);
        await speak(helpText);
      }
    } catch (error) {
      console.error('Error processing voice input:', error);
      const errorText = 'Sorry, there was an error. Please try again.';
      setFeedback(errorText);
      await speak(errorText);
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
        </div>
      )}
    </div>
  );
};

export default VoiceControl;