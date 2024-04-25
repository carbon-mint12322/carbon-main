import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { MasterDetailContext } from '~/contexts/MasterDetailContext';

const defaultDrawerWidth = 400;

function MasterDetailLayout(props) {
  const theme = useTheme();
  const { open, setOpen } = props;

  const drawerWidth = props.drawerWidth || defaultDrawerWidth;

  const { MainContent, DrawerContent, ...props2 } = props;

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const handleDrawerToggle = () => setOpen(!open);

  const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginRight: -drawerWidth,
      ...(open && {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 0,
      }),
    }),
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Main open={open} className='master'>
        <DrawerHeader />
        <MainContent {...props2} openDrawer={handleDrawerOpen} closeDrawer={handleDrawerClose} />
      </Main>
      <Drawer
        className='drawer'
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
        variant='persistent'
        anchor='right'
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        {open && <DrawerContent openDrawer={handleDrawerOpen} closeDrawer={handleDrawerClose} />}
      </Drawer>
    </Box>
  );
}

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

/**
 * This wrapper component implements a communication protocol between
 * the main content and the detail content, via objectId field. It
 * uses the Layout component defined above.
 */
export default function MainDrawerWrapper({ MainContent, DrawerContent, ...props }) {
  const [objectId, setObjectId] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const contextValue = {
    open,
    objectId,
    reset: (flag, id) => {
      setOpen(flag);
      setObjectId(id);
    },
    setOpen: (flag) => {
      setOpen(flag);
    },
    setObjectId: (id) => {
      setObjectId(id);
    },
  };

  return (
    <MasterDetailContext.Provider value={contextValue}>
      <MasterDetailLayout
        {...props}
        open={open}
        setOpen={setOpen}
        MainContent={MainContent}
        DrawerContent={DrawerContent}
      />
    </MasterDetailContext.Provider>
  );
}
