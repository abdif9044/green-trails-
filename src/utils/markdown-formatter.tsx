
import React from 'react';
import Markdown from 'markdown-to-jsx';

interface MarkdownFormatterProps {
  markdown: string;
  className?: string;
}

export const MarkdownFormatter: React.FC<MarkdownFormatterProps> = ({ markdown, className }) => {
  return (
    <div className={className}>
      <Markdown>{markdown}</Markdown>
    </div>
  );
};

// Helper function to format markdown text
export const formatMarkdown = (text: string): string => {
  // Basic markdown formatting
  return text || '';
};
