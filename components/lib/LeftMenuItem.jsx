import React from 'react';
import Head from 'next/head';
import Link from 'next/link'; // MUI available as $M
import { AppConfigContext } from '~/contexts/AppConfigContext';

const LeftMenuItem = (props) => {
  const index = props.index;
  const myMenuItem = props.value;
  const unselectedStyle = {
    color: '#1e390a', // TODO: Fix - take from theme
    padding: 8,
    borderRadius: 3,
  };

  const selectedStyle = {
    ...unselectedStyle,
    backgroundColor: '#c98100', // TODO: Fix - take from theme
  };

  const appctx = React.useContext(AppConfigContext);
  const menuItems = appctx.pageConfig?.menuItems || [];
  const myItemInContext = menuItems.find((x) => x.href === myMenuItem.href);
  const style = myItemInContext?.selected ? selectedStyle : unselectedStyle;

  return (
    <a href={myMenuItem.href} style={style}>
      {myMenuItem.title}
    </a>
  );
};

export default LeftMenuItem;
