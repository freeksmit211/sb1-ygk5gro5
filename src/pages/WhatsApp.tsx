import React, { useState } from 'react';
import { MessageSquare, RefreshCw } from 'lucide-react';

const WhatsApp: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="p-4 md:p-6 h-[calc(100vh-4rem)] flex flex-col">
      <h1 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 md:w-8 md:h-8" />
        WhatsApp Web
      </h1>
      
      <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden relative min-h-[500px]">
        {isLoading && (
          <div className="absolute inset-0 bg-white flex flex-col items-center justify-center">
            <RefreshCw className="w-8 h-8 text-[#25D366] animate-spin mb-4" />
            <p className="text-gray-600">Loading WhatsApp Web...</p>
          </div>
        )}
        
        <iframe
          src="https://web.whatsapp.com"
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          allow="camera; microphone; display-capture"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
        />
      </div>
    </div>
  );
};

export default WhatsApp;