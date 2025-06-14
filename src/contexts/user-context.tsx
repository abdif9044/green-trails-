
import * as React from 'react';
import { User } from '@supabase/supabase-js';
import { useAuth } from '@/hooks/use-auth';
import { RoamieContext, defaultRoamieContext } from '@/types/roamie-memory';

interface UserContextType {
  user: User | null;
  loading: boolean;
  roamieContext: RoamieContext | null;
  setRoamieContext: (ctx: RoamieContext) => void;
}

const UserContext = React.createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [roamieContext, setRoamieContext] = React.useState<RoamieContext | null>(null);

  React.useEffect(() => {
    if (user && !roamieContext) {
      setRoamieContext(defaultRoamieContext);
    } else if (!user) {
      setRoamieContext(null);
    }
  }, [user, roamieContext]);

  const value: UserContextType = {
    user,
    loading,
    roamieContext,
    setRoamieContext,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
