
import React from 'react';

interface MarkdownFormatterProps {
  content: string;
}

export const MarkdownFormatter: React.FC<MarkdownFormatterProps> = ({ content }) => {
  if (!content) {
    return null;
  }

  // Very basic Markdown parsing - for a production app, you'd want to use a library like react-markdown
  // This is just a simple implementation to make it work
  
  const formatMarkdown = (text: string): React.ReactNode => {
    // Replace headers
    text = text.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    text = text.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    text = text.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    
    // Replace bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace italic
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Replace links
    text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Replace lists
    text = text.replace(/^\- (.*?)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*?<\/li>)(?!<li>)/gs, '<ul>$1</ul>');
    
    // Replace paragraphs - must be done last
    text = text.replace(/(?<!\n<[uo]l>|<\/[uo]l>\n)(?<!\n<h[1-6]>|<\/h[1-6]>\n)(?<!\n<li>|<\/li>\n)(.*?)(?:\n|$)/g, '<p>$1</p>');

    return <div dangerouslySetInnerHTML={{ __html: text }} />;
  };

  return <div className="markdown-content">{formatMarkdown(content)}</div>;
};

export default MarkdownFormatter;
