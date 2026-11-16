import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';

import { env } from '@/config/env';

const ACCESS_TOKEN_COOKIE = 'access_token';

type UnauthorizedHandler = () => void;

let onUnauthorized: UnauthorizedHandler = () => undefined;
let nativeAccessToken: string | null = null;

export function configureApiClient(options: {
  onUnauthorized?: UnauthorizedHandler;
}) {
  if (options.onUnauthorized) {
    onUnauthorized = options.onUnauthorized;
  }
}

export function clearNativeAccessToken() {
  nativeAccessToken = null;
}

function readSetCookieHeader(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);
  return [String(value)];
}

function extractAccessToken(setCookieHeader: unknown): string | undefined | null {
  const entries = readSetCookieHeader(setCookieHeader);
  if (entries.length === 0) {
    return undefined;
  }

  for (const entry of entries) {
    const match = entry.match(new RegExp(`${ACCESS_TOKEN_COOKIE}=([^;]*)`));
    if (!match) continue;
    const value = match[1];
    if (!value) return null;
    return decodeURIComponent(value);
  }

  return undefined;
}

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 20000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (Platform.OS !== 'web' && nativeAccessToken) {
    config.headers.Cookie = `${ACCESS_TOKEN_COOKIE}=${encodeURIComponent(nativeAccessToken)}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    if (Platform.OS !== 'web') {
      const token = extractAccessToken(response.headers['set-cookie']);
      if (token) {
        nativeAccessToken = token;
      } else if (token === null) {
        nativeAccessToken = null;
      }
    }
    return response;
  },
  (error: AxiosError) => {
    if (Platform.OS !== 'web') {
      const token = extractAccessToken(error.response?.headers?.['set-cookie']);
      if (token) {
        nativeAccessToken = token;
      }
    }
    const requestUrl = String(error.config?.url ?? '');
    const isAuthHandshake =
      requestUrl.includes('/api/auth/login') ||
      requestUrl.includes('/api/auth/me') ||
      requestUrl.includes('/api/auth/logout');
    if (error.response?.status === 401 && !isAuthHandshake) {
      nativeAccessToken = null;
      onUnauthorized();
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error: unknown, fallback = 'Unexpected error') {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message ?? error.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
