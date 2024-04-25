import { createContext, useEffect, useState, useContext } from 'react';
import {
  onIdTokenChanged,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';
import type { UserInfo } from 'firebase/auth';
import { getAuth } from '../utils/initAuth';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

import { setIdTokenCookie, setUidCookie, clearCookies } from '../frontendlib/cookies';
import rbac from '~/static/rbac/acl.json';

import Img from 'next/image';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';

import OperatorProvider from '~/contexts/OperatorContext';
import { useAlert } from './AlertContext';
import moment from 'moment';
import axios from 'axios';
import { signOut as nextAuthSignOut, useSession } from 'next-auth/react';
import { useOrganization } from './OrganizationContext';
import { getMenuItems } from '~/static/app-config';
const LOGIN_PAGE = rbac.LOGIN_PAGE; //"/public/login";
const UNAUTHENTICATED_ENDPOINTS = [
  '/',
  '/public/login',
  '/public/crop-qr/[id]',
  'public/draw-boundaries',
];

const publicRe = /^\/public/;
const isPublicPage = (url: string) => UNAUTHENTICATED_ENDPOINTS.includes(url) || publicRe.test(url);

interface AuthDialogContextProps {
  token?: string;
  user?: UserInfo[] | null;
  logout: () => void;
  loginWithGoogle: (redirect: string) => () => void;
  getUser: () => any;
  handleUserNavigation: any;
}

const authContextDefaultValues: AuthDialogContextProps = {
  token: undefined,
  user: undefined,
  logout: () => {},
  loginWithGoogle: () => () => {},
  getUser: () => null,
  handleUserNavigation: () => null,
};

export function isTokenExpired(token: string | undefined) {
  const expiry = JSON.parse(atob((token || '').split('.')[1])).exp;
  return Math.floor(moment().add(5, 'minutes').toDate().getTime() / 1000) >= expiry;
}

const AuthDialogContext = createContext<AuthDialogContextProps>(authContextDefaultValues);

const Provider = ({ children }: any) => {
  const session = useSession();
  const [loggingIn, setLoggingIn] = useState<boolean>(false);
  const [loggingOut, setLoggingOut] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<UserInfo[] | any>(session?.data?.user);
  const [token, setToken] = useState<string | undefined>(undefined);
  const router = useRouter();
  const { organizationConfig } = useOrganization();

  const authentication = getAuth();
  const { openToast } = useAlert();

  // Based on this:
  // https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#onauthstatechanged
  //
  // We need to subscribe for both onAuthStateChanged and onIdTokenChanged
  //
  useEffect(() => {
    // const unsubscribe = onAuthStateChanged(authentication, async (user: any | null) =>
    //   handleUserNavigation(user),
    // );
  }, []);

  useEffect(() => {
    if (router.pathname === '/') {
      isUserPresent();
    }
  }, [router]);

  // useEffect(() => {
  //   const refreshIdToken = async () => {
  //     const user = authentication?.currentUser;
  //     if (user) {
  //       const idTokenResult = await user.getIdTokenResult();
  //       const expirationTime = Date.parse(idTokenResult.expirationTime);
  //       const currentTime = new Date().getTime();
  //       // If the token will expire in less than 5 minutes, refresh it
  //       if (currentTime + 300000 >= expirationTime) {
  //         const refreshedToken = await user.getIdToken(true);
  //         setToken(refreshedToken);
  //         setIdTokenCookie(refreshedToken);
  //         console.debug('Token refreshed');
  //       }
  //     }
  //   };

  //   refreshIdToken();

  //   const interval = setInterval(() => {
  //     refreshIdToken();
  //   }, 300000); // Check every 5 minutes

  //   return () => clearInterval(interval);
  // }, []);

  // All router.push() should go through these navigateTo* functions
  const navigateToPage = (path: string) => {
    console.log('NAVIGATE TO PAGE', path);
    const currentPage = router.asPath;
    if (/.*redirect=.*/.test(currentPage)) {
      const regex = /redirect=.*/;
      const matches: RegExpMatchArray | null = currentPage?.match(regex);
      const route = matches?.[0]?.split('=')?.[1];
      route &&
        router.push(route).then((res) => {
          setLoggingIn(false);
        });

      return;
    }
    router.push(path).then((res) => {
      setLoggingIn(false);
    });
  };

  const isUserPresent = () => {
    if (session.status == 'unauthenticated') {
      router.push('/public/login');
    }
  };

  const navigateToLogin = () => {
    const currentPage = router.asPath;
    if (currentPage === LOGIN_PAGE) {
      console.debug('Already on login page; refusing redirect');
      return;
    }
    if (/.*redirect=.*/.test(currentPage)) {
      console.debug('Already redirecting; refusing redirect');
      return;
    }
    const newPage = LOGIN_PAGE + '?redirect=' + currentPage;
    console.debug('going from ' + currentPage + ' to ' + newPage);
    router.push(newPage).then((res) => {
      setLoggingIn(false);
      setLoggingOut(false);
    });
  };

  const userAuth = async (user: any | null) => {
    const res = await fetch('/api/auth', {
      headers: { authorization: `Bearer ${user?.accessToken}` },
      credentials: 'include',
    });
    const data = await res.json();
    // const currentUser = authentication?.currentUser;
    // const token = await currentUser?.getIdToken(true);
    return { data: { ...data, token: 'token' } };
  };

  const userAllowedData = async (user: any | null) => {
    if (user) {
      if (localStorage.getItem('operator')) {
        return {
          data: {
            allow: true,
            operator: localStorage.getItem('operator'),
          },
        };
      } else {
        return await userAuth(user);
      }
    }
    return null;
  };

  const updateCookies = async (user: any | null) => {
    const userData: any = await userAllowedData(user);
    if (userData?.data?.allow) {
      setUserDetails(user);
      setToken(userData?.data?.token);
      setIdTokenCookie(`${userData?.data?.token}`);
      setUidCookie(user.uid);
      localStorage.setItem('operator', userData?.data?.operator);
      return userData;
    } else {
      console.debug('USER NOT allowed ');
      openToast('error', 'You are not allowed to login.');
      logout();
      return null;
    }
  };

  const getIdToken = async (user: any | null) => {
    await user.getIdToken(true);
    await updateCookies(user);
  };

  const handleUserNavigation = async (user: any | null) => {
    setLoggingIn(true);
    if (user) {
      const userData = await updateCookies(user);
      if (userData) {
        if (router.pathname === LOGIN_PAGE || router.pathname === '/') {
          navigateToPage(
            `/private/farmbook/${userData?.data?.operator}${getMenuItems().home.href}`,
          );
          return;
        }
      }
    } else {
      console.debug('NOT LOGGED IN ');
      if (!isPublicPage(router.pathname)) {
        navigateToLogin();
        return;
      }
    }
    setLoggingIn(false);
  };

  const loginWithGoogle = (redirect: string) => async () => {
    try {
      // setLoggingIn(true);
      // const provider = new GoogleAuthProvider();
      // await signInWithPopup(authentication, provider);
    } catch (error) {
      setLoggingIn(false);
      return error;
    }
  };

  const logout = async () => {
    setLoggingOut(true);
    await signOut(authentication);
    setUserDetails(null);
    clearCookies();
    navigateToLogin();
    nextAuthSignOut();
  };

  const exposed: AuthDialogContextProps = {
    token,
    user: userDetails,
    logout,
    loginWithGoogle,
    getUser: () => userDetails,
    handleUserNavigation,
  };

  if (loggingIn) {
    return <LoginLoading src={organizationConfig?.headerLogo} />;
  }

  if (loggingOut) {
    return <LogoutLoading src={organizationConfig?.headerLogo} />;
  }

  return <AuthDialogContext.Provider value={exposed}>{children}</AuthDialogContext.Provider>;
};

export const useUser = () => useContext(AuthDialogContext);

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};

const LoginModal = (props: any) => (
  <Modal open={true} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
    <Box sx={style}>
      <Grid container direction='row' alignItems='center' spacing={4}>
        <Grid item>
          <Img
            src='/assets/images/Logo-CarbonMint.svg'
            width={128}
            height={128}
            alt='Carbon Mint'
          />
        </Grid>
        <Grid item>{props.msg}</Grid>
      </Grid>
    </Box>
  </Modal>
);

export const LoginLoading = (src: any) => <LoginModal src={src} msg='Logging in...' />;
const LogoutLoading = (src: any) => <LoginModal src={src} msg='Logging out...' />;

export default Provider;
