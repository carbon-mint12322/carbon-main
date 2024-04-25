import React from 'react';

import Link from '~/components/lib/Link';

// Shortcut for react fragment
const PlainText = ({ text }) => text;

function BreadCrumbNav(props) {
  return (
    <Link underline={'hover'} color={'inherit'} href={props.href} sx={props.activeLink}>
      <PlainText text={props.title} />
    </Link>
  );
}

export default BreadCrumbNav;
