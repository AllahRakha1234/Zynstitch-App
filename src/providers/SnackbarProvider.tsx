import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Snackbar } from 'react-native-paper';

import { t } from '@/i18n/en';

type SnackKind = 'success' | 'error' | 'info';

interface SnackbarContextValue {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined);

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }
  return context;
}

export default function SnackbarProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [kind, setKind] = useState<SnackKind>('info');

  const show = useCallback((text: string, nextKind: SnackKind) => {
    setMessage(t(text));
    setKind(nextKind);
    setVisible(true);
  }, []);

  const value = useMemo<SnackbarContextValue>(
    () => ({
      showSuccess: (text) => show(text, 'success'),
      showError: (text) => show(text, 'error'),
      showInfo: (text) => show(text, 'info'),
    }),
    [show],
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3200}
        style={{ backgroundColor: kind === 'error' ? '#b3261e' : kind === 'success' ? '#2e7d32' : undefined }}
      >
        {message}
      </Snackbar>
    </SnackbarContext.Provider>
  );
}
