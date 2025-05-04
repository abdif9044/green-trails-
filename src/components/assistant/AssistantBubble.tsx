
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, X, MinusSquare } from "lucide-react";
import AssistantChat from './AssistantChat';
import ApiKeySetupModal from './ApiKeySetupModal';
import { TrailContext } from '@/services/assistant-service';
import { useTrail } from '@/features/trails';
import { supabase } from '@/integrations/supabase/client';

interface AssistantBubbleProps {
  trailId?: string;
  initiallyOpen?: boolean;
}

const AssistantBubble: React.FC<AssistantBubbleProps> = ({ 
  trailId, 
  initiallyOpen = false 
}) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyChecked, setApiKeyChecked] = useState(false);
  
  // If we have a trail ID, fetch the trail data for context
  const { data: trail } = useTrail(trailId, {
    enabled: !!trailId,
  });
  
  // Build trail context if available
  const trailContext: TrailContext | null = trail ? {
    trailId: trail.id,
    trailName: trail.name,
    difficulty: trail.difficulty,
    length: trail.length,
    elevation: trail.elevation,
    location: `${trail.location}, ${trail.state_province}, ${trail.country}`
  } : null;
  
  // Check if OpenAI API key is set
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-openai-key');
        
        if (error || !data.keyExists) {
          setShowApiKeyModal(true);
        }
        
        setApiKeyChecked(true);
      } catch (error) {
        console.error('Error checking OpenAI API key:', error);
        setApiKeyChecked(true);
      }
    };
    
    if (isOpen && !apiKeyChecked) {
      checkApiKey();
    }
  }, [isOpen, apiKeyChecked]);
  
  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
    }
  };
  
  const minimizeChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(true);
  };
  
  const handleApiKeySuccess = () => {
    // API key has been set successfully
    setApiKeyChecked(true);
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {isOpen && !isMinimized && (
        <div className="w-full sm:w-96 bg-white dark:bg-greentrail-900 shadow-lg rounded-lg mb-2 overflow-hidden border border-gray-200 dark:border-greentrail-700 flex flex-col">
          <div className="p-3 bg-greentrail-600 text-white flex justify-between items-center">
            <h3 className="font-semibold">Roamie Assistant</h3>
            <div className="flex space-x-1">
              <Button
                variant="ghost" 
                size="icon"
                className="h-6 w-6 text-white hover:bg-greentrail-500"
                onClick={minimizeChat}
              >
                <MinusSquare className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-6 w-6 text-white hover:bg-greentrail-500" 
                onClick={toggleChat}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <AssistantChat trailContext={trailContext} />
        </div>
      )}
      
      {isMinimized && (
        <div 
          className="bg-greentrail-600 text-white px-4 py-2 rounded-lg mb-2 shadow-lg cursor-pointer flex items-center"
          onClick={() => setIsMinimized(false)}
        >
          <span className="mr-2">Roamie Assistant</span>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-6 w-6 text-white hover:bg-greentrail-500" 
          >
            <MinusSquare className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <Button 
        onClick={toggleChat}
        size="lg"
        className={`rounded-full p-3 h-14 w-14 flex items-center justify-center shadow-lg ${
          isOpen ? 'bg-greentrail-700 hover:bg-greentrail-800' : 'bg-greentrail-600 hover:bg-greentrail-700'
        }`}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
      
      {/* API Key Setup Modal */}
      <ApiKeySetupModal 
        open={showApiKeyModal}
        onOpenChange={setShowApiKeyModal}
        onSuccess={handleApiKeySuccess}
      />
    </div>
  );
};

export default AssistantBubble;
