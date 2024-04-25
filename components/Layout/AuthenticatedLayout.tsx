import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import { Analytics } from '@vercel/analytics/react';
import { useUser } from '~/contexts/AuthDialogContext';

import Paper from '@mui/material/Paper';
import styles from '~/styles/theme/brands/styles';

import { AppConfigContext } from '~/contexts/AppConfigContext';
import { ProvideTitleBar } from '~/contexts/TitleBar/TitleBarProvider';

import LeftMenu from '~/components/NavBar';
import Appbar from '~/components/Appbar';
import BreadCrumbMenu from '~/components/BreadCrumbMenu';
import TitleBarContent from '~/components/TitleBar';
import { useOrganization } from '~/contexts/OrganizationContext';
import NotificationsBar from '~/container/NotificationsBar';
import axios from 'axios';
import CircularLoader from '~/components/common/CircularLoader';
import { useOperator } from '~/contexts/OperatorContext';
import { useRouter } from 'next/router';
import { intersection } from 'ramda';

const PaperWrap = (props: any) => {
  const { user } = useUser();
  const { children } = props;
  return (
    <Paper elevation={0} sx={user ? styles.bodyPaperLayout : null}>
      {children}
    </Paper>
  );
};

const LeftMenuWrap = (props: any) => <LeftMenu {...props} />;

const BreadcrumbWrap = ({ menuItems }: any) => {
  return useUser().user ? (
    <Grid item sx={styles.breadCrumb}>
      <BreadCrumbMenu menuItems={menuItems} styles={styles} />
    </Grid>
  ) : null;
};

const AppbarWrap = (props: any) => {
  const { organizationConfig } = useOrganization();

  return <Appbar src={organizationConfig?.headerLogo} {...props} />;
};

const propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};

const AuthenticatedLayout = (props: any) => {
  const { Component, pageProps } = props;
  const { pageConfig } = pageProps;

  const [openOperator, setOpenOperator] = React.useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [open, setOpen] = React.useState(false);

  const { agentData, operator, setOperator, loading } = useOperator();
  const router = useRouter();
  const onCollapse = () => setOpen(!open);

  const toggleNotification = () => {
    setOpenNotification(!openNotification);
  };

  const handleCloseNotificationsModal = () => {
    setOpenNotification(false);
  };

  const handleChangeOperator = (value: any) => {
    setOpenOperator(true);
    setOperator(value);
  };

  const handleClickOpen = () => {
    setOpenOperator(true);
  };

  const handleCloseModal = () => {
    setOpenOperator(false);
  };

  const items = pageConfig?.menuItems.reduce((menu: any, item: any) => {
    if (item.selected && item?.href !== '/dashboard') {
      if (item?.subMenu && item?.subMenu?.length) {
        const subMenu = item?.subMenu?.filter((subMenuItem: any) => subMenuItem.selected);
        return [...menu, { ...item, selected: subMenu?.length ? false : true }, ...subMenu];
      }
      return [...menu, item];
    }
    return [...menu];
  }, []);

  // filter by permitted roles
  const menuItems = pageConfig?.menuItems.filter((item: any) =>
    item.permittedRoles
      ? intersection(item.permittedRoles, agentData?.roles[operator?.slug || 'farmbook'] || []).length > 0
      : item,
  );

  return (
    <CircularLoader value={loading}>
      <>
        <Analytics />
        <ProvideTitleBar>
          <Grid item sx={styles.flex}>
            <AppbarWrap
              open={open}
              handleClickOpen={handleClickOpen}
              label={operator?.name}
              operatorItems={agentData?.collectives}
              styles={styles}
              onChangeEvent={onCollapse}
              openModal={openOperator}
              handleOnCloseModal={handleCloseModal}
              handleChangeOperator={handleChangeOperator}
              toggleNotification={toggleNotification}
            />
          </Grid>
          <AppConfigContext.Provider value={props}>
            <Stack direction='row' spacing={0}>
              <Box>
                <LeftMenuWrap
                  itemStyle={open ? styles.expandedStyle : styles.collapedStyle}
                  collapseEvent={onCollapse}
                  open={open}
                  styles={styles}
                  menuItems={menuItems || []}
                  appName={pageConfig?.name}
                />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <PaperWrap {...props}>
                  <BreadcrumbWrap menuItems={items} />
                  <TitleBarContent />
                  <Component sx={styles.compWidth} {...pageProps} key={router.asPath} />
                </PaperWrap>
              </Box>
              <Drawer
                anchor='right'
                open={openNotification}
                onClose={handleCloseNotificationsModal}
              >
                <NotificationsBar handleCloseNotificationsModal={handleCloseNotificationsModal} />
              </Drawer>
            </Stack>
          </AppConfigContext.Provider>
        </ProvideTitleBar>
      </>
    </CircularLoader>
  );
};

AuthenticatedLayout.propTypes = propTypes;

export default AuthenticatedLayout;
