
import { useCallback, useEffect } from 'react';
import { useUserContext } from '@/contexts/user-context';
import { getMemory, setMemory, deleteMemory } from '@/services/roamie-memory';
import { RoamieContext, defaultRoamieContext } from '@/types/roamie-memory';
import { useToast } from '@/hooks/use-toast';

/**
 * Custom hook for managing Roamie's memory system
 * Provides functions to load, save, and clear user-specific context data
 */
export function useRoamieMemory() {
  const { user, roamieContext, setRoamieContext } = useUserContext();
  const { toast } = useToast();

  /**
   * Loads memory from the backend and updates the context
   */
  const loadMemory = useCallback(async () => {
    if (!user) {
      console.log('No user found, skipping memory load');
      return;
    }

    try {
      console.log('Loading Roamie memory for user:', user.id);
      const data = await getMemory(user.id, 'roamie_context');
      
      if (data) {
        // Merge with defaults to ensure all fields are present
        const mergedContext = { ...defaultRoamieContext, ...data };
        setRoamieContext(mergedContext);
        console.log('Successfully loaded Roamie memory');
      } else {
        // No existing memory, use defaults
        setRoamieContext(defaultRoamieContext);
        console.log('No existing memory found, using defaults');
      }
    } catch (error) {
      console.error('Failed to load Roamie memory:', error);
      setRoamieContext(defaultRoamieContext);
      toast({
        title: "Memory load failed",
        description: "Using default settings. Your preferences may not be remembered.",
        variant: "destructive",
      });
    }
  }, [user, setRoamieContext, toast]);

  /**
   * Saves the updated context to the backend
   */
  const saveMemory = useCallback(async (updatedContext: RoamieContext) => {
    if (!user) {
      console.log('No user found, skipping memory save');
      return;
    }

    try {
      console.log('Saving Roamie memory for user:', user.id);
      setRoamieContext(updatedContext);
      await setMemory(user.id, 'roamie_context', updatedContext);
      console.log('Successfully saved Roamie memory');
    } catch (error) {
      console.error('Failed to save Roamie memory:', error);
      toast({
        title: "Memory save failed",
        description: "Your preferences may not be remembered across sessions.",
        variant: "destructive",
      });
    }
  }, [user, setRoamieContext, toast]);

  /**
   * Clears all memory data for the user
   */
  const clearMemory = useCallback(async () => {
    if (!user) {
      console.log('No user found, skipping memory clear');
      return;
    }

    try {
      console.log('Clearing Roamie memory for user:', user.id);
      await deleteMemory(user.id, 'roamie_context');
      setRoamieContext(defaultRoamieContext);
      console.log('Successfully cleared Roamie memory');
      toast({
        title: "Memory cleared",
        description: "All your preferences have been reset.",
      });
    } catch (error) {
      console.error('Failed to clear Roamie memory:', error);
      toast({
        title: "Memory clear failed",
        description: "There was an error clearing your preferences.",
        variant: "destructive",
      });
    }
  }, [user, setRoamieContext, toast]);

  /**
   * Updates a specific field in the context and saves it
   */
  const updateContext = useCallback(async (updates: Partial<RoamieContext>) => {
    if (!roamieContext) return;

    const updatedContext = { ...roamieContext, ...updates };
    await saveMemory(updatedContext);
  }, [roamieContext, saveMemory]);

  // Auto-load memory when user is authenticated
  useEffect(() => {
    if (user && !roamieContext) {
      loadMemory();
    }
  }, [user, roamieContext, loadMemory]);

  return {
    roamieContext,
    loadMemory,
    saveMemory,
    clearMemory,
    updateContext,
    isReady: Boolean(user && roamieContext),
  };
}
