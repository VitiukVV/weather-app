'use client';

import { theme } from '@/styles/theme';
import { CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';

import { PersistGate } from 'redux-persist/integration/react';

import { persistor } from '@/store/store';
import { store } from '@/store/store';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <AppRouterCacheProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <Toaster />
            <CssBaseline />
            <QueryClientProvider client={queryClient}>
              <main style={{ padding: '2rem' }}>{children}</main>
            </QueryClientProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </AppRouterCacheProvider>
  );
}
