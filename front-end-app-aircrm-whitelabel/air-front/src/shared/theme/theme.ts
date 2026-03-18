import { createTheme } from '@mui/material'

import { components } from './components'
import { palette } from './palette'
import { typography } from './typography'

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    mobile: true; // adds the `mobile` breakpoint
    pad: true; // adds the `pad` breakpoint
  }
}

export const theme = createTheme({
  palette,
  typography,
  breakpoints: {
    values: {
      xs: 0,
      mobile: 576,
      sm: 768,    
      md: 992,    
      pad: 992,   
      lg: 1200,   
      xl: 1536,   
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: '100vh',
          backgroundColor: '#F5F7FA',
        },
        // '#root': {
        //   minHeight: '100vh',
        // },
        '::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '50px',
          transition: 'background-color 0.3s ease',
        },
        '::-webkit-scrollbar-thumb:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        '::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
        '@media (max-width: 768px)': {
          '::-webkit-scrollbar': {
            display: 'none',
          },
        },
      },
    },
    ...components,
  },
})
