import React from 'react';

import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Loop from '~/components/lib/Loop';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Typography, useTheme } from '@mui/material';
import FenceOutlinedIcon from '@mui/icons-material/FenceOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import { Tooltip } from '@mui/material';
import { useOperator } from '~/contexts/OperatorContext';
import AccordianMenuItemComponent from './AccordianMenuItemComponent';


function MenuItems(props) {
  let menuItems = props.menuItems;
  let ahMenuItems = [];
  let landParcelMenuItems = [];
  let notificationMenuItems = [];
  let adminMenuItems = [];
  let productMenuItems = [];
  let groups = ['Land Parcels', 'Animal Husbandry', 'Notifications', 'Administration', 'Products'];
  ahMenuItems = menuItems.filter((item) => item.group && item.group === 'Animal Husbandry');
  landParcelMenuItems = menuItems.filter(
    (item) => item.group && item.group === 'Land Parcels',
  );
  notificationMenuItems = menuItems.filter(
    (item) => item.group && item.group === 'Notifications',
  );
  adminMenuItems = menuItems.filter((item) => item.group && item.group === 'Administration');
  productMenuItems = menuItems.filter((item) => item.group && item.group === 'Products');
  // TODO revisit to abstract this a bit more
  return (
    <Grid component={'nav'} aria-label={'menu labels'} sx={{ marginBottom: '20px' }}>
      <Divider />
      {menuItems.map((value, i) => {
        if (!value.group) {
          return <props.MenuItemComponent key={i} value={value} index={i} {...value} />;
        } else {
          if (groups.includes(value.group))
            switch (value.group) {
              case 'Land Parcels':
                groups.splice(groups.indexOf('Land Parcels'), 1);
                return (
                  <AccordianMenuItemComponent
                    key={i}
                    menuItems={landParcelMenuItems}
                    MenuItemComponent={props.MenuItemComponent}
                    title={'Land Parcels'}
                    open={props.open}
                    Icon={LayersOutlinedIcon}
                    href={landParcelMenuItems[0]?.href}
                  />
                );
              case 'Animal Husbandry':
                groups.splice(groups.indexOf('Animal Husbandry'), 1);
                return (
                  <AccordianMenuItemComponent
                    key={i}
                    menuItems={ahMenuItems}
                    MenuItemComponent={props.MenuItemComponent}
                    title={'Animal Husbandry'}
                    open={props.open}
                    Icon={FenceOutlinedIcon}
                    href={ahMenuItems[0]?.href}
                  />
                );
              case 'Notifications':
                groups.splice(groups.indexOf('Notifications'), 1);
                return (
                  <AccordianMenuItemComponent
                    key={i}
                    menuItems={notificationMenuItems}
                    MenuItemComponent={props.MenuItemComponent}
                    title={'Notifications'}
                    open={props.open}
                    Icon={NotificationsNoneOutlinedIcon}
                    href={notificationMenuItems[0]?.href}
                  />
                );
              case 'Administration':
                groups.splice(groups.indexOf('Administration'), 1);
                return (
                  <AccordianMenuItemComponent
                    key={i}
                    menuItems={adminMenuItems}
                    MenuItemComponent={props.MenuItemComponent}
                    title={'Administration'}
                    open={props.open}
                    Icon={AdminPanelSettingsOutlinedIcon}
                    href={adminMenuItems[0]?.href}
                  />
                );
              case 'Products':
                groups.splice(groups.indexOf('Products'), 1);
                return (
                  <AccordianMenuItemComponent
                    key={i}
                    menuItems={productMenuItems}
                    MenuItemComponent={props.MenuItemComponent}
                    title={'Products'}
                    open={props.open}
                    Icon={Inventory2OutlinedIcon}
                    href={productMenuItems[0]?.href}
                  />
                );
              default:
                break;
            }
        }
      })}
      {/* <List>
        <Loop mappable={menuItems} Component={props.MenuItemComponent} />
      </List>
      {landParcelMenuItems.length > 0 && (
        <AccordianMenuItemComponent
          menuItems={landParcelMenuItems}
          MenuItemComponent={props.MenuItemComponent}
          title={'Land Parcels'}
          open={props.open}
          Icon={LayersOutlinedIcon}
        />
      )}
      {ahMenuItems.length > 0 && (
        <AccordianMenuItemComponent
          menuItems={ahMenuItems}
          MenuItemComponent={props.MenuItemComponent}
          title={'Animal Husbandry'}
          open={props.open}
          Icon={FenceOutlinedIcon}
        />
      )}
      {productMenuItems.length > 0 && (
        <AccordianMenuItemComponent
          menuItems={productMenuItems}
          MenuItemComponent={props.MenuItemComponent}
          title={'Products'}
          open={props.open}
          Icon={Inventory2OutlinedIcon}
        />
      )}
      {notificationMenuItems.length > 0 && (
        <AccordianMenuItemComponent
          menuItems={notificationMenuItems}
          MenuItemComponent={props.MenuItemComponent}
          title={'Notifications'}
          open={props.open}
          Icon={NotificationsNoneOutlinedIcon}
        />
      )}
      {adminMenuItems.length > 0 && (
        <AccordianMenuItemComponent
          menuItems={adminMenuItems}
          MenuItemComponent={props.MenuItemComponent}
          title={'Administration'}
          open={props.open}
          Icon={AdminPanelSettingsOutlinedIcon}
        />
      )}
      {productMenuItems.length > 0 && (
        <AccordianMenuItemComponent
          menuItems={productMenuItems}
          MenuItemComponent={props.MenuItemComponent}
          title={'Products'}
          open={props.open}
          Icon={Inventory2OutlinedIcon}
        />
      )}
      {notificationMenuItems.length > 0 && (
        <AccordianMenuItemComponent
          menuItems={notificationMenuItems}
          MenuItemComponent={props.MenuItemComponent}
          title={'Notifications'}
          open={props.open}
          Icon={NotificationsNoneOutlinedIcon}
        />
      )}
      {adminMenuItems.length > 0 && (
        <AccordianMenuItemComponent
          menuItems={adminMenuItems}
          MenuItemComponent={props.MenuItemComponent}
          title={'Administration'}
          open={props.open}
          Icon={AdminPanelSettingsOutlinedIcon}
        />
      )} */}
    </Grid>
  );
}

export default MenuItems;
