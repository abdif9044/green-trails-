
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRoamieMemory } from '@/hooks/use-roamie-memory';
import { UserProvider } from '@/contexts/user-context';
import { defaultRoamieContext } from '@/types/roamie-memory';

// Mock the services
vi.mock('@/services/roamie-memory', () => ({
  getMemory: vi.fn(),
  setMemory: vi.fn(),
  deleteMemory: vi.fn(),
}));

vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' },
    loading: false,
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <UserProvider>{children}</UserProvider>
);

describe('useRoamieMemory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default context', async () => {
    const { result } = renderHook(() => useRoamieMemory(), { wrapper });
    
    expect(result.current.roamieContext).toEqual(defaultRoamieContext);
  });

  it('should update context', async () => {
    const { result } = renderHook(() => useRoamieMemory(), { wrapper });
    
    const newContext = {
      ...defaultRoamieContext,
      preferredTrailDifficulty: 'hard' as const,
    };

    await act(async () => {
      await result.current.updateContext({ preferredTrailDifficulty: 'hard' });
    });

    expect(result.current.roamieContext?.preferredTrailDifficulty).toBe('hard');
  });
});
