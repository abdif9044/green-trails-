
import { supabase } from '@/integrations/supabase/client';
import { MemoryRequest, MemoryResponse, MemoryError } from '@/types/roamie-memory';

const MEMORY_API_URL = 'https://qzcplkyinvndvhnevsbt.supabase.co/functions/v1/memory-api';

/**
 * Service for managing Roamie's memory system
 * Provides functions to get, set, and delete user-specific memory data
 */

/**
 * Retrieves memory data for a specific user and key
 * @param userId - The user's unique identifier
 * @param key - The memory key to retrieve
 * @returns Promise resolving to the memory value or null if not found
 */
export async function getMemory(userId: string, key: string): Promise<any> {
  try {
    console.log(`Getting memory for user ${userId}, key: ${key}`);
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User not authenticated');
    }

    const url = new URL(MEMORY_API_URL);
    url.searchParams.set('user_id', userId);
    url.searchParams.set('key', key);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData: MemoryError = await response.json();
      throw new Error(`Failed to get memory: ${errorData.error} - ${errorData.details || ''}`);
    }

    const data: MemoryResponse = await response.json();
    console.log(`Successfully retrieved memory for user ${userId}`);
    return data.memory_value;

  } catch (error) {
    console.error('Error getting memory:', error);
    throw new Error(`Failed to retrieve memory: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Sets (upserts) memory data for a specific user and key
 * @param userId - The user's unique identifier
 * @param key - The memory key to set
 * @param value - The value to store
 */
export async function setMemory(userId: string, key: string, value: any): Promise<void> {
  try {
    console.log(`Setting memory for user ${userId}, key: ${key}`);
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User not authenticated');
    }

    const requestBody: MemoryRequest = {
      user_id: userId,
      memory_key: key,
      memory_value: value,
    };

    const response = await fetch(MEMORY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData: MemoryError = await response.json();
      throw new Error(`Failed to set memory: ${errorData.error} - ${errorData.details || ''}`);
    }

    console.log(`Successfully set memory for user ${userId}`);

  } catch (error) {
    console.error('Error setting memory:', error);
    throw new Error(`Failed to store memory: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Deletes memory data for a specific user and key
 * @param userId - The user's unique identifier
 * @param key - The memory key to delete
 */
export async function deleteMemory(userId: string, key: string): Promise<void> {
  try {
    console.log(`Deleting memory for user ${userId}, key: ${key}`);
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User not authenticated');
    }

    const url = new URL(MEMORY_API_URL);
    url.searchParams.set('user_id', userId);
    url.searchParams.set('key', key);

    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData: MemoryError = await response.json();
      throw new Error(`Failed to delete memory: ${errorData.error} - ${errorData.details || ''}`);
    }

    console.log(`Successfully deleted memory for user ${userId}`);

  } catch (error) {
    console.error('Error deleting memory:', error);
    throw new Error(`Failed to delete memory: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
