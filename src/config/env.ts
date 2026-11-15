import Constants from 'expo-constants';
import { Platform } from 'react-native';

const configuredApiUrl = (
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'
).replace(/\/$/, '');

function metroDevHost(): string | null {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.linkingUri ??
    Constants.experienceUrl;
  if (!hostUri) return null;

  const host = hostUri.replace(/^[a-z]+:\/\//i, '').split('/')[0]?.split(':')[0];
  if (!host || host === 'localhost' || host === '127.0.0.1') {
    return null;
  }
  return host;
}

function resolveApiUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const isLoopback =
      parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
    if (!isLoopback || Platform.OS === 'web') {
      return parsed.toString().replace(/\/$/, '');
    }

    const host = metroDevHost();
    if (host) {
      parsed.hostname = host;
      return parsed.toString().replace(/\/$/, '');
    }

    if (Platform.OS === 'android') {
      parsed.hostname = '10.0.2.2';
      return parsed.toString().replace(/\/$/, '');
    }
  } catch {
    return url;
  }

  return url;
}

export const env = {
  apiUrl: resolveApiUrl(configuredApiUrl),
  /**
   * Mock data for modules the Nest API does not implement yet.
   * Auth and customers always talk to EXPO_PUBLIC_API_URL.
   */
  useMockApi: (process.env.EXPO_PUBLIC_USE_MOCK_API ?? 'true') === 'true',
} as const;
