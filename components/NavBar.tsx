import * as React from 'react';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import Image from 'next/image';
import MenuItems from '../components/common/MenuItems';

import {
  ProductsBatchesIcon,
  ProductIcon,
  PoultryIcon,
  CowIcon,
  GoatIcon,
  SheepIcon,
  AquaIcon,
} from './Icons';
import {
  GridView as DashboardIcon,
  AccountCircleOutlined as FarmersIcon,
  AccountCircleOutlined as ProcessorsIcon,
  LayersOutlined as LandParcelsIcon,
  EnergySavingsLeafOutlined as CropsIcon,
  NotificationsNoneOutlined as NotificationsIcon,
  DescriptionOutlined as ReportsIcon,
  ContactPageOutlined as CustomersIcon,
  ManageAccountsOutlined as UsersIcon,
  GroupsOutlined as CollectivesIcon,
  WorkspacePremiumOutlined as CertificationBodyIcon,
  VerticalSplitOutlined as FieldIcon,
  ListAltOutlined as POPIcon,
  AssessmentOutlined as ReportIcon,
  TaskOutlined as TaskIcon,
  GiteOutlined as ProductionSystemIcons,
  PermDataSettingOutlined as ProcessingSystemIcons,
  GridView as AHDashboardIcon,
  GridView as PoultryDashboardIcon,
  GridView as AquaDashboardIcon,
  GridView as ProcDashboardIcon,
  ListAltOutlined as PoultryPOPIcon,
  ListAltOutlined as AquaPOPIcon,
  EngineeringOutlined as ProcessorIcon
} from '@mui/icons-material';
import AdUnitsIcon from '@mui/icons-material/AdUnits';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import MenuItemComponent from '../components/common/MenuItemComponent';
import AccordianMenuItemComponent from '../components/common/AccordianMenuItemComponent';
import Typography from '@mui/material/Typography';
import { useUser } from '~/contexts/AuthDialogContext';

const name2IconMapping: any = {
  Dashboard: DashboardIcon,
  Farmers: FarmersIcon,
  'Land Parcels': LandParcelsIcon,
  Crops: CropsIcon,
  Notifications: NotificationsIcon,
  'Mobile Notifications': AdUnitsIcon,
  Technicians: FarmersIcon,
  Reports: ReportIcon,
  Customers: CustomersIcon,
  Users: UsersIcon,
  Operators: CollectivesIcon,
  Fields: FieldIcon,
  'Certification Bodies': CertificationBodyIcon,
  POPs: POPIcon,
  'Poultry Batches': PoultryIcon,
  Cows: CowIcon,
  Goats: GoatIcon,
  Sheep: SheepIcon,
  'Production Systems': ProductionSystemIcons,
  'Aquaculture Crops': AquaIcon,
  Tasks: TaskIcon,
  Processors: ProcessorIcon,
  'Processing Systems': ProcessingSystemIcons,
  Products: ProductIcon,
  'Product Batches': ProductsBatchesIcon,
  'Animal Husbandry Dashboard': AHDashboardIcon,
  'Poultry Dashboard': PoultryDashboardIcon,
  'Aquaculture Dashboard': AquaDashboardIcon,
  'Processing Dashboard': ProcDashboardIcon,
  'Poultry POPs': PoultryPOPIcon,
  'Aquaculture POPs': AquaPOPIcon,
};

const drawerWidth = 260;

const openedMixin = (theme: Theme): CSSObject => ({
  height: '100',
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  overflowX: 'hidden',
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  position: 'relative',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

interface menu {
  open: boolean;
  menuItems: any;
  styles: any;
  collapseEvent(): void;
  appName?: string;
}

export default function NavBar({ open, menuItems, styles, collapseEvent, appName }: menu) {
  const { user } = useUser();
  if (!user) return null;
  const listStyle = {
    justifyContent: open ? 'initial' : 'center',
    color: (theme: Theme) => theme.palette.dark.light,
    borderRadius: 1,
    '&:hover': {
      backgroundColor: (theme: Theme) =>
        open ? theme.palette.primary.main : `${theme.palette.common.white}33`,
      color: (theme: Theme) => theme.palette.primary.contrastText,
      '& .MuiListItemIcon-root': {
        color: (theme: Theme) => theme.palette.primary.contrastText,
      },
    },
    '&.Mui-selected': {
      width: 80,
      height: 40,
      borderRadius: 1,
      backgroundColor: (theme: Theme) =>
        open ? `${theme.palette.primary.main}30` : `${theme.palette.common.white}33`,
      '&:hover': {
        backgroundColor: (theme: Theme) =>
          open ? `${theme.palette.primary.main}30` : `${theme.palette.common.white}33`,
        color: (theme: Theme) => theme.palette.dark.dark,
        '& .MuiListItemIcon-root': {
          color: (theme: Theme) => theme.palette.dark.dark,
        },
      },
    },
  };
  const iconAligns = {
    justifyContent: open ? 'initial' : 'center',
    color: (theme: Theme) => theme.palette.dark.light,
    borderRadius: 2,
    '&:hover': {
      backgroundColor: 'none',
    },
    '&.Mui-selected': {
      width: 80,
      height: 40,
      borderRadius: 2,
    },
  };

  const carbonMintThumbBox = {
    position: 'absolute',
    bottom: '30px',
    width: '100%',
    left: '0px',
  };

  const carbonMintLogo = open
    ? '/assets/images/Logo-CarbonMint.svg'
    : '/assets/images/CarbonMint-thumb.svg';

  const drawerStyles = {
    background: (theme: Theme) => (open ? 'white' : theme.palette.primary.main),
    paddingTop: 9,
    borderRadius: 0,
  };

  const menuIconStyle = {
    margin: '0 auto 8px auto',
    color: (theme: Theme) =>
      open ? theme.palette.common.black : theme.palette.primary.contrastText,
    width: 20,
    height: 20,
    '& .MuiListItemButton-root': {
      borderRadius: 8,
      background: (theme: Theme) => theme.palette.common.black,
    },
  };

  const addMenuButton = {
    background: (theme: Theme) => theme.palette.primary.contrastText,
    width: 30,
    height: 30,
    borderRadius: '8px !important',
    '&:hover': {
      background: (theme: Theme) => theme.palette.primary.contrastText,
      boxShadow: '1px 1px 1px #ccc',
    },
  };

  const menuItems2 = menuItems.map((item: any) => ({
    ...item,
    id: `${item.title}Button`,
    Icon: name2IconMapping[item.title],
    listStyle: { ...listStyle },
    iconStyle: {
      ...iconAligns,
      color: (theme: Theme) =>
        item.selected
          ? open
            ? theme.palette.primary.main
            : theme.palette.primary.contrastText
          : open
            ? theme.palette.common.black
            : theme.palette.primary.contrastText,
    },
    itemStyle: open ? styles.expandedStyle : styles.collapedStyle,
    textDecorationNone: styles.textDecorationNone,
    open: open,
  }));

  const selectedMenuItem = menuItems.find((m: any) => m.selected);
  const display = selectedMenuItem ? 'flex' : 'none';

  return (
    <Box className='left_side_bar' sx={{ display }}>
      <CssBaseline />
      <Drawer
        variant='permanent'
        open={open}
        PaperProps={{
          className: 'hidden-scrollbar',
          sx: drawerStyles,
        }}
      >
        <IconButton onClick={collapseEvent} sx={menuIconStyle}>
          {open ? <KeyboardDoubleArrowLeftIcon /> : <KeyboardDoubleArrowRightIcon />}
        </IconButton>
        <MenuItems
          open={open}
          selected={selectedMenuItem}
          menuItems={menuItems2}
          MenuItemComponent={MenuItemComponent}
          AccordianMenuItemComponent={AccordianMenuItemComponent}
        />

        <Box sx={{ height: '85%' }}></Box>
        <Box sx={{ carbonMintThumbBox }}>
          {open && (
            <>
              <Box sx={styles.itemCenter}>
                <Typography
                  variant='h6'
                  display='block'
                  gutterBottom
                  // 'primary.lightGray'
                  sx={{
                    ...styles.textCenter,
                    color: (theme: Theme) => theme.palette.common.black,
                  }}
                >
                  {appName?.toLowerCase().includes("poultry") ? "FARM" : appName?.replace('Book', '').toUpperCase()}
                </Typography>
                <Typography
                  variant='h6'
                  display='block'
                  gutterBottom
                  // 'primary.lightGray'
                  sx={{
                    ...styles.textCenter,
                    color: (theme: Theme) => theme.palette.primary.main,
                  }}
                >
                  BOOK
                </Typography>
              </Box>
              <Typography
                variant='caption'
                display='block'
                gutterBottom
                // 'primary.lightGray'
                sx={{
                  ...styles.textCenter,
                  color: (theme: Theme) => theme.palette.common.black,
                }}
              >
                Powered by
              </Typography>
            </>
          )}
          <Box sx={styles.itemCenter}>
            <Image src={carbonMintLogo} alt='Carbon Mint Logo' width={157} height={54} />
          </Box>
          <Box sx={{ height: '15px' }}></Box>
        </Box>
      </Drawer>
    </Box>
  );
}
