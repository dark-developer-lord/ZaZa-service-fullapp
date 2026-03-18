import { Button, useMediaQuery, useTheme } from '@mui/material'
import CalendarIcon from '@mui/icons-material/CalendarMonth'

import { useCalendarModeStore } from '@pages/financial-overview/model/calendar-mode-store'

export const ScheduledTransactionsButton = () => {
  const { mode, toggleMode } = useCalendarModeStore()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))

  const isScheduledMode = mode === 'scheduled'

  return (
    <Button
      variant={isScheduledMode ? 'contained' : 'outlined'}
      color="primary"
      size={!isMobile ? 'medium' : 'small'}
      startIcon={
        <CalendarIcon
          sx={{
            width: 20,
            height: 20,
            color: isScheduledMode ? 'white' : 'primary.main'
          }}
        />
      }
      onClick={toggleMode}
      sx={{
        backgroundColor: isScheduledMode ? 'primary.main' : 'transparent',
        borderColor: 'primary.main',
        color: isScheduledMode ? 'white' : 'primary.main',
        '&:hover': {
          backgroundColor: isScheduledMode ? '#004547' : 'rgba(0, 84, 86, 0.08)',
          borderColor: isScheduledMode ? '#004547' : 'primary.main',
          transform: 'translateY(-1px)',
          boxShadow: isScheduledMode 
            ? '0 4px 8px rgba(0, 84, 86, 0.3)' 
            : '0 2px 4px rgba(0, 84, 86, 0.2)',
        },
        transition: 'all 0.2s ease-in-out',
        borderRadius: 1,
        whiteSpace: 'nowrap',
      }}
    >
      {isScheduledMode ? 'Финансовый календарь' : 'Запланированные'}
    </Button>
  )
}

