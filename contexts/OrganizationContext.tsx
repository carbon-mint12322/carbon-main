import { createContext, useState, useContext, useCallback, useEffect } from 'react';

import axios from 'axios';

import defaultOrganizationConfig from '~/static/brands/CarbonMint/config.json';

import lightTheme from '~/styles/theme/lightTheme';
import SplashScreen from '~/components/common/SplashScreen';

interface OrganizationContextProps {
  organizationConfig: any;
  theme: OrganizationTheme;
  loading?: boolean;
}

interface OrganizationConfigInfo {
  logo: string;
  headerLogo: string;
  loginDesc: string;
  subdomain: string;
  id: string;
  organizationId: string;
  name: string;
  mission?: string;
  missionDesc?: string;
  carousel?: Carousel[];
  logoWidth?: string | number;
  headerLogoWidth?: string | number;
}

interface Carousel {
  mission: string;
  missionDesc: string;
}

export interface OrganizationTheme {
  palette: {
    primary: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    secondary: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
  };
}

const OrganizationDefaultValues: OrganizationContextProps = {
  organizationConfig: defaultOrganizationConfig,
  theme: lightTheme,
  loading: false,
};

const OrganizationContext = createContext<OrganizationContextProps>(OrganizationDefaultValues);

const Provider = ({ children }: any) => {
  const [organizationConfig, setOrganizationConfig] = useState<any>(defaultOrganizationConfig);
  const [loading, setLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<OrganizationTheme>(lightTheme);

  const fetchOrganizationData = useCallback(async (subdomain: string) => {
    try {
      const res = await axios.get(`/api/tenant/${subdomain}`);
      return res.data;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    // eslint-disable-next-line
  }, []);

  const setAppSettings = useCallback(async () => {
    const subdomain = window.location.hostname.includes('poultry') ?
      `${window.location.hostname.split('.')[0]}.${window.location.hostname.split('.')[1]}`
      :
      window.location.hostname.split('.')[0]
        ? window.location.hostname.split('.')[0]
        : 'localhost';
    const data = await fetchOrganizationData(subdomain);

    if (data) {
      setOrganizationConfig(data.config);
      setTheme({ ...lightTheme, ...data.theme.theme });
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setAppSettings();
    // eslint-disable-next-line
  }, []);

  const exposed: OrganizationContextProps = {
    organizationConfig: organizationConfig,
    theme: theme,
    loading: loading,
  };

  if (loading) {
    return <SplashScreen />;
  }

  return <OrganizationContext.Provider value={exposed}>{children}</OrganizationContext.Provider>;
};

export const useOrganization = () => useContext(OrganizationContext);

export default Provider;
