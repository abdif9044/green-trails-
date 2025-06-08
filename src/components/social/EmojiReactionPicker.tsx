
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SmilePlus } from 'lucide-react';

const REACTION_CATEGORIES = {
  general: ['❤️', '👍', '👏', '😂', '😍', '🤩'],
  hiking: ['🥾', '⛰️', '🌲', '🏔️', '🌿', '🗻'],
  weather: ['☀️', '🌙', '⭐', '🌧️', '❄️', '🌈'],
  nature: ['🦋', '🐻', '🦅', '🌺', '🍄', '🌊'],
  adventure: ['🔥', '💪', '🎯', '⚡', '🚀', '🏆']
};

interface EmojiReactionPickerProps {
  onReactionSelect: (emoji: string) => void;
  currentUserReaction?: string | null;
}

const EmojiReactionPicker: React.FC<EmojiReactionPickerProps> = ({
  onReactionSelect,
  currentUserReaction
}) => {
  const [open, setOpen] = useState(false);

  const handleReactionClick = (emoji: string) => {
    onReactionSelect(emoji);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {currentUserReaction ? (
            <span className="mr-1 text-base">{currentUserReaction}</span>
          ) : (
            <SmilePlus className="h-4 w-4 mr-1" />
          )}
          <span className="text-xs">React</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3" align="start">
        <div className="space-y-3">
          {Object.entries(REACTION_CATEGORIES).map(([category, emojis]) => (
            <div key={category}>
              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 capitalize">
                {category}
              </h4>
              <div className="grid grid-cols-6 gap-1">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-xl ${
                      currentUserReaction === emoji ? 'bg-gray-100 dark:bg-gray-800' : ''
                    }`}
                    onClick={() => handleReactionClick(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EmojiReactionPicker;
