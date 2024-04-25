// Plain JS version + prop-types
// Thanks to @IvanAdmaers

import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import NextLink from 'next/link';
import MuiLink from '@mui/material/Link';
import { useOperator } from '~/contexts/OperatorContext';

const Link = forwardRef(({ href, as, prefetch, ...props }, ref) => {
  const { baseURl } = useOperator();
  const hrefLink = process.env.NEXT_PUBLIC_APP_NAME !== 'evlocker' ? baseURl + href : href;
  return (
    <NextLink href={hrefLink} as={as} prefetch={prefetch} passHref>
      <MuiLink ref={ref} {...props} />
    </NextLink>
  );
});

Link.displayName = 'Link';

Link.defaultProps = {
  href: '#',
  prefetch: false,
};

Link.propTypes = {
  href: PropTypes.string,
  as: PropTypes.string,
  prefetch: PropTypes.bool,
};

export default Link;
