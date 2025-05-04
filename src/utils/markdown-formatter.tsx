
import React from 'react';
import Markdown from 'markdown-to-jsx';

interface MarkdownFormatterProps {
  markdown?: string;
  content?: string;
  className?: string;
}

export const MarkdownFormatter: React.FC<MarkdownFormatterProps> = ({ 
  markdown, 
  content,
  className 
}) => {
  // Use content prop if provided, otherwise fall back to markdown prop
  const textToRender = content || markdown || '';
  
  return (
    <div className={className}>
      <Markdown>{textToRender}</Markdown>
    </div>
  );
};

// Helper function to format markdown text
export const formatMarkdown = (text: string): string => {
  // Basic markdown formatting
  return text || '';
};
