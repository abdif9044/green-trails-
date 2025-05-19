
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Trash2, Settings, Save } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAssistantChat } from '@/hooks/use-assistant-chat';
import { TrailContext, ChatMessage, saveChatHistory, loadChatHistory } from '@/services/assistant-service';
import ChatMessageItem from './ChatMessageItem';
import ApiKeySetupModal from './ApiKeySetupModal';
import { useToast } from '@/hooks/use-toast';

interface AssistantChatProps {
  trailContext?: TrailContext | null;
  onClose?: () => void;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi there! 👋 I'm Roamie, your hiking assistant. How can I help you today? You can ask me about trails, hiking tips, or gear recommendations!",
  timestamp: new Date().toISOString()
};

const AssistantChat: React.FC<AssistantChatProps> = ({ trailContext, onClose }) => {
  const [input, setInput] = useState('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const { 
    messages,
    setMessages,
    isLoading,
    isApiKeyConfigured,
    sendMessage,
    clearChat,
    updateTrailContext
  } = useAssistantChat(trailContext);
  
  // Load chat history from local storage on component mount
  useEffect(() => {
    // Only load saved history if we don't already have messages
    if (messages.length === 0) {
      const savedHistory = loadChatHistory();
      if (savedHistory.length > 0) {
        setMessages(savedHistory);
      }
    }
  }, []);
  
  // Check if we need to show the API key modal
  useEffect(() => {
    if (isApiKeyConfigured === false) {
      setIsApiKeyModalOpen(true);
    }
  }, [isApiKeyConfigured]);
  
  // Update trail context if it changes
  useEffect(() => {
    updateTrailContext(trailContext);
  }, [trailContext, updateTrailContext]);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  // Handle sending a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Check if API key is configured
    if (isApiKeyConfigured === false) {
      setIsApiKeyModalOpen(true);
      return;
    }
    
    sendMessage(input);
    setInput('');
  };
  
  // Handle clearing chat history
  const handleClearChat = () => {
    clearChat();
    // Also clear from local storage
    saveChatHistory([]);
    toast({
      title: "Chat cleared",
      description: "All messages have been cleared.",
    });
  };
  
  // Handle saving chat history
  const handleSaveChat = () => {
    setIsSaving(true);
    try {
      saveChatHistory(messages);
      toast({
        title: "Chat saved",
        description: "Your conversation has been saved for next time.",
      });
    } catch (error) {
      toast({
        title: "Save error",
        description: "Could not save your conversation.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle API key setup completion
  const handleApiKeySuccess = () => {
    window.location.reload(); // Reload to refresh the API key status
  };
  
  // Display welcome message if no messages
  const displayMessages = messages.length > 0 
    ? messages 
    : [WELCOME_MESSAGE];
  
  return (
    <div className="flex flex-col h-[500px] bg-white dark:bg-greentrail-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-greentrail-50 dark:bg-greentrail-800 rounded-t-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-greentrail-800 dark:text-greentrail-100">Roamie Assistant</h3>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          )}
        </div>
      </div>
      
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
          {displayMessages.map(message => (
            <ChatMessageItem key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg max-w-[80%] flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-greentrail-600" />
                <span className="text-sm text-slate-500">Roamie is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about trails, weather, or hiking tips..."
            disabled={isLoading || isApiKeyConfigured === false}
            className="flex-grow"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !input.trim() || isApiKeyConfigured === false}
            className="bg-greentrail-600 hover:bg-greentrail-700"
          >
            <Send className="h-4 w-4" />
          </Button>
          <Button 
            type="button"
            variant="outline"
            size="icon"
            onClick={handleClearChat}
            title="Clear chat history"
            className="text-slate-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleSaveChat}
            disabled={isSaving || messages.length === 0}
            title="Save chat history"
            className="text-slate-500"
          >
            <Save className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setIsApiKeyModalOpen(true)}
            title="API Key settings"
            className="text-slate-500"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </form>
      </div>
      
      <ApiKeySetupModal
        open={isApiKeyModalOpen}
        onOpenChange={setIsApiKeyModalOpen}
        onSuccess={handleApiKeySuccess}
      />
    </div>
  );
};

export default AssistantChat;
