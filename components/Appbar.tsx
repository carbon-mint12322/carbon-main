import * as React from 'react';
import AppBarMenu from '../components/common/AppBarMenu';
import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

import { useUser } from '~/contexts/AuthDialogContext';

const drawerWidth = 0;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  height: 64,
  background: '#fff',
  borderRadius: 0,
  color: '#000',
  boxShadow: 'inset 0px -1px 0px rgba(0, 0, 0, 0.05)',
  zIndex: theme.zIndex.drawer + 1,
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function AppbarPage(props: any) {
  const { user } = useUser();
  if (!user) return null;
  const menuIconStyles = {
    marginRight: props.open ? 2 : 2.2,
    ...(props?.open && { display: 'none' }),
  };
  return (
    <AppBar position='fixed' open={props?.open} elevation={0}>
      <AppBarMenu
        src={props?.src}
        styles={props?.styles}
        appbarStyles={props?.styles.appbarStyles}
        flex={props?.styles.flex}
        labelStyle={props?.styles.labelStyle}
        dropdownStyles={props?.styles.dropdownStyles}
        handleClickOpen={props.handleClickOpen}
        val={props.val}
        label={props.label}
        operatorItems={props?.operatorItems}
        open={props?.open}
        handleChangeEvent={props.onCollapseEvent}
        menuIconStyles={menuIconStyles}
        openModal={props.openModal}
        handleOnCloseModal={props.handleOnCloseModal}
        logoStyles={props?.styles.logoStyles}
        handleChangeOperator={props.handleChangeOperator}
        toggleNotification={props.toggleNotification}
      />
    </AppBar>
  );
}
