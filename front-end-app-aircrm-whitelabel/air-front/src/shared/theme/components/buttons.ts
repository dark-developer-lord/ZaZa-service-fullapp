import type {} from '@mui/lab/themeAugmentation'
import { ThemeOptions } from '@mui/material'

import { palette } from '../palette'

export const buttonsTheme: ThemeOptions['components'] = {
  MuiButton: {
    styleOverrides: {
      root: {
        fontFamily: 'Gilroy',
        fontWeight: 500,
        textTransform: 'none',
        borderRadius: 12,
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      },
    },
    defaultProps: {
      variant: 'contained',
    },
    variants: [
      {
        props: {
          size: 'small',
        },
        style: {
          fontSize: 11,
          fontWeight: 600,
          lineHeight: 1.45,
          paddingTop: 8,
          paddingBottom: 8,
        },
      },
      {
        props: {
          size: 'medium',
        },
        style: {
          fontSize: 13,
          fontWeight: 500,
          lineHeight: 1.53,
          paddingTop: 12,
          paddingBottom: 12,
          paddingLeft: 16,
          paddingRight: 16,
        },
      },
      {
        props: {
          size: 'large',
        },
        style: {
          fontSize: 15,
          fontWeight: 500,
          lineHeight: 1.6,
          paddingTop: 16,
          paddingBottom: 16,
          paddingLeft: 20,
          paddingRight: 20,
          borderRadius: 16,
        },
      },
    ],
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        backgroundColor: '#fff',
      },
    },
    variants: [
      {
        props: {
          size: 'medium',
        },
        style: {
          padding: 12,
        },
      },
      {
        props: {
          size: 'small',
        },
        style: {
          width: 32,
          height: 32,
        },
      },
    ],
  },
  MuiLoadingButton: {
    defaultProps: {
      variant: 'contained',
    },
  },
  MuiLink: {
    styleOverrides: {
      root: {
        color: `${palette.text.primary} !important`,
        textDecoration: 'none',
        '&:hover': {
          color: `${palette.primary.main} !important`,
        },
      },
    },
  },
}
