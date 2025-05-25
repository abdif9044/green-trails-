
import React from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface TagsFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
  availableTags?: string[];
}

const TagsFilter: React.FC<TagsFilterProps> = ({
  value,
  onChange,
  availableTags = [
    'mountain views',
    'wildlife',
    'photography',
    'sunset views',
    'beach',
    'family friendly',
    'forest',
    'loop trail',
    'beginner friendly',
    'desert',
    'canyon',
    'challenging',
    'meadows',
    'wildflowers',
    'scenic views'
  ]
}) => {
  const [inputValue, setInputValue] = React.useState('');

  const addTag = (tag: string) => {
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue.trim());
        setInputValue('');
      }
    }
  };

  const suggestedTags = availableTags.filter(tag => 
    !value.includes(tag) && 
    tag.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <Label>Trail Tags</Label>
      
      <Input
        placeholder="Add tags (press Enter)"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleInputKeyPress}
      />
      
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeTag(tag)}
              />
            </Badge>
          ))}
        </div>
      )}
      
      {inputValue && suggestedTags.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Suggestions:</Label>
          <div className="flex flex-wrap gap-2">
            {suggestedTags.slice(0, 5).map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="cursor-pointer hover:bg-secondary"
                onClick={() => {
                  addTag(tag);
                  setInputValue('');
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagsFilter;
