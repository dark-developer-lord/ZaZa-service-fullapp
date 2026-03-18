import type { ThemeOptions } from '@mui/material/styles'

export const typography: NonNullable<ThemeOptions['typography']> = {
  fontFamily: 'Gilroy',
  h1: {
    fontSize: 50,
    lineHeight: 1.12,
    fontWeight: 600,
  },
  h2: {
    fontSize: 44,
    lineHeight: 1.09,
    fontWeight: 600,
  },
  h3: {
    fontSize: 36,
    lineHeight: 1.11,
    fontWeight: 600,
  },
  h4: {
    fontSize: 28,
    lineHeight: 1.14,
    fontWeight: 600,
  },
  h5: {
    fontSize: 24,
    lineHeight: 1.66,
    fontWeight: 600,
  },
  h6: {
    fontSize: 20,
    lineHeight: 1.2,
    fontWeight: 600,
  },
  xl: {
    fontSize: 19,
    lineHeight: 1.68,
  },
  large: {
    fontSize: 17,
    lineHeight: 1.64,
  },
  medium: {
    fontSize: 15,
    lineHeight: 1.6,
  },
  small: {
    fontSize: 13,
    lineHeight: 1.54,
  },
  xs: {
    fontSize: 11,
    lineHeight: 1.45,
  },
  xxs: {
    fontSize: 9,
    lineHeight: 1.45,
  },
}
