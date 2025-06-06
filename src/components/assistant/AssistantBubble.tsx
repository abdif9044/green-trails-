
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import AssistantChat from './AssistantChat';
import { cn } from '@/lib/utils';

const AssistantBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 flex flex-col items-end",
      isOpen ? "w-full sm:w-[400px] md:w-[450px]" : "w-auto"
    )}>
      {isOpen && (
        <AssistantChat onClose={() => setIsOpen(false)} />
      )}
      
      <button
        onClick={toggleChat}
        className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 h-16 w-16 p-0 border-0 bg-transparent"
        aria-label="Toggle Roamie assistant chat"
      >
        <img 
          src="/lovable-uploads/f1f69aac-d6e2-4389-8835-f83b42f87d98.png" 
          alt="Roamie Assistant" 
          className="w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        />
      </button>
    </div>
  );
};

export default AssistantBubble;
