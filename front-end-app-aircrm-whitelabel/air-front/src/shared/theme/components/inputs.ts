import { ThemeOptions } from '@mui/material'

import ChevronDownIcon from '@icons/chevron-down.svg?react'

export const inputsTheme: ThemeOptions['components'] = {
  MuiInputBase: {
    styleOverrides: {
      root: {
        fontFamily: 'Gilroy',
        fontSize: 13,
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        fontFamily: 'Gilroy',
      },
      shrink: {
        fontSize: 13,
        lineHeight: 1.53,
      },
      outlined: {
        left: '6px',
        fontSize: 13,
      },
      sizeSmall: {
        top: 3,
      },
    },
  },
  MuiFormHelperText: {
    styleOverrides: {
      root: {
        fontFamily: 'Gilroy',
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        fontWeight: 500,

        '& > label': {
          top: -2,
        },
      },
      notchedOutline: {
        backgroundColor: 'transparent',
        '& > legend': {
          marginLeft: 6,
        },
      },
    },
    variants: [
      {
        props: {
          size: 'small',
        },
        style: {
          borderRadius: 12,
          fontSize: 13,
          lineHeight: 1.53,
          '& > input': {
            padding: '13px 16px',
          },
        },
      },
      {
        props: {
          size: 'medium',
        },
        style: {
          borderRadius: 12,
          fontSize: 13,
          lineHeight: 1.53,
          '& > input': {
            padding: 16,
          },
        },
      },
    ],
  },
  MuiSelect: {
    defaultProps: {
      IconComponent: ChevronDownIcon,
    },
    styleOverrides: {
      icon: {
        top: 'auto',
      },
    },
  },
}
