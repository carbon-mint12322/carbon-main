import React from 'react';
import PropTypes from 'prop-types';
import styles from '~/styles/theme/brands/styles';

const propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};

const UnauthLayout = (props: any) => {
  const { Component, pageProps } = props;
  return <Component sx={styles.compWidth} {...pageProps} />;
};

UnauthLayout.propTypes = propTypes;

export default UnauthLayout;
