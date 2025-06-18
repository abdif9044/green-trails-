
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useGeolocation } from '@/hooks/use-geolocation';
import { 
  sendMessageToAssistant, 
  checkAssistantAvailability,
  ChatMessage, 
  TrailContext, 
  UserLocation,
  saveChatHistory 
} from '@/services/assistant-service';

export const useAssistantChat = (initialTrailContext?: TrailContext | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiKeyConfigured, setIsApiKeyConfigured] = useState<boolean | null>(null);
  const [trailContext, setTrailContext] = useState<TrailContext | null>(initialTrailContext || null);
  const { user } = useAuth();
  const { coordinates } = useGeolocation();
  
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
    setMessages(prev => {
      const updatedMessages = [...prev, userMessage];
      return updatedMessages;
    });
    
    setIsLoading(true);
    
    try {
      // Get user location if available using new coordinates structure
      let userLocation: UserLocation | null = null;
      if (coordinates) {
        userLocation = {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          accuracy: 10 // Default accuracy since it's not provided in the new structure
        };
      }
      
      // Send message to assistant with current messages for context
      const currentMessages = [...messages, userMessage];
      const assistantMessage = await sendMessageToAssistant(
        content, 
        currentMessages, 
        trailContext,
        userLocation
      );
      
      // Add assistant reply to chat
      setMessages(prev => {
        const updatedMessages = [...prev, assistantMessage];
        // Save to local storage for persistence
        saveChatHistory(updatedMessages);
        return updatedMessages;
      });
    } catch (error) {
      console.error('Error in chat:', error);
    } finally {
      setIsLoading(false);
    }
  }, [messages, trailContext, coordinates]);
  
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
    setMessages,
    isLoading,
    isApiKeyConfigured,
    sendMessage,
    clearChat,
    trailContext,
    updateTrailContext,
  };
};
