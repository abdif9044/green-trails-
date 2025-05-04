
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useGeolocation } from '@/hooks/use-geolocation';
import { sendMessageToAssistant, ChatMessage, TrailContext, UserLocation } from '@/services/assistant-service';

export const useAssistantChat = (initialTrailContext?: TrailContext | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [trailContext, setTrailContext] = useState<TrailContext | null>(initialTrailContext || null);
  const { user } = useAuth();
  const { position } = useGeolocation();
  
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
      if (position) {
        userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
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
  }, [messages, trailContext, position]);
  
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
    sendMessage,
    clearChat,
    trailContext,
    updateTrailContext,
  };
};
