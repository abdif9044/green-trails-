
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
    // Format chat history to include only necessary fields for the API
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Log the request for debugging purposes
    console.log('Sending to assistant:', {
      message,
      historyLength: formattedHistory.length,
      hasTrailContext: !!trailContext,
      hasLocation: !!userLocation
    });
    
    // Call the Supabase edge function for the assistant
    const { data, error } = await supabase.functions.invoke('roamie-assistant', {
      body: { 
        message,
        chatHistory: formattedHistory,
        trailContext,
        userLocation
      }
    });
    
    if (error) {
      console.error('Assistant API error:', error);
      throw new Error(`Failed to get assistant response: ${error.message}`);
    }
    
    console.log('Received assistant response:', data);
    
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

/**
 * Checks if the OpenAI API key is configured
 */
export const checkAssistantAvailability = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('check-openai-key');
    
    if (error) {
      console.error('Error checking assistant availability:', error);
      return false;
    }
    
    return data?.keyExists || false;
  } catch (error) {
    console.error('Error checking assistant availability:', error);
    return false;
  }
};

/**
 * Saves a new OpenAI API key to the Supabase Edge Function environment
 */
export const saveOpenAIApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const { error } = await supabase.functions.invoke('set-openai-key', {
      body: { apiKey }
    });
    
    if (error) {
      console.error('Error saving API key:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving API key:', error);
    return false;
  }
};
