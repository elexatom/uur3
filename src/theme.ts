import {createTheme} from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#00aaff',
    },
    secondary: {
      main: '#2940fa',
    },
    error: {
      main: '#ff716c',
    },
    background: {
      default: '#F0F0F0',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#94acd3',
    },
    warning: {
      main: '#fb8a00',
    },
    info: {
      main: '#8264ce',
    }
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 900,
    },
    h2: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 900,
    },
    h3: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 900,
    },
    h4: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 900,
    },
    h5: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 900,
    },
    h6: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 900,
    },
    button: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 700,
      textTransform: 'uppercase',
    },
    body1: {
      fontFamily: 'Inter, sans-serif',
    },
    body2: {
      fontFamily: 'Inter, sans-serif',
    },
    caption: {
      fontFamily: 'Inter, sans-serif',
    },
    overline: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 900,
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
    }
  },
  shape: {
    borderRadius: 4,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
})

export default theme
