import { useState, useRef, useEffect } from 'react'
import { Box, Typography, IconButton, Card, CardContent, Stack, CircularProgress, Alert, Fade, Grow, Zoom, Grid, Link, Dialog } from '@mui/material'
import { ChevronLeft, ChevronRight, Warning } from '@mui/icons-material'
import GridCloseIcon from '@icons/close.svg?react'
import { alpha } from '@mui/material/styles'

import { LayoutContent } from '@widgets/layout'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { Board, TablePagination, EditButton } from '@shared/ui'
import { customColors } from '@shared/theme/palette'
import { useNavigate, useLocation } from 'react-router-dom'
import { RouterPaths } from '@shared/lib'
import { useQuery } from 'react-query'
import { ApiKeys, DataPagination, getApiPaths, getQuery } from '@shared/api'
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { TransactionTypeItem } from '@widgets/finance/ui/cash-flow-table/columns'
import { NavigationCards } from '@widgets/finance/ui/navigation-cards'
import { SystemAnalyticDropdown } from '@features/analytic/system-analytic-dropdown'
import { ScheduleButton, ScheduledTransactionsButton } from '@features/finance/schedule-transaction'
import { useStore as useCashFlowStore } from '@features/analytic/cash-flow/create-update/model/store'
import { UpdateTransactionDialog } from '@features/analytic/cash-flow/create-update'

import { useGetFinancialCalendar, DayFinancialData } from '../api/get-financial-calendar'
import { useGetScheduledTransactionsCalendar, DayScheduleData } from '../api/get-scheduled-transactions-calendar'
import { useCalendarModeStore } from '../model/calendar-mode-store'
import { useGetAvailableWallets } from '@features/pos-terminal/api/get-available-wallets'
import { WalletTransactionsModal } from '@pages/wallets/ui/wallet-transactions-modal'
import { ScheduledDayCard } from './scheduled-day-card'
import { TransactionApprovalsModal } from './transaction-approvals-modal'
import { AIAdvisorButton, AIAdvisorModal } from '@features/ai-advisor'

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
]

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${Math.floor(num / 1000000)}млн+`
  }
  return num.toLocaleString()
}



const WalletSummary = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: walletsData, isLoading: walletsLoading, refetch: refetchWallets } = useGetAvailableWallets()
  const [selectedWallet, setSelectedWallet] = useState<any>(null)
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false)

  // Refetch wallets data when component mounts or when navigating back to this page
  useEffect(() => {
    refetchWallets()
  }, [location.pathname, refetchWallets])

  // Also refetch when page becomes visible (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refetchWallets()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [refetchWallets])

  const handleWalletClick = (wallet: any) => {
    setSelectedWallet(wallet)
    setIsTransactionsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsTransactionsModalOpen(false)
    setSelectedWallet(null)
  }

  const wallets = walletsData?.wallets || []
  const enabledWallets = wallets.filter(wallet => {
    // Filter out disabled wallets
    if (!wallet.is_enabled) return false

    // Filter out personal wallets with total_amount > 0
    if (wallet.type === 'personal' && wallet.total_amount > 0) {
      return false
    }

    return true
  })
  const factAmount = walletsData?.fact || 0

  const getRandomIconColor = () => {
    const colors = [
      customColors.incomeStrongLight,
      customColors.expenseLight,
      customColors.installment,
      '#0E9F6E',
      '#3F83F8'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  if (walletsLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          Загружаем кошельки...
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" color="text.secondary" sx={{ fontSize: '14px' }}>
          Краткие сведения
        </Typography>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/wallets')}
          sx={{
            textDecoration: 'underline',
            cursor: 'pointer',
            color: 'primary.main',
            transition: 'color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDelay: '0ms',
            '&:hover': {
              color: 'primary.dark',
              transition: 'color 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transitionDelay: '40ms'
            }
          }}
        >
          Подробнее
        </Link>
      </Box>

      <Grid container spacing={2}>
        {/* Доступно денег card */}
        <Grid item xs={12} sm={6} md={3}>
          <Grow in timeout={500}>
            <Card
              sx={{
                height: { xs: 140, sm: 120, md: 140 },
                bgcolor: factAmount < 0 ? customColors.expense : customColors.incomeStrong,
                border: '1px solid rgba(0,0,0,0.05)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  p: 2
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      mr: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      borderRadius: '50%',
                      bgcolor: factAmount < 0 ? customColors.expenseDark : '#0E9F6E'
                    }}
                  >
                    <img
                      src="/icons/cash.svg"
                      alt="cash"
                      style={{
                        width: 20,
                        height: 20,
                        filter: 'invert(1)'
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '14px',
                        lineHeight: 1.2,
                        color: 'text.primary'
                      }}
                    >
                      Доступно денег
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mt: 'auto' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '16px',
                      color: 'text.primary'
                    }}
                  >
                    {factAmount.toLocaleString()} с.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        {enabledWallets.slice(0, 3).map((wallet, index) => (
          <Grid item xs={12} sm={6} md={3} key={wallet.wallet_id}>
            <Grow in timeout={600 + ((index + 1) * 100)}>
              <Card
                onClick={() => handleWalletClick(wallet)}
                sx={{
                  height: { xs: 140, sm: 120, md: 140 },
                  cursor: 'pointer',
                  border: '1px solid #e0e0e0',
                  bgcolor: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transitionDelay: '0ms',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                    transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    transitionDelay: '60ms'
                  }
                }}
              >
                <CardContent sx={{ p: 2, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        mr: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        borderRadius: '50%',
                        bgcolor: getRandomIconColor(),
                        overflow: 'hidden'
                      }}
                    >
                      <img
                        src={wallet.logo ? `${import.meta.env.VITE_APP_BACK_URL}/${wallet.logo}` : '/icons/wallet.svg'}
                        alt="wallet"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '14px',
                          lineHeight: 1.2,
                          mb: 0.5
                        }}
                      >
                        {wallet.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '11px' }}
                      >
                        {wallet.transaction_count} Поступлений
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 'auto' }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '16px',
                        color: 'text.primary'
                      }}
                    >
                      {wallet.total_amount.toLocaleString()} с.
                    </Typography>
                    <Typography
                      variant="caption"
                      color="success.main"
                      sx={{ fontSize: '10px' }}
                    >
                      {wallet.transaction_share_percent}% от общего
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>

      <WalletTransactionsModal
        open={isTransactionsModalOpen}
        onClose={handleCloseModal}
        wallet={selectedWallet}
      />
    </Box>
  )
}

interface DayCardProps {
  day: number
  currentYear: number
  currentMonth: number
  financialData: any
  isNavigating: boolean
  openDayModal: (day: number) => void
  onInstallmentClick: (day: number) => void
  onIncomeClick: (day: number) => void
}

const DayCard = ({ day, currentYear, currentMonth, financialData, isNavigating, openDayModal, onInstallmentClick, onIncomeClick }: DayCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  const getDayData = (day: number): DayFinancialData | null => {
    if (!financialData?.days) return null

    const dayString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return financialData.days.find((data: any) => data.date === dayString) || null
  }

  const dayData = getDayData(day)

  // Check if this day is in the future
  const today = new Date()
  const dayDate = new Date(currentYear, currentMonth, day)
  const isFutureDate = dayDate > today

  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'))

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setMousePosition({ x, y })
  }

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => {
    setIsHovered(false)
    setMousePosition({ x: 50, y: 50 })
  }

  const hasFinancialData = dayData !== null

  return (
    <Grow
      key={day}
      in={!isNavigating}
      timeout={300 + (day * 20)}
      style={{ transformOrigin: 'center center' }}
    >
      <Card
        ref={cardRef}
        onClick={() => { if (isSmall || isTablet) openDayModal(day) }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          minHeight: { xs: 56, sm: 70, md: 90, lg: 100, xl: 140 },
          bgcolor: (isSmall || isTablet) && hasFinancialData && dayData!.installment > 0
            ? customColors.installment
            : (isFutureDate
                ? 'white'
                : (hasFinancialData
                    ? (dayData!.fact >= 0 ? customColors.incomeStrongLight : customColors.expenseLight)
                    : 'white')),
          border: '1px solid #e0e0e0',
          width: '100%',
          height: 'auto',
          position: 'relative',
          overflow: 'visible',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          animation: (isSmall || isTablet) ? 'none' : 'subtleFloat 8s ease-in-out infinite',
          animationDelay: `${day * 100}ms`,
          '@keyframes subtleFloat': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-2px)' }
          },
          '&:hover': {
            transform: isTablet ? 'scale(1.05)' : 'translateY(-6px) scale(1.02)',
            boxShadow: hasFinancialData && !isFutureDate && dayData!.fact >= 0
              ? '0 12px 24px rgba(188, 240, 218, 0.3)'
              : hasFinancialData && !isFutureDate
                ? '0 12px 24px rgba(251, 213, 213, 0.3)'
                : '0 8px 25px rgba(0,0,0,0.1)',
            border: hasFinancialData && !isFutureDate && dayData!.fact >= 0
              ? '1px solid #BCF0DA'
              : hasFinancialData && !isFutureDate
                ? '1px solid #FBD5D5'
                : '1px solid #ddd',
          },
          '&:active': {
            transform: 'translateY(-3px) scale(0.98)',
            transition: 'all 0.1s ease'
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: hasFinancialData && !isFutureDate
              ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${
                  dayData!.fact >= 0
                    ? 'rgba(188, 240, 218, 0.4) 0%, rgba(188, 240, 218, 0.1) 40%, transparent 70%'
                    : 'rgba(251, 213, 213, 0.4) 0%, rgba(251, 213, 213, 0.1) 40%, transparent 70%'
                })`
              : `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.02) 40%, transparent 70%)`,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(${Math.atan2(mousePosition.y - 50, mousePosition.x - 50) * 180 / Math.PI + 90}deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)`,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
          }
        }}
      >
        <CardContent sx={{
          p: { xs: 0.5, sm: 0.5, md: 0.75, lg: 1, xl: 1.2 },
          position: 'relative',
          zIndex: 1,
          height: '100%',
          minHeight: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: { xs: 'center', sm: 'flex-start', md: 'flex-start', lg: 'flex-start', xl: 'flex-start' },
          alignItems: { xs: 'center', sm: 'stretch', md: 'stretch', lg: 'stretch', xl: 'stretch' },
          '&:last-child': { pb: { xs: 0.5, sm: 0.5, md: 0.75, lg: 1, xl: 1.2 } }
        }}>
          {isTablet ? (
            <Fade in={!isNavigating} timeout={400 + (day * 15)}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'flex-start',
                gap: 0.3,
                width: '100%',
                pt: 0.4,
                px: 0.3
              }}>
                {/* Day number + warning row */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.2 }}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{
                      color: 'text.primary',
                      fontSize: { sm: '11px', md: '13px' },
                      lineHeight: 1
                    }}
                  >
                    {day}
                  </Typography>
                  {hasFinancialData && !isFutureDate && dayData!.fact < 0 && (
                    <Warning
                      sx={{
                        color: '#DC2626',
                        fontSize: { sm: 10, md: 12 },
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%': { opacity: 1, transform: 'scale(1)' },
                          '50%': { opacity: 0.8, transform: 'scale(1.15)' },
                          '100%': { opacity: 1, transform: 'scale(1)' }
                        }
                      }}
                    />
                  )}
                </Box>
                {/* Compact income / expense chips */}
                {hasFinancialData && !isFutureDate && (
                  <>
                    <Box sx={{ bgcolor: customColors.income, borderRadius: 0.5, px: 0.4, py: 0.15 }}>
                      <Typography sx={{ fontSize: { sm: '8px', md: '10px' }, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        +{formatNumber(dayData!.income)}
                      </Typography>
                    </Box>
                    <Box sx={{ bgcolor: customColors.expense, borderRadius: 0.5, px: 0.4, py: 0.15 }}>
                      <Typography sx={{ fontSize: { sm: '8px', md: '10px' }, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        -{formatNumber(dayData!.expense)}
                      </Typography>
                    </Box>
                  </>
                )}
                {hasFinancialData && dayData!.installment > 0 && (
                  <Box sx={{ bgcolor: customColors.installment, borderRadius: 0.5, px: 0.4, py: 0.15 }}>
                    <Typography sx={{ fontSize: { sm: '8px', md: '10px' }, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      р:{formatNumber(dayData!.installment)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Fade>
          ) : (
            /* For desktop: show full content */
            <>
              <Fade in={!isNavigating} timeout={400 + (day * 15)}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'space-between', md: 'flex-start' },
                  flexWrap: { xs: 'nowrap', md: 'wrap' },
                  columnGap: 0.5,
                  rowGap: 0.25,
                  mb: { xs: 0, md: 0.5 },
                  minHeight: { xs: 'auto', sm: 'auto', md: 32 },
                  overflow: 'visible',
                  width: '100%'
                }}>
                  <Zoom in={!isNavigating} timeout={500 + (day * 10)}>
                    {isSmall ? (
                      <Typography
                        variant="caption"
                        fontSize="14px"
                        fontWeight="bold"
                        sx={{ color: 'text.primary' }}
                      >
                        {day}
                      </Typography>
                    ) : (
                      <Box
                        sx={{
                          bgcolor: hasFinancialData && dayData?.has_transaction ? 'primary.main' : '#ffffffff',
                          borderRadius: 1,
                          px: { xs: 0.5, sm: 0.75, md: 1, lg: 1.5 },
                          py: { xs: 0.25, sm: 0.4, md: 0.6, lg: 0.8 },
                          mr: { xs: 0.5, md: 0.75 },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Typography
                          variant="caption"
                          fontSize={{ xs: '10px', sm: '11px', md: '13px', lg: '15px' }}
                          fontWeight="bold"
                          sx={{
                            color: hasFinancialData && dayData?.has_transaction ? 'white' : 'text.primary'
                          }}
                        >
                          {day}
                        </Typography>
                      </Box>
                    )}
                  </Zoom>

                  {/* Warning icon for small screens */}
                  {isSmall && hasFinancialData && !isFutureDate && dayData!.fact < 0 && (
                    <Warning
                      sx={{
                        color: customColors.cashGap,
                        fontSize: 16,
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%': { opacity: 1 },
                          '50%': { opacity: 0.7 },
                          '100%': { opacity: 1 }
                        }
                      }}
                    />
                  )}

                  {/* Cash gap in header for 2K+ screens */}
                  {!isSmall && hasFinancialData && !isFutureDate && dayData!.fact < 0 && (
                    <Box sx={{ display: { xs: 'none', sm: 'none', md: 'none', lg: 'none', xl: 'block' } }}>
                      <Zoom in={!isNavigating} timeout={600 + (day * 10)} style={{ transitionDelay: '100ms' }}>
                        <Box
                          sx={{
                            bgcolor: customColors.cashGap,
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            mr: 1,
                            flexShrink: 0,
                            animation: 'pulse 2s infinite',
                            '@keyframes pulse': {
                              '0%': { opacity: 1 },
                              '50%': { opacity: 0.7 },
                              '100%': { opacity: 1 }
                            }
                          }}
                        >
                          <Typography
                            variant="caption"
                            fontSize="12px"
                            sx={{
                              whiteSpace: 'nowrap',
                              lineHeight: 1.1,
                              fontWeight: 'bold',
                            }}
                          >
                            Кассовый Разрыв
                          </Typography>
                        </Box>
                      </Zoom>
                    </Box>
                  )}
                </Box>
              </Fade>
            </>
          )}



          {/* Show minimal content for tablets, full content for desktop */}
          {!isSmall && !isTablet && hasFinancialData && (
            <Fade in={!isNavigating} timeout={500 + (day * 20)}>
              <Stack spacing={{ xs: 0.5, sm: 0.5, md: 0.6, lg: 0.75 }} sx={{ width: '100%' }}>
              {!isFutureDate && (
                <>
                  <Zoom in={!isNavigating} timeout={600 + (day * 15)} style={{ transitionDelay: '50ms' }}>
                    <Box
                      onClick={(e) => { e.stopPropagation(); onIncomeClick(day) }}
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
                        fontSize={{ xs: '8px', sm: '9px', md: '11px', lg: '13px', xl: '15px' }}
                        sx={{
                          display: { xs: 'block', sm: 'flex' },
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          lineHeight: 1.2,
                          width: '100%'
                        }}
                      >
                        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                          Доход:
                        </Box>
                        <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                          +
                        </Box>
                        {formatNumber(dayData!.income)}
                      </Typography>
                    </Box>
                  </Zoom>

                  <Zoom in={!isNavigating} timeout={650 + (day * 15)} style={{ transitionDelay: '100ms' }}>
                    <Box
                      sx={{
                        bgcolor: customColors.expense,
                        borderRadius: 1,
                        px: { xs: 0.5, sm: 0.5, md: 0.75, lg: 1 },
                        py: { xs: 0.25, sm: 0.3, md: 0.4, lg: 0.5 },
                        width: '100%'
                      }}
                    >
                      <Typography
                        variant="caption"
                        fontSize={{ xs: '8px', sm: '9px', md: '11px', lg: '13px', xl: '15px' }}
                        sx={{
                          display: { xs: 'block', sm: 'flex' },
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          lineHeight: 1.2,
                          width: '100%'
                        }}
                      >
                        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                          Расход:
                        </Box>
                        <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                          -
                        </Box>
                        {formatNumber(dayData!.expense)}
                      </Typography>
                    </Box>
                  </Zoom>
                </>
              )}

              {/* Show installments: always for past/today, only if exists for future */}
              {!isFutureDate ? (
                <Zoom in={!isNavigating} timeout={700 + (day * 15)} style={{ transitionDelay: '150ms' }}>
                  <Box
                    onClick={(e) => { e.stopPropagation(); onInstallmentClick(day) }}
                    sx={{
                      bgcolor: customColors.installment,
                      borderRadius: 1,
                      px: { xs: 0.5, sm: 0.5, md: 0.75, lg: 1 },
                      py: { xs: 0.25, sm: 0.3, md: 0.4, lg: 0.5 },
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      width: '100%',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontSize={{ xs: '8px', sm: '9px', md: '11px', lg: '13px', xl: '15px' }}
                      sx={{
                        display: { xs: 'block', sm: 'flex' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        lineHeight: 1.2,
                        width: '100%'
                      }}
                    >
                      <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                        Рассрочка:
                      </Box>
                      <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                        Р:
                      </Box>
                      {formatNumber(dayData!.installment)}
                    </Typography>
                  </Box>
                </Zoom>
              ) : (
                dayData!.installment !== 0 && (
                  <Zoom in={!isNavigating} timeout={700 + (day * 15)} style={{ transitionDelay: '150ms' }}>
                    <Box
                      onClick={(e) => { e.stopPropagation(); onInstallmentClick(day) }}
                      sx={{
                        bgcolor: customColors.installment,
                        borderRadius: 1,
                        px: { xs: 0.5, sm: 0.5, md: 0.75, lg: 1 },
                        py: { xs: 0.25, sm: 0.3, md: 0.4, lg: 0.5 },
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        width: '100%',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      <Typography
                        variant="caption"
                        fontSize={{ xs: '8px', sm: '9px', md: '11px', lg: '13px', xl: '15px' }}
                        sx={{
                          display: { xs: 'block', sm: 'flex' },
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          lineHeight: 1.2,
                          width: '100%'
                        }}
                      >
                        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                          Рассрочка:
                        </Box>
                        <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                          Р:
                        </Box>
                        {formatNumber(dayData!.installment)}
                      </Typography>
                    </Box>
                  </Zoom>
                )
              )}

              {/* Only show fact for past/current dates */}
              {!isFutureDate && (
                <Zoom in={!isNavigating} timeout={750 + (day * 15)} style={{ transitionDelay: '200ms' }}>
                  <Box
                    sx={{
                      bgcolor: dayData!.fact >= 0 ? customColors.incomeStrong : customColors.expense,
                      borderRadius: 1,
                      px: { xs: 0.5, sm: 0.5, md: 0.75, lg: 1 },
                      py: { xs: 0.25, sm: 0.3, md: 0.4, lg: 0.5 },
                      fontWeight: 'bold',
                      border: `1px solid ${dayData!.fact >= 0 ? 'rgba(188, 240, 218, 0.5)' : 'rgba(251, 213, 213, 0.5)'}`,
                      width: '100%'
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontSize={{ xs: '8px', sm: '9px', md: '11px', lg: '13px', xl: '15px' }}
                      sx={{
                        fontWeight: 'bold',
                        display: { xs: 'block', sm: 'flex' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        lineHeight: 1.2,
                        width: '100%'
                      }}
                    >
                      <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                        Факт:
                      </Box>
                      <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                        =
                      </Box>
                      {formatNumber(dayData!.fact)}
                    </Typography>
                  </Box>
                </Zoom>
              )}
              </Stack>
            </Fade>
          )}
        </CardContent>
      </Card>
    </Grow>
  )
}

// Custom actions component for calendar modal
interface CalendarModalActionsProps {
  row: TransactionTypeItem
  onClose: () => void
}

const CalendarModalActions = ({ row, onClose }: CalendarModalActionsProps) => {
  const openUpdate = useCashFlowStore((state) => state.openUpdate)

  const handleEdit = () => {
    onClose() // Close the income modal first
    // row.id should be the actual API id (not transaction_number)
    openUpdate(row.id) // Then open the transaction details modal
  }

  return (
    <Stack direction="row" spacing="16px" alignItems="center" height="100%">
      <EditButton onClick={handleEdit} />
    </Stack>
  )
}

export const Page = () => {
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isNavigating, setIsNavigating] = useState(false)
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  // Modal state for small screens
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [openDayModal, setOpenDayModal] = useState(false)

  // Modal state for desktop income table
  const [openIncomeModal, setOpenIncomeModal] = useState(false)
  const [incomeModalDay, setIncomeModalDay] = useState<number | null>(null)

  const handleInstallmentClick = (day: number) => {
    const dayString = `${currentYear}-${String(currentMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    navigate(`${RouterPaths.installment}?due_date=${dayString}`)
  }

  // Flip modal state and transactions list for selected day
  const [isFlipped, setIsFlipped] = useState(false)
  const [flipTab, setFlipTab] = useState<'income'>('income')
  const [txPagination, setTxPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 5 })

  const [incomeModalPagination, setIncomeModalPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 5 })

  const getMiniColumns = (onCloseModal: () => void): GridColDef<TransactionTypeItem>[] => [
    {
      field: 'transaction_number',
      headerName: 'ID',
      width: 70,
      renderCell: ({ row }) => String(row.transaction_number ?? row.id),
    },
    { field: 'name', headerName: 'Наименование', flex: 1 },
    {
      field: 'income',
      headerName: 'Доход',
      width: 110,
      renderCell: ({ row }) => (row.type === 'income' ? row.amount : 0),
    },
    { field: 'description', headerName: 'Комментарий', flex: 1 },
    {
      field: 'actions',
      headerName: 'Действия',
      width: 110,
      renderCell: ({ row }) => <CalendarModalActions row={row} onClose={onCloseModal} />
    },
  ]

  const { data: txData, isFetching: txLoading, error: txError } = useQuery({
    queryKey: [
      ApiKeys.CashFlow.getTransactions,
      'day-modal',
      currentYear,
      currentMonth,
      selectedDay,
      flipTab,
      txPagination.page,
      txPagination.pageSize,
    ],
    queryFn: () => {
      const params = new URLSearchParams({
        page: String(txPagination.page + 1),
        per_page: String(txPagination.pageSize),
        ...(flipTab === 'income' ? { type: 'income' } : {}),
      })
      if (selectedDay) {
        const dd = String(selectedDay).padStart(2, '0')
        const mm = String(currentMonth + 1).padStart(2, '0')
        const yyyy = String(currentYear)
        params.set('requestedDate', `${dd}.${mm}.${yyyy}`)
      }
      const url = `${getApiPaths().getTransactions}?${params.toString()}`
      return getQuery<DataPagination<TransactionTypeItem>>(url)()
    },
    keepPreviousData: true,
    enabled: Boolean(openDayModal && isFlipped && selectedDay !== null),
  })

  // Desktop income modal query
  const { data: incomeModalData, isFetching: incomeModalLoading, error: incomeModalError } = useQuery({
    queryKey: [
      ApiKeys.CashFlow.getTransactions,
      'income-modal',
      currentYear,
      currentMonth,
      incomeModalDay,
      incomeModalPagination.page,
      incomeModalPagination.pageSize,
    ],
    queryFn: () => {
      const params = new URLSearchParams({
        page: String(incomeModalPagination.page + 1),
        per_page: String(incomeModalPagination.pageSize),
        type: 'income',
      })
      if (incomeModalDay) {
        const dd = String(incomeModalDay).padStart(2, '0')
        const mm = String(currentMonth + 1).padStart(2, '0')
        const yyyy = String(currentYear)
        params.set('requestedDate', `${dd}.${mm}.${yyyy}`)
      }
      const url = `${getApiPaths().getTransactions}?${params.toString()}`
      return getQuery<DataPagination<TransactionTypeItem>>(url)()
    },
    keepPreviousData: true,
    enabled: Boolean(openIncomeModal && incomeModalDay !== null),
  })

  const handleOpenDayModal = (day: number) => {
    setSelectedDay(day)
    setOpenDayModal(true)
    setIsFlipped(false)
    setTxPagination(prev => ({ ...prev, page: 0 }))
  }
  const handleCloseDayModal = () => {
    setOpenDayModal(false)
    setIsFlipped(false)
  }

  const handleOpenIncomeModal = (day: number) => {
    setIncomeModalDay(day)
    setOpenIncomeModal(true)
    setIncomeModalPagination(prev => ({ ...prev, page: 0 }))
  }
  const handleCloseIncomeModal = () => {
    setOpenIncomeModal(false)
  }

  // Approvals modal state
  const [openApprovalsModal, setOpenApprovalsModal] = useState(false)
  const [selectedApprovalDate, setSelectedApprovalDate] = useState<string | null>(null)

  const handleOpenApprovalsModal = (date: string) => {
    setSelectedApprovalDate(date)
    setOpenApprovalsModal(true)
  }

  const handleCloseApprovalsModal = () => {
    setOpenApprovalsModal(false)
    setSelectedApprovalDate(null)
  }

  const mode = useCalendarModeStore((state) => state.mode)
  const isScheduledMode = mode === 'scheduled'

  const { data: financialData, isLoading, error, refetch: refetchFinancialData } = useGetFinancialCalendar(currentYear, currentMonth + 1)
  const { data: scheduledData, isLoading: isLoadingScheduled, error: errorScheduled, refetch: refetchScheduledData } = useGetScheduledTransactionsCalendar(currentYear, currentMonth + 1, isScheduledMode)

  // Refetch data when component mounts or when user navigates back to the page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible, refetch data
        if (isScheduledMode) {
          refetchScheduledData()
        } else {
          refetchFinancialData()
        }
      }
    }

    // Add event listener for page visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup event listener
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [refetchFinancialData, refetchScheduledData, isScheduledMode])

  // Refetch data when month/year changes or mode changes
  useEffect(() => {
    if (isScheduledMode) {
      refetchScheduledData()
    } else {
      refetchFinancialData()
    }
  }, [currentYear, currentMonth, refetchFinancialData, refetchScheduledData, isScheduledMode])

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

  const navigateMonth = (direction: 'prev' | 'next') => {
    setIsNavigating(true)

    setTimeout(() => {
      const newDate = new Date(currentDate)
      if (direction === 'prev') {
        newDate.setMonth(currentMonth - 1)
      } else {
        newDate.setMonth(currentMonth + 1)
      }
      setCurrentDate(newDate)
      setIsNavigating(false)
    }, 150)
  }

  if (isLoading) {
    return (
      <LayoutContent
        title="Общая информация по финансам"
        breadcrumbs={[
          { label: 'Отчеты', name: 'analytic' },
          { label: 'Общая информация по финансам', name: 'financial-overview' }
        ]}
        rightSlot={<SystemAnalyticDropdown />}
      >
        <Board>
          <Fade in timeout={300}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
              <CircularProgress size={60} thickness={4} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Загружаем финансовые данные...
              </Typography>
            </Box>
          </Fade>
        </Board>
      </LayoutContent>
    )
  }

  if (error) {
    return (
      <LayoutContent
        title="Общая информация по финансам"
        breadcrumbs={[
          { label: 'Отчеты', name: 'analytic' },
          { label: 'Общая информация по финансам', name: 'financial-overview' }
        ]}
        rightSlot={<SystemAnalyticDropdown />}
      >
        <Board>
          <Fade in timeout={400}>
            <Alert severity="error" sx={{ mb: 2 }}>
              Ошибка при загрузке данных. Попробуйте обновить страницу.
            </Alert>
          </Fade>
        </Board>
      </LayoutContent>
    )
  }

  const calendarDays = []

  for (let i = 0; i < adjustedFirstDay; i++) {
    calendarDays.push(
      <Box key={`empty-${i}`} sx={{ minHeight: { xs: 56, sm: 70, md: 90, lg: 100, xl: 140 }, height: 'auto' }} />
    )
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(
      isScheduledMode ? (
        <ScheduledDayCard
          key={day}
          day={day}
          currentYear={currentYear}
          currentMonth={currentMonth}
          scheduledData={scheduledData}
          isNavigating={isNavigating}
          onDayClick={handleOpenApprovalsModal}
        />
      ) : (
        <DayCard
          key={day}
          day={day}
          currentYear={currentYear}
          currentMonth={currentMonth}
          financialData={financialData}
          isNavigating={isNavigating}
          openDayModal={handleOpenDayModal}
          onInstallmentClick={handleInstallmentClick}
          onIncomeClick={handleOpenIncomeModal}
        />
      )
    )
  }

  return (
    <LayoutContent
      title="Календарь"
      breadcrumbs={[
        { label: 'Финансы', name: 'finance', path: '/financial-overview' },
        { label: 'Календарь', name: 'financial-overview' }
      ]}
        rightSlot={<SystemAnalyticDropdown />}
    >
      <NavigationCards />
      <WalletSummary />

      <Box
        sx={{
          width: '100%',
          overflow: 'hidden',
          px: { xs: 0, sm: 1, md: 2, lg: 3, xl: 4 },
          py: { xs: 1, sm: 1, md: 1.5, lg: 2 }
        }}
      >
        <Board
          sx={{
            maxWidth: { xs: '100%', sm: '100%', md: '1200px', lg: '1600px', xl: '2000px' },
            mx: 'auto',
            width: '100%'
          }}
        >
        <Box>
          <Fade in timeout={600}>
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: { xs: 2, md: 3 },
              px: { xs: 1, sm: 2 },
              gap: { xs: 1.5, md: 2 }
            }}>
              {/* Left spacer for balance */}
              <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }} />

              {/* Center: Month navigation */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <IconButton
                  onClick={() => navigateMonth('prev')}
                  sx={{
                    minWidth: { xs: 44, sm: 48 },
                    minHeight: { xs: 44, sm: 48 },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transitionDelay: '0ms',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      bgcolor: 'rgba(0,0,0,0.04)',
                      transition: 'all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      transitionDelay: '40ms'
                    }
                  }}
                >
                  <ChevronLeft sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }} />
                </IconButton>

                <Zoom in={!isNavigating} timeout={400}>
                  <Typography
                    variant="h5"
                    sx={{
                      mx: { xs: 2, sm: 3 },
                      minWidth: { xs: 120, sm: 200 },
                      textAlign: 'center',
                      fontSize: { xs: '1rem', sm: '1.4rem', md: '1.5rem' },
                      fontWeight: { xs: 600, md: 400 },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transitionDelay: '0ms',
                      '&:hover': {
                        color: 'primary.main',
                        transform: 'scale(1.02)',
                        transition: 'all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        transitionDelay: '35ms'
                      }
                    }}
                  >
                    {MONTHS[currentMonth]} {currentYear}
                  </Typography>
                </Zoom>

                <IconButton
                  onClick={() => navigateMonth('next')}
                  sx={{
                    minWidth: { xs: 44, sm: 48 },
                    minHeight: { xs: 44, sm: 48 },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transitionDelay: '0ms',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      bgcolor: 'rgba(0,0,0,0.04)',
                      transition: 'all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      transitionDelay: '40ms'
                    }
                  }}
                >
                  <ChevronRight sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }} />
                </IconButton>
              </Box>

              {/* Right: Schedule buttons */}
              <Box sx={{ flex: 1, display: 'flex', flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-end' }, gap: 1 }}>
                <ScheduledTransactionsButton />
                <ScheduleButton />
              </Box>
            </Box>
          </Fade>

          {/* Totals display for scheduled mode */}
          {isScheduledMode && scheduledData?.total && (
            <Fade in timeout={700}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
                  gap: { xs: 1, sm: 2 },
                  mb: { xs: 2, sm: 3 },
                  px: { xs: 1, sm: 2 }
                }}
              >
                <Card 
                  sx={{ 
                    p: { xs: 1.5, sm: 2 },
                    backgroundColor: customColors.income
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Доход
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {scheduledData.total.income_total.toLocaleString('ru-RU')}
                  </Typography>
                </Card>
                <Card 
                  sx={{ 
                    p: { xs: 1.5, sm: 2 },
                    backgroundColor: customColors.expense
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Расход
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {scheduledData.total.expense_total.toLocaleString('ru-RU')}
                  </Typography>
                </Card>
                <Card 
                  sx={{ 
                    p: { xs: 1.5, sm: 2 },
                    backgroundColor: (theme) => alpha(theme.palette.info.main, 0.1)
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Одобрено
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {scheduledData.total.completed_total.toLocaleString('ru-RU')}
                  </Typography>
                </Card>
                <Card 
                  sx={{ 
                    p: { xs: 1.5, sm: 2 },
                    backgroundColor: (theme) => alpha(theme.palette.warning.main, 0.1)
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Не одобрено
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {scheduledData.total.not_completed_total.toLocaleString('ru-RU')}
                  </Typography>
                </Card>
              </Box>
            </Fade>
          )}

          <Fade in timeout={800}>
            <Box
              sx={{
                display: { xs: 'none', sm: 'grid' },
                gridTemplateColumns: {
                  sm: 'repeat(7, minmax(28px, 1fr))',
                  md: 'repeat(7, minmax(60px, 1fr))',
                  lg: 'repeat(7, minmax(120px, 1fr))',
                  xl: 'repeat(7, minmax(160px, 1fr))'
                },
                gap: { sm: 0.5, md: 0.75, lg: 1, xl: 1.25 },
                mb: 1
              }}
            >
              {WEEKDAYS.map((day, index) => (
                <Zoom key={day} in timeout={300 + (index * 50)} style={{ transitionDelay: '200ms' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        transitionDelay: '0ms',
                        '&:hover': {
                          color: 'primary.main',
                          transform: 'scale(1.1)',
                          transition: 'all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                          transitionDelay: '30ms'
                        }
                      }}
                    >
                      {day}
                    </Typography>
                  </Box>
                </Zoom>
              ))}
            </Box>
          </Fade>

          {/* Mobile Weekday Header */}
          <Box sx={{ display: { xs: 'block', sm: 'none' }, mb: 2 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 0.5,
                mb: 1
              }}
            >
              {WEEKDAYS.map((day) => (
                <Box key={day} sx={{ textAlign: 'center', py: 1 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      fontSize: '10px',
                      fontWeight: 600
                    }}
                  >
                    {day}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Fade in timeout={1000}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(7, 1fr)',
                  sm: 'repeat(7, minmax(28px, 1fr))',
                  md: 'repeat(7, minmax(60px, 1fr))',
                  lg: 'repeat(7, minmax(120px, 1fr))',
                  xl: 'repeat(7, minmax(160px, 1fr))'
                },
                gap: { xs: 0.5, sm: 0.5, md: 0.75, lg: 1, xl: 1.25 },
                alignItems: 'stretch'
              }}
            >
              {calendarDays}
            </Box>
          </Fade>
        </Box>
        </Board>
      </Box>

      {/* Day details modal for small screens and tablets */}
      <Dialog
        open={openDayModal}
        onClose={handleCloseDayModal}
        maxWidth={false}
        TransitionProps={{
          timeout: 500,
        }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'visible',
            background: 'transparent',
            boxShadow: 'none',
            width: isFlipped
              ? { xs: '95%', sm: '380px', md: '920px' }
              : { xs: '90%', sm: '320px', md: '750px' },
            maxWidth: isFlipped
              ? { xs: '380px', sm: '420px', md: '980px' }
              : { xs: '350px', sm: '350px', md: '350px' },
            maxHeight: isFlipped ? { xs: '72vh', sm: '75vh', md: '80vh' } : 'auto',
            animation: 'modalZoomRotate 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            '@keyframes modalZoomRotate': {
              '0%': {
                transform: 'scale(0.3) rotate(-10deg)',
                opacity: 0,
              },
              '50%': {
                transform: 'scale(1.05) rotate(2deg)',
              },
              '100%': {
                transform: 'scale(1) rotate(0deg)',
                opacity: 1,
              }
            }
          }
        }}
      >
        {(() => {
          if (!selectedDay || !financialData?.days) return null
          const dayString = `${currentYear}-${String(currentMonth + 1).padStart(2,'0')}-${String(selectedDay).padStart(2,'0')}`
          const data = financialData.days.find((d: any) => d.date === dayString)
          const today = new Date()
          const dayDate = new Date(currentYear, currentMonth, selectedDay)
          const isFutureDate = dayDate > today
          const hasFinancialData = data && (data.income !== 0 || data.expense !== 0 || data.installment !== 0 || data.fact !== 0)

          if (!data) return <Typography variant="body2" color="text.secondary" sx={{ p: 3 }}>Нет данных</Typography>

          return (
            <Zoom in timeout={400} style={{ width: '100%' }}>
              <Box
                sx={{
                  minHeight: { xs: 400, sm: 500, md: 560, lg: 600, xl: 650 },
                  height: 'auto',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  bgcolor: isFutureDate
                    ? 'white'
                    : (hasFinancialData
                        ? (data.fact >= 0 ? customColors.incomeStrongLight : customColors.expenseLight)
                        : 'white'),
                  border: '2px solid',
                  borderColor: isFutureDate
                    ? '#e0e0e0'
                    : (hasFinancialData
                        ? (data.fact >= 0 ? customColors.incomeStrong : customColors.cashGap)
                        : '#e0e0e0'),
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  perspective: '1000px',
                  transformStyle: 'preserve-3d',
                  p: { xs: 2.5, sm: 2.5, md: 2.5, lg: 3.5, xl: 4.5 },

                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: isFutureDate
                      ? 'transparent'
                      : (hasFinancialData
                          ? (data.fact >= 0
                              ? `linear-gradient(135deg, ${customColors.incomeStrongLight}00 0%, ${customColors.incomeStrongLight}60 100%)`
                              : `linear-gradient(135deg, ${customColors.expenseLight}00 0%, ${customColors.expenseLight}60 100%)`)
                          : 'transparent'),
                    opacity: 0.8,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none',
                  }
                }}
              >
                {isFlipped && (
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      zIndex: 5,
                      p: { xs: 2, sm: 2.5, md: 3 },
                      display: 'flex',
                      flexDirection: 'column',
                      bgcolor: 'white',
                      backfaceVisibility: 'hidden',
                      overflowY: 'auto',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                        Транзакции за {String(selectedDay).padStart(2,'0')}.{String(currentMonth + 1).padStart(2,'0')}.{currentYear}
                      </Typography>
                      <Link component="button" onClick={() => setIsFlipped(false)} sx={{ fontWeight: 600, fontSize: 14 }}>Назад</Link>
                    </Box>
                    <TablePagination
                      columns={getMiniColumns(handleCloseDayModal) as any}
                      rows={txData?.data as any}
                      loading={txLoading}
                      paginationModel={txPagination}
                      rowCount={txData?.meta.total || 0}
                      changePaginationModel={setTxPagination}
                      pageCount={txData?.meta.last_page || 0}
                      error={txError}
                      sx={{ height: { xs: 260, sm: 320, md: 380, lg: 420 } }}
                    />
                  </Box>
                )}

                <Box sx={{ position: 'relative', zIndex: 1, width: '100%', transition: 'transform 0.4s ease, opacity 0.3s ease', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)', opacity: isFlipped ? 0 : 1, pointerEvents: isFlipped ? 'none' : 'auto' }}>
                  {/* Header with date and cash gap indicator */}
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    columnGap: 1,
                    rowGap: 0.5,
                    mb: 2
                  }}>
                    <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem', lg: '1.75rem', xl: '2rem' } }}>
                      {String(selectedDay).padStart(2,'0')}.{String(currentMonth + 1).padStart(2,'0')}.{currentYear}
                    </Typography>

                    {hasFinancialData && !isFutureDate && data.fact < 0 && (
                      <Box
                        sx={{
                          bgcolor: customColors.cashGap,
                          borderRadius: 2,
                          px: 2,
                          py: 0.5,
                          animation: 'pulse 2s infinite',
                          '@keyframes pulse': {
                            '0%': { opacity: 1, transform: 'scale(1)' },
                            '50%': { opacity: 0.8, transform: 'scale(1.05)' },
                            '100%': { opacity: 1, transform: 'scale(1)' }
                          }
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            whiteSpace: 'nowrap',
                            fontWeight: 'bold',
                            fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem', lg: '1.25rem', xl: '1.5rem' }
                          }}
                        >
                          ⚠️ Кассовый Разрыв
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Financial data */}
                  {hasFinancialData && (
                    <Stack spacing={{ xs: 1.5, sm: 1.5, md: 1.5, lg: 2, xl: 2.5 }} sx={{ width: '100%' }}>
                      {!isFutureDate && (
                        <>
                          <Zoom in timeout={300} style={{ transitionDelay: '100ms' }}>
                            <Box onClick={() => { setFlipTab('income'); setIsFlipped(true) }} sx={{
                              cursor: 'pointer',
                              bgcolor: customColors.income,
                              borderRadius: 2,
                              px: { xs: 2, sm: 2, md: 2, lg: 3, xl: 4 },
                              py: { xs: 1.5, sm: 1.5, md: 1.5, lg: 2, xl: 2.5 },
                              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                              transition: 'all 0.2s ease',
                              width: '100%',
                              '&:hover': {
                                transform: 'translateX(4px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
                              }
                            }}>
                              <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem', lg: '1.25rem', xl: '1.5rem' }, width: '100%' }}>
                                <Box component="span" sx={{ color: 'text.secondary' }}>Доход:</Box>
                                <Box component="span" sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem', lg: '1.4rem', xl: '1.75rem' } }}>+{formatNumber(data.income)} с.</Box>
                              </Typography>
                            </Box>
                          </Zoom>
                          <Zoom in timeout={300} style={{ transitionDelay: '200ms' }}>
                            <Box sx={{
                              bgcolor: customColors.expense,
                              borderRadius: 2,
                              px: { xs: 2, sm: 2, md: 2, lg: 3, xl: 4 },
                              py: { xs: 1.5, sm: 1.5, md: 1.5, lg: 2, xl: 2.5 },
                              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                              transition: 'all 0.2s ease',
                              width: '100%',
                              '&:hover': {
                                transform: 'translateX(4px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
                              }
                            }}>
                              <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem', lg: '1.25rem', xl: '1.5rem' }, width: '100%' }}>
                                <Box component="span" sx={{ color: 'text.secondary' }}>Расход:</Box>
                                <Box component="span" sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem', lg: '1.4rem', xl: '1.75rem' } }}>-{formatNumber(data.expense)} с.</Box>
                              </Typography>
                            </Box>
                          </Zoom>
                          <Zoom in timeout={300} style={{ transitionDelay: '400ms' }}>
                            <Box sx={{
                              bgcolor: data.fact >= 0 ? customColors.incomeStrong : customColors.expense,
                              borderRadius: 2,
                              px: { xs: 2, sm: 2, md: 2, lg: 3, xl: 4 },
                              py: { xs: 1.5, sm: 1.5, md: 1.5, lg: 2, xl: 2.5 },
                              border: '2px solid',
                              borderColor: data.fact >= 0 ? customColors.incomeStrong : customColors.cashGap,
                              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                              transition: 'all 0.2s ease',
                              width: '100%',
                              '&:hover': {
                                transform: 'scale(1.02)',
                                boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                              }
                            }}>
                              <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem', lg: '1.25rem', xl: '1.5rem' }, width: '100%' }}>
                                <Box component="span" sx={{ fontWeight: 'bold' }}>Факт:</Box>
                                <Box component="span" sx={{ fontWeight: 'bold', fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem', lg: '1.5rem', xl: '1.875rem' } }}>{data.fact >= 0 ? '+' : ''}{formatNumber(data.fact)} с.</Box>
                              </Typography>
                            </Box>
                          </Zoom>
                        </>
                      )}
                      {isFutureDate ? (
                        data.installment !== 0 && (
                          <Zoom in timeout={300} style={{ transitionDelay: '300ms' }}>
                            <Box
                              onClick={() => handleInstallmentClick(selectedDay!)}
                              sx={{
                                bgcolor: customColors.installment,
                                borderRadius: 2,
                                px: { xs: 2, sm: 2, md: 2, lg: 3, xl: 4 },
                                py: { xs: 1.5, sm: 1.5, md: 1.5, lg: 2, xl: 2.5 },
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                transition: 'all 0.2s ease',
                                width: '100%',
                                '&:hover': {
                                  transform: 'translateX(4px)',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
                                }
                              }}
                            >
                              <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem', lg: '1.25rem', xl: '1.5rem' }, width: '100%' }}>
                                <Box component="span" sx={{ color: 'text.secondary' }}>Рассрочка:</Box>
                                <Box component="span" sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem', lg: '1.4rem', xl: '1.75rem' } }}>{formatNumber(data.installment)} с.</Box>
                              </Typography>
                            </Box>
                          </Zoom>
                        )
                      ) : (
                        <Zoom in timeout={300} style={{ transitionDelay: '300ms' }}>
                          <Box
                            onClick={() => handleInstallmentClick(selectedDay!)}
                            sx={{
                              bgcolor: customColors.installment,
                              borderRadius: 2,
                              px: { xs: 2, sm: 2, md: 2, lg: 3, xl: 4 },
                              py: { xs: 1.5, sm: 1.5, md: 1.5, lg: 2, xl: 2.5 },
                              cursor: 'pointer',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                              transition: 'all 0.2s ease',
                              width: '100%',
                              '&:hover': {
                                transform: 'translateX(4px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
                              }
                            }}
                          >
                            <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem', lg: '1.25rem', xl: '1.5rem' }, width: '100%' }}>
                              <Box component="span" sx={{ color: 'text.secondary' }}>Рассрочка:</Box>
                              <Box component="span" sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem', lg: '1.4rem', xl: '1.75rem' } }}>{formatNumber(data.installment)} с.</Box>
                            </Typography>
                          </Box>
                        </Zoom>
                      )}
                    </Stack>
                  )}

                  {!hasFinancialData && (
                    <Typography variant="body2" color="text.secondary">Нет финансовых данных</Typography>
                  )}
                </Box>
              </Box>
            </Zoom>
          )
        })()}
      </Dialog>

      {/* Desktop income modal */}
      <Dialog
        open={openIncomeModal}
        onClose={handleCloseIncomeModal}
        maxWidth="md"
        fullWidth
        TransitionProps={{
          timeout: 400,
        }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            animation: 'modalZoomIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            '@keyframes modalZoomIn': {
              '0%': {
                transform: 'scale(0.5)',
                opacity: 0,
              },
              '100%': {
                transform: 'scale(1)',
                opacity: 1,
              }
            }
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
              Доход за {incomeModalDay ? String(incomeModalDay).padStart(2,'0') : ''}.{String(currentMonth + 1).padStart(2,'0')}.{currentYear}
            </Typography>
            <IconButton onClick={handleCloseIncomeModal} size="small">
              <GridCloseIcon width={24} height={24} />
            </IconButton>
          </Box>
          <TablePagination
            columns={getMiniColumns(handleCloseIncomeModal) as any}
            rows={incomeModalData?.data as any}
            loading={incomeModalLoading}
            paginationModel={incomeModalPagination}
            rowCount={incomeModalData?.meta.total || 0}
            changePaginationModel={setIncomeModalPagination}
            pageCount={incomeModalData?.meta.last_page || 0}
            error={incomeModalError}
            sx={{ height: 420 }}
          />
        </Box>
      </Dialog>

      {/* Transaction Approvals Modal */}
      <TransactionApprovalsModal
        open={openApprovalsModal}
        onClose={handleCloseApprovalsModal}
        selectedDate={selectedApprovalDate}
      />

      <UpdateTransactionDialog />

      {/* AI Advisor */}
      <AIAdvisorButton page="financial-overview" />
      <AIAdvisorModal />

    </LayoutContent>
  )
}
