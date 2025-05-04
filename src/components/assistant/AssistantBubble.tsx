
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
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
      
      <Button
        onClick={toggleChat}
        variant="default"
        className="rounded-full shadow-lg bg-greentrail-600 hover:bg-greentrail-700 h-14 w-14 p-0"
        aria-label="Toggle assistant chat"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
    </div>
  );
};

export default AssistantBubble;
