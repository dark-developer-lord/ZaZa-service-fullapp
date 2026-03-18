import { Component, ErrorInfo, ReactNode } from 'react'
import { Box, Button, Typography } from '@mui/material'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)

    // Report to Sentry when available (install with: pnpm add @sentry/react)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Sentry = (window as any).__SENTRY__
      if (Sentry) {
        Sentry.captureException(error, { extra: { componentStack: info.componentStack } })
      }
    } catch {
      // Sentry not available — silently ignore
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: 3,
            p: 4,
            textAlign: 'center',
            bgcolor: '#F5F7FA',
          }}
        >
          <WarningAmberRoundedIcon sx={{ fontSize: 72, color: 'warning.main' }} />
          <Typography variant="h4" fontWeight={700}>
            Что-то пошло не так
          </Typography>
          <Typography variant="body1" color="text.secondary" maxWidth={480}>
            Произошла непредвиденная ошибка. Мы уже работаем над её устранением.
            Попробуйте перезагрузить страницу или вернуться на главную.
          </Typography>
          {import.meta.env.DEV && this.state.error && (
            <Box
              component="pre"
              sx={{
                bgcolor: '#1e1e1e',
                color: '#f8f8f2',
                p: 2,
                borderRadius: 2,
                fontSize: 13,
                maxWidth: 640,
                width: '100%',
                overflow: 'auto',
                textAlign: 'left',
              }}
            >
              {this.state.error.message}
            </Box>
          )}
          <Button variant="contained" size="large" onClick={this.handleReset}>
            Вернуться на главную
          </Button>
        </Box>
      )
    }

    return this.props.children
  }
}
