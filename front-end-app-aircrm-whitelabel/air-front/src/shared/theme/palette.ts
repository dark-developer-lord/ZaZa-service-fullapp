import { grey as greyScale } from '@mui/material/colors'
import type { ThemeOptions } from '@mui/material/styles'

export const colors: ThemeOptions['palette'] = {
  mode: 'light',
  /** Required: many components use palette.grey[100] / sx grey.100 */
  grey: greyScale,
  primary: {
    main: '#005456'
    // main: '#1D272F' //old black color
  },
  secondary: {
    main: '#F5F7FA',
  },
  success: {
    main: '#0E9F6E',
  },
  error: {
    main: '#F05252',
  },
  info: {
    main: '#3F83F8'
  },
  warning: {
    main: '#F59E0B',
    light: '#FDFDEA'
  },
  text: {
    primary: '#231F20',
    secondary: '#5E5F62',
    tertiary: '#A0A3BD',
  },
}

export const customColors = {
  income: '#DEF7EC',
  incomeStrong: '#BCF0DA',
  incomeStrongLight: '#E8F5E8',
  expense: '#FBD5D5',
  expenseLight: '#FDF2F2',
  expenseDark: '#FF7878',
  installment: '#FEECDC',
  cashGap: '#FDFDEA'
}

/** Resolved at runtime by createTheme({ palette }) — avoid deep imports removed in MUI 7 */
export const palette = colors
