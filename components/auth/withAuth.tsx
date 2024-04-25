import { onAuthStateChanged } from 'firebase/auth';
import { getAuth } from '../../utils/initAuth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import rbac from '~/static/rbac/acl.json';
import { useUser } from '~/contexts/AuthDialogContext';

const LOGIN_PAGE = rbac.LOGIN_PAGE; //"/public/login";

const withAuth = (Component: any) => {
  // eslint-disable-next-line react/display-name
  return (props: any) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const router = useRouter();
    const publicRoutes = rbac.public;
    const getCurrentPage = () => router.pathname;
    const authCtx = useUser();

    useEffect(() => {
      if (authCtx.getUser()) {
        setLoggedIn(true);
      } else {
        let path = LOGIN_PAGE;
        router.push(path);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return loggedIn ? <Component {...props} /> : <></>;
  };
};

// const withAuth = (Component: any) => (props: any) =>
//   <Component {...props} />;

export default withAuth;
