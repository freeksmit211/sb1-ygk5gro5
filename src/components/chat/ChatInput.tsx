import React, { useState } from 'react';
import { Smile, Paperclip, Mic, Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => Promise<void>;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sending || disabled) return;

    try {
      setSending(true);
      await onSendMessage(message.trim());
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-[#f0f2f5] px-4 py-3">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button
          type="button"
          className="text-[#54656f] hover:text-gray-600"
          disabled={disabled}
        >
          <Smile className="w-6 h-6" />
        </button>
        <button
          type="button"
          className="text-[#54656f] hover:text-gray-600"
          disabled={disabled}
        >
          <Paperclip className="w-6 h-6" />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-1 bg-white rounded-lg px-4 py-2 focus:outline-none"
          disabled={sending || disabled}
        />
        <button
          type="submit"
          disabled={!message.trim() || sending || disabled}
          className="text-[#54656f] hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {message.trim() ? (
            <Send className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;