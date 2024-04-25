import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Grow from '@mui/material/Grow';
import Stack from '@mui/material/Stack';

import { useUser } from '~/contexts/AuthDialogContext';

const LeftMenu = dynamic(import('~/components/NavBar'));
import UserMenu from '~/components/UserMenu';

/* Move this to a separate file */
function AppLayout(props: any) {
  const { Component, pageProps } = props;
  return (
    <>
      <Stack direction='row' spacing={1}>
        <Box>
          <LeftMenuWrap />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Component sx={{ width: 600 }} {...pageProps} />
        </Box>
      </Stack>
      <Box sx={userMenuStyle}>
        <UserMenuWrap />
      </Box>
    </>
  );
}

const userMenuStyle = {
  position: 'absolute',
  top: 4,
  right: 64,
};

const LeftMenuWrap = (props: any) => (useUser().user ? <LeftMenu {...props} /> : null);

const UserMenuWrap = (props: any) => (useUser().user ? <UserMenu {...props} /> : null);

export default AppLayout;
