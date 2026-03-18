import { ThemeOptions } from '@mui/material'

import { palette } from '../palette'
import { buttonsTheme } from './buttons'
import { inputsTheme } from './inputs'

export const components: ThemeOptions['components'] = {
  ...buttonsTheme,
  ...inputsTheme,
  MuiChip: {
    styleOverrides: {
      root: {
        fontWeight: 600,
      },
    },
    variants: [
      {
        props: {
          size: 'small',
        },
        style: {
          height: 20,
          padding: '0 4px',
          fontSize: 9,
          lineHeight: 1,
          fontWeight: 600,
        },
      },
      {
        props: {
          size: 'medium',
        },
        style: {
          height: 32,
          padding: '0 4px',
          fontSize: 11,
          lineHeight: 1,
          borderRadius: '12px',
        },
      },
    ],
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: '16px',
      },
    },
  },
  MuiListItemText: {
    styleOverrides: {
      primary: {
        fontWeight: 600,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        marginRight: '8px',
      },
      secondary: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        marginRight: '4px',
      },
    },
  },
  MuiPagination: {
    styleOverrides: {
      root: {},
    },
  },
  MuiPaginationItem: {
    styleOverrides: {
      colorPrimary: palette.primary.main,
      colorSecondary: palette.primary.main,
      page: {
        fontWeight: 600,
        fontSize: 13,
        lineHeight: 1,
      },
      text: {},
      root: {
        '&.Mui-selected': {
          backgroundColor: palette.primary.main,
          color: '#fff',
          '&:hover': {
            color: '#fff',
            backgroundColor: palette.primary.main,
          },
        },
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        padding: '32px 28px',
        minWidth: 450,
        boxSizing: 'border-box',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
        backgroundColor: palette.grey[100],
        padding: '12px',
        boxShadow: 'none',
      },
    },
  },
  MuiCardMedia: {
    styleOverrides: {
      root: {
        height: 112,
        borderRadius: '12px',
        marginBottom: '8px',
        objectFit: 'contain',
      },
    },
    defaultProps: {
      component: 'img',
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: 0,
      },
    },
  },
  MuiCardActions: {
    styleOverrides: {
      root: {
        padding: 0,
        marginTop: 8,
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        padding: '24px',
        minWidth: 480,
        boxSizing: 'border-box',
        borderRadius: '20px',
      },
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        marginBottom: '24px',
        fontSize: '20px',
        lineHeight: '24px',
        fontWeight: 600,
        padding: 0,
      },
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: {
        padding: 0,
      },
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      root: {
        fontSize: '13px !important',
        '& .MuiTypography-root': {
          fontSize: '13px !important',
          fontWeight: 500,
        },
        '& .MuiButtonBase-root': {
          minHeight: '44px !important',
        },
      },
    },
  },
}
