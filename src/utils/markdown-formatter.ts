
/**
 * Enhanced markdown formatter for legal content
 * Converts markdown syntax to HTML with GreenTrails styling
 */
export const formatMarkdown = (content: string): string => {
  if (!content) return '';
  
  // Convert headers
  let html = content
    // Headers
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-4">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-greentrail-700 dark:text-greentrail-300 mt-6 mb-3">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium text-greentrail-700 dark:text-greentrail-300 mt-5 mb-2">$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4 class="text-base font-medium text-greentrail-600 dark:text-greentrail-400 mt-4 mb-2">$1</h4>')
    
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    
    // Lists
    .replace(/^\- (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
    
    // Wrap lists in ul tags
    .replace(/(<li.*<\/li>)/gims, '<ul class="list-disc mb-4 pl-4">$1</ul>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-greentrail-600 dark:text-greentrail-400 hover:underline">$1</a>')
    
    // Paragraphs and line breaks
    .replace(/\n\n/gim, '</p><p class="mb-4">')
    .replace(/\n/gim, '<br>');
  
  // Wrap in paragraph tags if not already done
  if (!html.startsWith('<h') && !html.startsWith('<p')) {
    html = '<p class="mb-4">' + html + '</p>';
  }
    
  return html;
};
