"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { AuthUser, getMe, signOut as apiSignOut } from "@/lib/api/auth";
import { getAccessToken } from "@/lib/api/client";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  signOut: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signOut: () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await getMe();
      setUser(userData);
    } catch {
      setUser(null);
      apiSignOut();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const handleSignOut = useCallback(() => {
    apiSignOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signOut: handleSignOut, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
