import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#448FA3',
    },
    secondary: {
      main: '#9A031E',
    },
    background: {
      default: '#FCF7F8',
    },
    neutral: {
      main: '#BBBBBB',
    },
    selected: {
      main: '#DBEEFF',
    },
  },
  typography: {
    fontSize: 12,
    fontFamily: 'Nunito',
    h1: {
      fontSize: '5rem',
    },
    h2: {
      fontSize: '3rem',
    },
    h3: {
      fontSize: '2.5rem',
    },
    h4: {
      fontSize: '2rem',
    },
  },
  zIndex: {
    appBar: 1200,
    drawer: 1100,
  },
});

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
    selected: Palette['primary'];
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
    selected?: PaletteOptions['primary'];
  }
}

// Update the Component's color prop options
declare module '@mui/material/Badge' {
  // eslint-disable-next-line no-unused-vars
  interface BadgePropsColorOverrides {
    neutral: true;
  }
}

declare module '@mui/material/SvgIcon' {
  // eslint-disable-next-line no-unused-vars
  interface SvgIconPropsColorOverrides {
    neutral: true;
  }
}

export default theme;
