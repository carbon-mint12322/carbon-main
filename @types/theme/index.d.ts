import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface CustomPalette {
    chart: {
      primary: string;
      secondary: string;
      default: string;
    };
    iconColor: {
      primary: string;
      secondary: string;
      tertiary: string;
      quaternary: string;
      default: string;
      disable: string;
      inherit: string;
    };
    timeline: {
      selectedEvent: string;
      today: string;
      plan: string;
      actual: string;
    };
  }
  interface Palette extends CustomPalette {
    mapMarker: Palette['primary'];
    editColor: Palette['primary'];
    carouselActiveIndicator: Palette['primary'];
    pending: Palette['primary'];
    dark: Palette['primary'];
    white: Palette['primary'];
    inProgress: Palette['primary'];
  }

  // allow configuration using `createTheme`
  interface PaletteOptions extends CustomPalette {
    mapMarker?: PaletteOptions['primary'];
    editColor: PaletteOptions['primary'];
    carouselActiveIndicator: PaletteOptions['primary'];
    pending: PaletteOptions['primary'];
    dark: PaletteOptions['primary'];
    white: PaletteOptions['primary'];
    inProgress: PaletteOptions['primary'];
  }
}
