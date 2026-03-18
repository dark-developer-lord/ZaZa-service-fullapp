import { PropsWithChildren } from 'react'
import { Toaster } from 'react-hot-toast'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ruRU } from '@mui/x-date-pickers/locales'
import dayjs from 'dayjs'

import { theme } from '@shared/theme'
import { getLSLoginSource } from '@shared/auth'

import { ApiProvider } from './api-provider'
import { AuthProvider } from './auth-provider'
import { RouterProvider } from './router-provider'
import { ErrorBoundary } from './error-boundary'

import 'dayjs/locale/ru'
import { DeliveryManOrdersPage } from '@pages/courier-order'

dayjs.locale('ru')

const ruLocale = ruRU.components.MuiLocalizationProvider.defaultProps.localeText
export const Providers = ({ children }: PropsWithChildren) => {
  const source = getLSLoginSource()
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ApiProvider>
        <ErrorBoundary>
          { source === "delivery-man" ? (
            <DeliveryManOrdersPage />
          ) : (
            <AuthProvider>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="ru"
                localeText={ruLocale}
              >
                <RouterProvider />
              </LocalizationProvider>
              {children}
            </AuthProvider>
          )}
        </ErrorBoundary>
      </ApiProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: 'Gilroy',
          },
        }}
      />
    </ThemeProvider>
  )
}
