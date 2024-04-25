import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { appWithTranslation } from 'next-i18next';

import UnauthLayout from './UnauthLayout';

const MyApp = (props: any) => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js', { scope: '/public/draw-boundaries' }).then(
          function (registration) {
            console.log('Service Worker registration successful with scope: ', registration.scope);
          },
          function (err) {
            console.log('Service Worker registration failed: ', err);
          },
        );
      });
    }
  }, []);

  return (
    <>
      <UnauthLayout {...props} />
    </>
  );
};

const propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};

MyApp.propTypes = propTypes;

export default appWithTranslation(MyApp);
