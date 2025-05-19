
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useGeolocation } from '@/hooks/use-geolocation';
import { 
  sendMessageToAssistant, 
  checkAssistantAvailability,
  ChatMessage, 
  TrailContext, 
  UserLocation 
} from '@/services/assistant-service';

export const useAssistantChat = (initialTrailContext?: TrailContext | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiKeyConfigured, setIsApiKeyConfigured] = useState<boolean | null>(null);
  const [trailContext, setTrailContext] = useState<TrailContext | null>(initialTrailContext || null);
  const { user } = useAuth();
  const { location } = useGeolocation();
  
  // Check if OpenAI API key is configured
  useEffect(() => {
    const checkApiKey = async () => {
      const isConfigured = await checkAssistantAvailability();
      setIsApiKeyConfigured(isConfigured);
    };
    
    checkApiKey();
  }, []);
  
  // Function to send a message to the assistant
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    // Create user message
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    
    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Get user location if available
      let userLocation: UserLocation | null = null;
      if (location && location.coords) {
        userLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy
        };
      }
      
      // Send message to assistant
      const assistantMessage = await sendMessageToAssistant(
        content, 
        messages, 
        trailContext,
        userLocation
      );
      
      // Add assistant reply to chat
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
    } finally {
      setIsLoading(false);
    }
  }, [messages, trailContext, location]);
  
  // Function to clear chat history
  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);
  
  // Update trail context
  const updateTrailContext = useCallback((newContext: TrailContext | null) => {
    setTrailContext(newContext);
  }, []);
  
  return {
    messages,
    isLoading,
    isApiKeyConfigured,
    sendMessage,
    clearChat,
    trailContext,
    updateTrailContext,
  };
};
