
import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export const useTextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback(async (text: string, voice: string = 'alloy') => {
    if (!text || isLoading) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audioSrc = `data:audio/mpeg;base64,${data.audioContent}`;
      const newAudio = new Audio(audioSrc);
      audioRef.current = newAudio;

      newAudio.play().catch(e => console.error("Audio play failed", e));

      newAudio.onplay = () => setIsPlaying(true);
      newAudio.onended = () => setIsPlaying(false);
      newAudio.onpause = () => setIsPlaying(false);

    } catch (error: any) {
      console.error('Error in text-to-speech:', error);
      toast({
        title: 'Speech Error',
        description: 'Could not generate audio. Please ensure your OpenAI API key is configured correctly in the assistant settings.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, toast]);

  return { speak, isPlaying, isLoading };
};
