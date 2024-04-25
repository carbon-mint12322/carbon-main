import React from 'react';

import { Palette, ThemeProvider as MUiThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';

import SplashScreen from 'components/common/SplashScreen';

import { useOrganization } from '../../../contexts/OrganizationContext';

import defaultTheme from '~/styles/theme/theme';

const ThemeProvider = ({ children }: any) => {
  const { loading, theme } = useOrganization();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <MUiThemeProvider
      theme={createTheme({
        ...defaultTheme,
        palette: {
          ...defaultTheme.palette,
          ...(theme?.palette as Palette),
        },
      })}
    >
      {children}
    </MUiThemeProvider>
  );
};

export default ThemeProvider;
