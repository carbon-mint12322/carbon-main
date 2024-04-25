import { validateTokenPromise } from '~/frontendlib/model-lib/lib';
import createEmotionCache from '~/utility/createEmotionCache';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import OperatorProvider from '~/contexts/OperatorContext';
import { LoadScript } from '@react-google-maps/api';
import EventProvider from '~/contexts/EventContext';
import { appWithTranslation } from 'next-i18next';
import { CacheProvider } from '@emotion/react';
import React, { useEffect } from 'react';
import NextProgress from 'next-progress';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/en-gb';

const AuthenticatedLayout = dynamic(import('~/components/Layout/AuthenticatedLayout'));

const clientSideEmotionCache = createEmotionCache();

const MyApp = (props: any) => {
  const { emotionCache = clientSideEmotionCache } = props;
  const googleMapsApiKey = process.env.GOOGLE_MAPS_KEY || '';
  useEffect(() => {
    axios.interceptors.request.use(
      async function (config) {
        // await validateTokenPromise();
        return config;
      },
      undefined,
      { synchronous: false },
    );
  }, [axios, validateTokenPromise]);

  return (
    <CacheProvider value={emotionCache}>
      <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={['geometry']}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en'}>
          <OperatorProvider>
            <NextProgress delay={10} options={{}} />
            <EventProvider>
              <AuthenticatedLayout {...props} />
            </EventProvider>
          </OperatorProvider>
        </LocalizationProvider>
      </LoadScript>
    </CacheProvider>
  );
};

const propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};

MyApp.propTypes = propTypes;

export default appWithTranslation(MyApp);
