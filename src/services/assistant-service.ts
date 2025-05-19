
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

// Cache for API responses to reduce duplicate calls
const responseCache = new Map<string, {response: ChatMessage, timestamp: number}>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Generates a cache key based on message and context
 */
const generateCacheKey = (
  message: string, 
  chatHistory: ChatMessage[], 
  trailContext?: TrailContext | null
): string => {
  return `${message}|${chatHistory.length}|${trailContext?.trailId || ''}`;
};

/**
 * Clears expired cache entries
 */
const cleanupCache = () => {
  const now = Date.now();
  for (const [key, value] of responseCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      responseCache.delete(key);
    }
  }
};

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
    // Check cache for recent identical questions
    const cacheKey = generateCacheKey(message, chatHistory, trailContext);
    const cachedResponse = responseCache.get(cacheKey);
    
    if (cachedResponse && (Date.now() - cachedResponse.timestamp < CACHE_TTL)) {
      console.log('Using cached assistant response');
      return cachedResponse.response;
    }
    
    // Clean up expired cache entries
    cleanupCache();
    
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
    
    // Prepare context for better assistant understanding
    let enhancedContext = null;
    
    if (trailContext) {
      const trailDetails = [
        `Trail Name: ${trailContext.trailName || 'Unknown'}`,
        `Difficulty: ${trailContext.difficulty || 'Unknown'}`,
        `Length: ${trailContext.length ? `${trailContext.length} miles` : 'Unknown'}`,
        `Elevation: ${trailContext.elevation ? `${trailContext.elevation} feet` : 'Unknown'}`,
        `Location: ${trailContext.location || 'Unknown'}`
      ].join(', ');
      
      enhancedContext = { ...trailContext, trailDetails };
    }
    
    // Call the Supabase edge function for the assistant
    const { data, error } = await supabase.functions.invoke('roamie-assistant', {
      body: { 
        message,
        chatHistory: formattedHistory,
        trailContext: enhancedContext || trailContext,
        userLocation,
        timestamp: new Date().toISOString() // Add timestamp for freshness
      }
    });
    
    if (error) {
      console.error('Assistant API error:', error);
      throw new Error(`Failed to get assistant response: ${error.message}`);
    }
    
    console.log('Received assistant response:', data);
    
    const assistantResponse = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: data.message,
      timestamp: data.timestamp || new Date().toISOString()
    };
    
    // Cache the response
    responseCache.set(cacheKey, {
      response: assistantResponse,
      timestamp: Date.now()
    });
    
    return assistantResponse;
  } catch (error) {
    console.error('Error sending message to assistant:', error);
    
    let errorMessage = "Unable to get a response from Roamie. Please try again later.";
    
    // Provide more specific error messages for common issues
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = "OpenAI API key issue. Please check your API key configuration.";
      } else if (error.message.includes('429')) {
        errorMessage = "Rate limit exceeded. Please try again in a few minutes.";
      } else if (error.message.includes('timeout') || error.message.includes('network')) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
    }
    
    toast({
      title: "Assistant error",
      description: errorMessage,
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
    // Validate API key format (basic check)
    if (!apiKey.startsWith('sk-') || apiKey.length < 20) {
      toast({
        title: "Invalid API Key",
        description: "The API key format appears to be incorrect. Please check and try again.",
        variant: "destructive",
      });
      return false;
    }
    
    const { error } = await supabase.functions.invoke('set-openai-key', {
      body: { apiKey }
    });
    
    if (error) {
      console.error('Error saving API key:', error);
      toast({
        title: "Error Saving API Key",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "API Key Saved",
      description: "Your OpenAI API key has been securely stored.",
      variant: "success",
    });
    
    return true;
  } catch (error) {
    console.error('Error saving API key:', error);
    toast({
      title: "Error Saving API Key",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Saves chat history to local storage for persistence between sessions
 */
export const saveChatHistory = (chatHistory: ChatMessage[]): void => {
  try {
    localStorage.setItem('greentrails_chat_history', JSON.stringify(chatHistory));
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
};

/**
 * Loads chat history from local storage
 */
export const loadChatHistory = (): ChatMessage[] => {
  try {
    const savedHistory = localStorage.getItem('greentrails_chat_history');
    return savedHistory ? JSON.parse(savedHistory) : [];
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
};
