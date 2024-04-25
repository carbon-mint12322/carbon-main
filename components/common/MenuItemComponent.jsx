import React from 'react';

import Link from '~/components/lib/Link';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Embed from '~/components/lib/Embed';
import ListItemText from '@mui/material/ListItemText';

import { Tooltip } from '@mui/material';
import If, { IfNot } from '../lib/If';

const adjustedWidth = {
  'min-width':'44px'
}

function MenuItemComponent(props) {
  const listData = () => (
    <ListItem>
      <ListItemButton sx={props.listStyle} selected={props.selected}>
        <ListItemIcon sx={[props.iconStyle,adjustedWidth]}>
          <Embed Component={props.Icon} selected={props.selected} />
        </ListItemIcon>
        <ListItemText primary={props.title} sx={props.itemStyle} />
      </ListItemButton>
    </ListItem>
  );

  return (
    <Link id={props.id} href={props.href} sx={props.textDecorationNone}>
      <If value={props.open}>{listData()}</If>
      <IfNot value={props.open}>
        <Tooltip title={props.title} placement='right'>
          {listData()}
        </Tooltip>
      </IfNot>
    </Link>
  );
}

export default MenuItemComponent;
