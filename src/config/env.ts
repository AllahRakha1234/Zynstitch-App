/**
 * App environment. Swap EXPO_PUBLIC_API_URL for the real backend later.
 */
export const env = {
  apiUrl: (process.env.EXPO_PUBLIC_API_URL ?? 'https://api.example.com').replace(
    /\/$/,
    '',
  ),
  useMockApi: (process.env.EXPO_PUBLIC_USE_MOCK_API ?? 'true') === 'true',
} as const;
