import { createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    primary: {
      main: '#448FA3'
    },
    secondary: {
      main: '#9A031E'
    },
    background: {
      default: '#FCF7F8',
    },
  },
  typography: {
    fontSize: 12,
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
})

export default theme
