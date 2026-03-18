import { useState } from 'react'
import { Box, Card, CardContent, Typography, Fade, Zoom, Badge, Stack, useTheme, useMediaQuery } from '@mui/material'
import { DayScheduleData } from '../api/get-scheduled-transactions-calendar'

interface ScheduledDayCardProps {
  day: number
  currentYear: number
  currentMonth: number
  scheduledData?: { calendar: DayScheduleData[] }
  isNavigating: boolean
  onDayClick: (date: string) => void
}

const customColors = {
  income: '#BCF0DA',
  expense: '#FBD5D5',
  dividends: '#E0E7FF',
}

export const ScheduledDayCard = ({
  day,
  currentYear,
  currentMonth,
  scheduledData,
  isNavigating,
  onDayClick,
}: ScheduledDayCardProps) => {
  const theme = useTheme()
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'))
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))

  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })

  // Find data for this specific day
  const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const dayData = scheduledData?.calendar?.find((d) => d.date === dateStr)

  const hasSchedules = dayData && dayData.total_schedules > 0
  const hasUnapproved = dayData?.has_unapproved || false
  const unapprovedCount = dayData?.unapproved_count || 0

  // Only show green background if there are unapproved schedules
  const shouldHighlight = hasSchedules && hasUnapproved && unapprovedCount > 0

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePosition({ x, y })
  }

  // Check if date is in the future
  const today = new Date()
  const currentDate = new Date(currentYear, currentMonth, day)
  const isFutureDate = currentDate > today

  const handleClick = () => {
    if (hasSchedules) {
      onDayClick(dateStr)
    }
  }

  return (
    <Zoom in={!isNavigating} timeout={300 + (day * 20)} style={{ transitionDelay: `${day * 10}ms` }}>
      <Card
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        sx={{
          minHeight: { xs: 50, sm: 36, md: 38, lg: 100, xl: 140 },
          height: '100%',
          cursor: hasSchedules ? 'pointer' : 'default',
          position: 'relative',
          overflow: 'hidden',
          bgcolor: shouldHighlight ? 'primary.main' : 'white',
          border: shouldHighlight ? '2px solid' : '1px solid',
          borderColor: shouldHighlight ? 'primary.dark' : '#e0e0e0',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: shouldHighlight
            ? '0 4px 12px rgba(0, 84, 86, 0.2)'
            : '0 2px 4px rgba(0,0,0,0.05)',
          '&:hover': {
            transform: isTablet ? 'scale(1.05)' : 'translateY(-6px) scale(1.02)',
            boxShadow: shouldHighlight
              ? '0 12px 24px rgba(0, 84, 86, 0.3)'
              : '0 8px 25px rgba(0,0,0,0.1)',
            borderColor: shouldHighlight ? 'primary.dark' : '#ddd',
          },
          '&:active': {
            transform: 'translateY(-3px) scale(0.98)',
            transition: 'all 0.1s ease'
          },
        }}
      >
        <CardContent sx={{
          p: { xs: 0.5, sm: 0.25, md: 0.3, lg: 1, xl: 1.2 },
          position: 'relative',
          zIndex: 1,
          height: '100%',
          minHeight: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: { xs: 'center', sm: 'center', md: 'center', lg: 'flex-start', xl: 'flex-start' },
          alignItems: { xs: 'center', sm: 'center', md: 'center', lg: 'stretch', xl: 'stretch' },
          '&:last-child': { pb: { xs: 0.5, sm: 0.25, md: 0.3, lg: 1, xl: 1.2 } }
        }}>
          {/* Date number with unapproved badge */}
          <Fade in={!isNavigating} timeout={400 + (day * 15)}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: { xs: 0, sm: 0, md: 0, lg: 0.5, xl: 0.75 },
              width: '100%'
            }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  color: shouldHighlight ? 'white' : 'text.primary',
                  fontSize: { xs: '14px', sm: '12px', md: '13px', lg: '18px', xl: '22px' },
                  lineHeight: 1
                }}
              >
                {day}
              </Typography>

              {/* Unapproved count badge */}
              {hasUnapproved && (
                <Badge
                  badgeContent={unapprovedCount}
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: 'error.main',
                      color: 'white',
                      fontSize: { xs: '9px', sm: '8px', md: '9px', lg: '11px', xl: '12px' },
                      minWidth: { xs: 16, sm: 14, md: 16, lg: 18, xl: 20 },
                      height: { xs: 16, sm: 14, md: 16, lg: 18, xl: 20 },
                      padding: '0 4px',
                      fontWeight: 700,
                    }
                  }}
                />
              )}
            </Box>
          </Fade>

          {/* Show transaction type cards only on desktop */}
          {!isSmall && !isTablet && hasSchedules && (
            <Fade in={!isNavigating} timeout={500 + (day * 20)}>
              <Stack spacing={{ xs: 0.5, sm: 0.5, md: 0.6, lg: 0.75 }} sx={{ width: '100%' }}>
                {/* Income */}
                {dayData.income.count > 0 && (
                  <Zoom in={!isNavigating} timeout={600 + (day * 15)} style={{ transitionDelay: '50ms' }}>
                    <Box
                      sx={{
                        bgcolor: customColors.income,
                        borderRadius: 1,
                        px: { xs: 0.5, sm: 0.5, md: 0.75, lg: 1 },
                        py: { xs: 0.25, sm: 0.3, md: 0.4, lg: 0.5 },
                        width: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: { lg: '11px', xl: '12px' },
                          fontWeight: 600,
                          color: '#065F46',
                          display: 'block',
                          lineHeight: 1.2
                        }}
                      >
                        Доход
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: { lg: '10px', xl: '11px' },
                          color: '#065F46',
                          display: 'block',
                          opacity: 0.8
                        }}
                      >
                        {dayData.income.total_amount.toLocaleString()} сом.
                      </Typography>
                    </Box>
                  </Zoom>
                )}

                {/* Expense */}
                {dayData.expense.count > 0 && (
                  <Zoom in={!isNavigating} timeout={620 + (day * 15)} style={{ transitionDelay: '70ms' }}>
                    <Box
                      sx={{
                        bgcolor: customColors.expense,
                        borderRadius: 1,
                        px: { xs: 0.5, sm: 0.5, md: 0.75, lg: 1 },
                        py: { xs: 0.25, sm: 0.3, md: 0.4, lg: 0.5 },
                        width: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: { lg: '11px', xl: '12px' },
                          fontWeight: 600,
                          color: '#991B1B',
                          display: 'block',
                          lineHeight: 1.2
                        }}
                      >
                        Расход
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: { lg: '10px', xl: '11px' },
                          color: '#991B1B',
                          display: 'block',
                          opacity: 0.8
                        }}
                      >
                        {dayData.expense.total_amount.toLocaleString()} сом.
                      </Typography>
                    </Box>
                  </Zoom>
                )}

                {/* Dividends */}
                {dayData.dividends.count > 0 && (
                  <Zoom in={!isNavigating} timeout={640 + (day * 15)} style={{ transitionDelay: '90ms' }}>
                    <Box
                      sx={{
                        bgcolor: customColors.dividends,
                        borderRadius: 1,
                        px: { xs: 0.5, sm: 0.5, md: 0.75, lg: 1 },
                        py: { xs: 0.25, sm: 0.3, md: 0.4, lg: 0.5 },
                        width: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: { lg: '11px', xl: '12px' },
                          fontWeight: 600,
                          color: '#3730A3',
                          display: 'block',
                          lineHeight: 1.2
                        }}
                      >
                        Дивиденды
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: { lg: '10px', xl: '11px' },
                          color: '#3730A3',
                          display: 'block',
                          opacity: 0.8
                        }}
                      >
                        {dayData.dividends.total_amount.toLocaleString()} сом.
                      </Typography>
                    </Box>
                  </Zoom>
                )}
              </Stack>
            </Fade>
          )}
        </CardContent>
      </Card>
    </Zoom>
  )
}

