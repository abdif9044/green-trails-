
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface TrailContext {
  trailId?: string;
  trailName?: string;
  difficulty?: string;
  length?: number;
  elevation?: number;
  location?: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

/**
 * Sends a message to the Roamie Assistant and gets a response
 */
export const sendMessageToAssistant = async (
  message: string,
  chatHistory: ChatMessage[] = [],
  trailContext?: TrailContext | null,
  userLocation?: UserLocation | null
): Promise<ChatMessage> => {
  try {
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    const { data, error } = await supabase.functions.invoke('roamie-assistant', {
      body: { 
        message,
        chatHistory: formattedHistory,
        trailContext,
        userLocation
      }
    });
    
    if (error) {
      throw new Error(`Failed to get assistant response: ${error.message}`);
    }
    
    return {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: data.message,
      timestamp: data.timestamp
    };
  } catch (error) {
    console.error('Error sending message to assistant:', error);
    toast({
      title: "Assistant error",
      description: "Unable to get a response from Roamie. Please try again later.",
      variant: "destructive",
    });
    
    throw error;
  }
};
