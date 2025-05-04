
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelative } from 'date-fns';
import { ChatMessage } from '@/services/assistant-service';

interface ChatMessageItemProps {
  message: ChatMessage;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  const formatTime = (timestamp: string) => {
    try {
      return formatRelative(new Date(timestamp), new Date());
    } catch (e) {
      return '';
    }
  };
  
  // Function to render message content with simple markdown-like formatting
  const renderContent = (content: string) => {
    // Split by new lines and render paragraphs
    return content.split('\n').map((line, i) => {
      // If line is empty, return a line break
      if (!line.trim()) return <br key={i} />;
      
      // Check if line is a list item
      if (line.trim().startsWith('- ')) {
        return (
          <li key={i} className="ml-4">
            {line.trim().substring(2)}
          </li>
        );
      }
      
      // Check if line is a heading
      if (line.trim().startsWith('## ')) {
        return (
          <h3 key={i} className="font-bold text-lg mt-2 mb-1">
            {line.trim().substring(3)}
          </h3>
        );
      }
      
      if (line.trim().startsWith('# ')) {
        return (
          <h2 key={i} className="font-bold text-xl mt-3 mb-2">
            {line.trim().substring(2)}
          </h2>
        );
      }
      
      // Regular paragraph
      return <p key={i} className="mb-1">{line}</p>;
    });
  };
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : ''}`}>
        {/* Avatar */}
        <Avatar className="h-8 w-8">
          {isUser ? (
            <>
              <AvatarFallback className="bg-greentrail-200 text-greentrail-800">U</AvatarFallback>
              <AvatarImage src="/assets/user-avatar.png" />
            </>
          ) : (
            <>
              <AvatarFallback className="bg-greentrail-600 text-white">R</AvatarFallback>
              <AvatarImage src="/assets/roamie-avatar.png" />
            </>
          )}
        </Avatar>
        
        {/* Message bubble */}
        <div className={`
          rounded-lg p-3 
          ${isUser 
            ? 'bg-greentrail-600 text-white' 
            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
          }
        `}>
          <div className="text-sm">
            {renderContent(message.content)}
          </div>
          <div className={`
            text-xs mt-1 text-right
            ${isUser ? 'text-greentrail-100' : 'text-slate-500'}
          `}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessageItem;
