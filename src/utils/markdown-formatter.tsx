
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
  className = "prose prose-green dark:prose-invert"
}) => {
  // Use content prop if provided, otherwise fall back to markdown prop
  const textToRender = content || markdown || '';
  
  return (
    <div className={className}>
      <Markdown>{textToRender}</Markdown>
    </div>
  );
};
