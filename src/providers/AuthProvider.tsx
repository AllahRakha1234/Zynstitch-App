import React, {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import {
  clearNativeAccessToken,
  configureApiClient,
  fetchCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
} from '@/api';
import type { IUserProfile, LoginFormValues } from '@/types/users.types';

type AuthContextValue = {
  session: string | null;
  user: IUserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (values: LoginFormValues) => Promise<{ success: boolean; message: string }>;
  signOut: () => Promise<void>;
  updateUser: (profile: IUserProfile) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useSession must be used within AuthProvider');
  }
  return value;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(() => {
    clearNativeAccessToken();
    setUser(null);
  }, []);

  useEffect(() => {
    configureApiClient({
      onUnauthorized: clearSession,
    });
  }, [clearSession]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const response = await fetchCurrentUser();
      if (cancelled) return;
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (values: LoginFormValues) => {
    const response = await loginRequest(values);
    if (!response.success || !response.data) {
      return { success: false, message: response.message };
    }

    setUser(response.data);
    return { success: true, message: response.message };
  }, []);

  const signOut = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const updateUser = useCallback((profile: IUserProfile) => {
    setUser(profile);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session: user?.id ?? null,
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      signIn,
      signOut,
      updateUser,
    }),
    [user, isLoading, signIn, signOut, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
