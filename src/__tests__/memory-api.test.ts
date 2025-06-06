
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getMemory, setMemory, deleteMemory } from '@/services/roamie-memory';

// Mock Supabase client
const mockSupabase = {
  auth: {
    getSession: vi.fn(),
  },
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase,
}));

// Mock fetch
global.fetch = vi.fn();

describe('Roamie Memory Service', () => {
  const mockSession = {
    access_token: 'mock-token',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
    });
  });

  describe('getMemory', () => {
    it('should successfully retrieve memory', async () => {
      const mockResponse = {
        memory_value: { test: 'data' },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await getMemory('user-id', 'test-key');
      
      expect(result).toEqual({ test: 'data' });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('user_id=user-id&key=test-key'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token',
          }),
        })
      );
    });

    it('should handle authentication error', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      await expect(getMemory('user-id', 'test-key')).rejects.toThrow('User not authenticated');
    });

    it('should handle fetch error', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Server error' }),
      });

      await expect(getMemory('user-id', 'test-key')).rejects.toThrow('Failed to get memory');
    });
  });

  describe('setMemory', () => {
    it('should successfully set memory', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await setMemory('user-id', 'test-key', { test: 'data' });
      
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token',
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            user_id: 'user-id',
            memory_key: 'test-key',
            memory_value: { test: 'data' },
          }),
        })
      );
    });
  });

  describe('deleteMemory', () => {
    it('should successfully delete memory', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await deleteMemory('user-id', 'test-key');
      
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('user_id=user-id&key=test-key'),
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token',
          }),
        })
      );
    });
  });
});
