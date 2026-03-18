import { useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent, Box, Typography, Grow } from '@mui/material'
import { RouterPaths } from '@shared/lib'
import DbIcon from '@icons/db.svg?react'

const navigationCards = [
  {
    title: 'Календарь',
    path: '/financial-overview',
    bgColor: '#F05252',
  },
  {
    title: 'ДДС',
    path: RouterPaths.cashFlow,
    bgColor: '#0E9F6E',
  },
  {
    title: 'Рассрочки',
    path: RouterPaths.installment,
    bgColor: '#3F83F8',
  },
  {
    title: 'Контрагенты',
    path: RouterPaths.counterparties,
    bgColor: '#F59E0B',
  },
  {
    title: 'Финансы',
    path: RouterPaths.finance,
    bgColor: '#9c27b0',
  }
]

export const NavigationCards = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Box
      sx={{
        // Mobile: horizontal scrollable carousel
        display: { xs: 'flex', sm: 'grid' },
        flexDirection: { xs: 'row', sm: 'unset' },
        overflowX: { xs: 'auto', sm: 'visible' },
        overflowY: { xs: 'hidden', sm: 'visible' },
        gap: 2,
        mb: 4,
        // Hide scrollbar but keep functionality
        scrollbarWidth: { xs: 'none', sm: 'auto' },
        '&::-webkit-scrollbar': {
          display: { xs: 'none', sm: 'block' },
        },
        // Smooth scrolling
        scrollBehavior: 'smooth',
        // Grid layout for larger screens
        gridTemplateColumns: {
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(5, 1fr)'
        },
        // Add padding for mobile scroll
        px: { xs: 1, sm: 0 },
        // Add subtle shadow on mobile to indicate scrollability
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: { xs: '20px', sm: 0 },
          background: 'linear-gradient(to left, rgba(255,255,255,0.8), transparent)',
          pointerEvents: 'none',
          zIndex: 1,
        }
      }}
    >
      {navigationCards.map((card, index) => {
        const isActive = location.pathname === card.path

        return (
          <Grow in timeout={400 + (index * 100)} key={card.title}>
            <Card
              onClick={() => navigate(card.path)}
              sx={{
                cursor: 'pointer',
                bgcolor: 'white',
                border: isActive ? `2px solid ${card.bgColor}` : '1px solid #e0e0e0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transitionDelay: '0ms',
                // Mobile: fixed width for horizontal scroll
                minWidth: { xs: '140px', sm: 'auto' },
                flexShrink: { xs: 0, sm: 1 },
                '&:hover': {
                  transform: { xs: 'scale(1.02)', sm: 'translateY(-4px)' },
                  boxShadow: `0 8px 25px ${card.bgColor}30`,
                  border: `2px solid ${card.bgColor}`,
                  transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transitionDelay: '50ms'
                }
              }}
            >
              <CardContent 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: { xs: 'center', sm: 'space-between' },
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 1, sm: 0 },
                  '&:last-child': { pb: { xs: 1.5, sm: 2 } },
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 1.5, sm: 2 }
                }}
              >
                <Box
                  sx={{
                    width: { xs: 36, sm: 40 },
                    height: { xs: 36, sm: 40 },
                    borderRadius: '50%',
                    bgcolor: card.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    mr: { xs: 0, sm: 2 }
                  }}
                >
                  <DbIcon width={18} height={18} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '14px', sm: '16px' },
                    color: isActive ? card.bgColor : 'text.primary',
                    transition: 'color 0.3s ease',
                    textAlign: { xs: 'center', sm: 'left' },
                    whiteSpace: 'nowrap'
                  }}
                >
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          </Grow>
        )
      })}
    </Box>
  )
}

