import React, {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  type PropsWithChildren,
} from 'react';

import { configureApiClient, fetchCurrentUser, login as loginRequest, logout as logoutRequest } from '@/api';
import { useStorageState } from '@/hooks/use-storage-state';
import type { IUserProfile, LoginFormValues } from '@/types/users.types';

const SESSION_KEY = 'zynstitch.session';
const PROFILE_KEY = 'zynstitch.profile';

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
  const [[isSessionLoading, session], setSession] = useStorageState(SESSION_KEY);
  const [[isProfileLoading, profileJson], setProfileJson] = useStorageState(PROFILE_KEY);

  const user = useMemo<IUserProfile | null>(() => {
    if (!profileJson) return null;
    try {
      return JSON.parse(profileJson) as IUserProfile;
    } catch {
      return null;
    }
  }, [profileJson]);

  const clearSession = useCallback(() => {
    setSession(null);
    setProfileJson(null);
  }, [setSession, setProfileJson]);

  useEffect(() => {
    configureApiClient({
      getAccessToken: () => session,
      onUnauthorized: clearSession,
    });
  }, [session, clearSession]);

  useEffect(() => {
    if (!session || user) return;

    (async () => {
      const response = await fetchCurrentUser();
      if (response.success && response.data) {
        setProfileJson(JSON.stringify(response.data));
      } else {
        clearSession();
      }
    })();
  }, [session, user, setProfileJson, clearSession]);

  const signIn = useCallback(
    async (values: LoginFormValues) => {
      const response = await loginRequest(values);
      if (!response.success || !response.data) {
        return { success: false, message: response.message };
      }

      setSession(response.data.token);
      setProfileJson(JSON.stringify(response.data.user));
      return { success: true, message: response.message };
    },
    [setSession, setProfileJson],
  );

  const signOut = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const updateUser = useCallback(
    (profile: IUserProfile) => {
      setProfileJson(JSON.stringify(profile));
    },
    [setProfileJson],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      isLoading: isSessionLoading || isProfileLoading,
      isAuthenticated: Boolean(session),
      signIn,
      signOut,
      updateUser,
    }),
    [
      session,
      user,
      isSessionLoading,
      isProfileLoading,
      signIn,
      signOut,
      updateUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
