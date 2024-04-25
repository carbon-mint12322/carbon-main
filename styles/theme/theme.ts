import { ThemeOptions } from '@mui/material';

const theme: ThemeOptions = {
  palette: {
    primary: {
      main: '#f79023',
      light: '#f7b323',
      dark: '#f77e23',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#DCE8E1',
      light: '#DCE8DE',
      dark: '#DCE8E4',
      contrastText: '#0E8140',
    },
    success: {
      main: '#4CAF50',
      light: '#6bcf6f',
      dark: '#388f3b',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#EF5350',
      light: 'rgba(239, 83, 80, 0.1)',
      dark: 'rgba(239, 83, 80, 0.5)',
      contrastText: 'rgba(239, 83, 80, 0.28)',
    },
    inProgress: {
      main: 'rgba(126, 87, 194, 0.28)',
      light: 'rgba(126, 87, 194, 0.1)',
      dark: 'rgba(2126, 87, 194, 0.5)',
      contrastText: '#7e57c2',
    },
    pending: {
      main: '#3A7BFA',
    },
    dark: {
      main: '#000000',
      dark: '#000000',
      light: '#a6a6a6',
    },
    white: {
      main: '#FFFFFF',
      dark: '#F5F5F5',
      light: '#EFEFEF',
    },
    editColor: {
      main: 'rgba(58, 123, 250, 0.15)',
      light: 'rgba(58, 123, 250, 0.05)',
      dark: 'rgba(58, 123, 250, 0.45)',
      contrastText: '#3A7BFA',
    },
    text: {
      secondary: '#959595',
    },
    mapMarker: {
      main: '#FF0000',
    },
    chart: {
      primary: '#4CAF50',
      secondary: '#3A7BFA',
      default: '#E5E5E5',
    },
    carouselActiveIndicator: {
      main: '#FFFFFF',
    },
    iconColor: {
      primary: '#4CAF50',
      secondary: '#29B6F6',
      tertiary: '#7E57C2',
      quaternary: '#795548',
      default: '#F8870F',
      disable: '',
      inherit: '#333333',
    },
    timeline: {
      selectedEvent: '#2196f3',
      today: '#EF5350',
      plan: '#FFCC80',
      actual: '#A5D6A7',
    },
    common: {
      white: '#ffffff',
      black: '#000000',
    },
  },
  typography: {
    fontFamily: 'stevie-sans',
    fontWeightRegular: 550,
    h5: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
    },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: '40px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
  },
};

export default theme;
