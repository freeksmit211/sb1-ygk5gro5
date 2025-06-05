import React from 'react';
import { MessageSquare } from 'lucide-react';
import RepFeedbackSection from '../sales/RepFeedbackSection';

const SalesRepFeedbackSections: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-white" />
        <h2 className="text-xl font-bold text-white">Sales Rep Feedback</h2>
      </div>

      <div className="grid gap-6">
        {/* Franco's Feedback - Only show latest */}
        <RepFeedbackSection 
          repId="franco" 
          repName="Franco" 
          showLatestOnly={true}
          viewAllPath="/feedback/franco"
        />

        {/* Freek's Feedback - Only show latest */}
        <RepFeedbackSection 
          repId="freek" 
          repName="Freek" 
          showLatestOnly={true}
          viewAllPath="/feedback/freek"
        />

        {/* Jeckie's Feedback - Only show latest */}
        <RepFeedbackSection 
          repId="jeckie" 
          repName="Jeckie" 
          showLatestOnly={true}
          viewAllPath="/feedback/jeckie"
        />
      </div>
    </div>
  );
};

export default SalesRepFeedbackSections;