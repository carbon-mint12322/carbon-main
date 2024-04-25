import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { CssBaseline } from '@mui/material';
import AlertProvider from '~/contexts/AlertContext';
import OrganizationProvider from '~/contexts/OrganizationContext';
import AuthProvider from '~/contexts/AuthDialogContext';
import ThemeProvider from '~/components/HOC/ThemeProvider';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import '~/styles/globals.css';
import { SessionProvider } from 'next-auth/react';

const EntryPublic = dynamic(() => import('~/components/Layout/_app_unauth'));
const EntryPrivate = dynamic(() => import('~/components/Layout/_app_auth'));

const publicRe = /^\/public/;
export const isPublicPage = (url: string) => publicRe.test(url);

const queryClient = new QueryClient();

const MyApp = (props: any) => {
  const {
    pageProps: { session },
  } = props;
  const router = useRouter();
  const isPublicUrl = useMemo(() => {
    return isPublicPage(router.pathname);
  }, [router]);

  return (
    <>
      <SessionProvider session={session} refetchInterval={5 * 60} refetchOnWindowFocus={true}>
        <OrganizationProvider>
          <AuthProvider>
            <CssBaseline />
            <ThemeProvider>
              <QueryClientProvider client={queryClient}>
                <AlertProvider>
                  {isPublicUrl ? <EntryPublic {...props} /> : <EntryPrivate {...props} />}{' '}
                </AlertProvider>
              </QueryClientProvider>
            </ThemeProvider>
          </AuthProvider>
        </OrganizationProvider>
      </SessionProvider>
    </>
  );
};

const propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

MyApp.propTypes = propTypes;

export default MyApp;
