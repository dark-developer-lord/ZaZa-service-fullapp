import { useState } from 'react'
import { Box, Typography, Card, CardContent, IconButton, Grid, Fade, Grow, CircularProgress, Alert } from '@mui/material'
import { Add } from '@mui/icons-material'
import { LayoutContent } from '@widgets/layout'
import { Board } from '@shared/ui'
import { customColors } from '@shared/theme/palette'
import { RouterPaths } from '@shared/lib'
import { AddWalletModal } from './add-wallet-modal'
import { ActivationModal } from './activation-modal'
import { WalletTransactionsModal } from './wallet-transactions-modal'
import { useGetWallets } from '../api/get-wallets'

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

export const Page = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isActivationModalOpen, setIsActivationModalOpen] = useState(false)
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<any>(null)
  const { data: walletsResponse, isLoading, error } = useGetWallets()

  // Filter out personal wallets with balance > 0
  const wallets = (walletsResponse?.wallets || []).filter(wallet => {
    // If wallet is personal type and has balance > 0, hide it
    if (wallet.type === 'personal' && wallet.total_amount > 0) {
      return false
    }
    return true
  })
  const factAmount = walletsResponse?.fact || 0

  const handleActivateWallet = (wallet: any) => {
    setSelectedWallet(wallet)
    setIsActivationModalOpen(true)
  }

  const handleCloseActivationModal = () => {
    setIsActivationModalOpen(false)
    setSelectedWallet(null)
  }

  const handleWalletClick = (wallet: any) => {
    if (wallet.is_enabled) {
      setSelectedWallet(wallet)
      setIsTransactionsModalOpen(true)
    }
  }

  const handleCloseTransactionsModal = () => {
    setIsTransactionsModalOpen(false)
    setSelectedWallet(null)
  }

  if (isLoading) {
    return (
      <LayoutContent
        title="Общая информация по кошелькам"
        breadcrumbs={[
          { 
            label: 'Общая информация по финансам',
            path: RouterPaths.financialOverview, 
            name: 'analytic'
          },
          { 
            label: 'Общая информация по кошелькам', 
            name: 'wallets'
          }
        ]}
      >
        <Board>
          <Fade in timeout={300}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
              <CircularProgress size={60} thickness={4} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Загружаем кошельки...
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
        title="Общая информация по кошелькам"
        breadcrumbs={[
          { 
            label: 'Общая информация по финансам',
            path: RouterPaths.financialOverview, 
            name: 'analytic'
          },
          { label: 'Общая информация по кошелькам', name: 'wallets' }
        ]}
      >
        <Board>
          <Fade in timeout={400}>
            <Alert severity="error" sx={{ mb: 2 }}>
              Ошибка при загрузке кошельков. Попробуйте обновить страницу.
            </Alert>
          </Fade>
        </Board>
      </LayoutContent>
    )
  }

  return (
    <LayoutContent
      title="Общая информация по кошелькам"
      breadcrumbs={[
        { 
            label: 'Общая информация по финансам',
            path: RouterPaths.financialOverview, 
            name: 'analytic'
          },
        { label: 'Общая информация по кошелькам', name: 'wallets' }
      ]}
    >
        <Box>
          <Fade in timeout={600}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3, fontSize: '14px' }}>
              Краткие сведения
            </Typography>
          </Fade>

          <Grid container spacing={2}>

            <Grid item xs={12} sm={6} md={4} xl={3}>
              <Grow in timeout={500}>
                <Card
                  sx={{
                    height: { xs: 140, sm: 120, md: 140 },
                    bgcolor: customColors.incomeStrong,
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
                          bgcolor: '#0E9F6E'
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
                        variant="h5"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '20px',
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

            {wallets.map((wallet, index) => (
              <Grid item xs={12} sm={6} md={4} xl={3} key={wallet.wallet_id}>
                <Grow in timeout={600 + (index * 100)}>
                  <Card
                    onClick={() => handleWalletClick(wallet)}
                    sx={{
                      height: { xs: 140, sm: 120, md: 140 },
                      cursor: 'pointer',
                      opacity: wallet.is_enabled ? 1 : 0.6,
                      border: wallet.is_enabled ? '1px solid #e0e0e0' : '1px solid #f0f0f0',
                      bgcolor: 'white',
                      position: 'relative',
                      boxShadow: wallet.is_enabled ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transitionDelay: '0ms',
                      '&:hover': {
                        transform: wallet.is_enabled ? 'translateY(-6px)' : 'none',
                        boxShadow: wallet.is_enabled ? '0 12px 30px rgba(0,0,0,0.15)' : 'none',
                        transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        transitionDelay: '60ms'
                      }
                    }}
                  >

                    <CardContent
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        p: 2,
                        position: 'relative'
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px' }}>
                            Операций
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px' }}>
                            На балансе
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <img
                              src="/icons/star.svg"
                              alt="star"
                              style={{
                                width: 12,
                                height: 12,
                                marginRight: 4
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: 'bold',
                                fontSize: '11px'
                              }}
                            >
                              {wallet.transaction_share_percent}%
                            </Typography>
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 'bold',
                              fontSize: '11px'
                            }}
                          >
                            {wallet.total_amount} c.
                          </Typography>
                        </Box>
                      </Box>

                      {/* Activation icon for disabled wallets - positioned above lock overlay */}
                      {!wallet.is_enabled && (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation()
                            handleActivateWallet(wallet)
                          }}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'primary.main',
                            color: 'white',
                            width: 28,
                            height: 28,
                            zIndex: 10, // Above the lock overlay
                            '&:hover': {
                              bgcolor: 'primary.dark',
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <img
                            src="/icons/add-fill.svg"
                            alt="activate"
                            style={{
                              width: 16,
                              height: 16,
                              filter: 'invert(1)',
                            }}
                          />
                        </IconButton>
                      )}

                      {!wallet.is_enabled && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bgcolor: 'rgba(255, 255, 255, 0.85)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            borderRadius: 1,
                            zIndex: 5, // Below the activation button
                          }}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mb: 1.5
                            }}
                          >
                            <img
                              src="/icons/lock.svg"
                              alt="locked"
                              style={{
                                width: 20,
                                height: 20,
                                filter: 'opacity(0.8)'
                              }}
                            />
                          </Box>

                          <Typography
                            variant="caption"
                            color="text.primary"
                            sx={{
                              fontSize: '12px',
                              fontWeight: 'medium',
                              mb: 0.5
                            }}
                          >
                            Кошелек заблокирован
                          </Typography>

                          <Typography
                            variant="caption"
                            color="primary.main"
                            sx={{
                              fontSize: '10px',
                              fontWeight: 'medium'
                            }}
                          >
                            Используйте "Добавить кошелек"
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
            <Grid item xs={12} sm={6} md={4} xl={3}>
              <Grow in timeout={400}>
                <Card
                  onClick={() => setIsAddModalOpen(true)}
                  sx={{
                    height: { xs: 140, sm: 120, md: 140 },
                    cursor: 'pointer',
                    border: '2px dashed #e0e0e0',
                    bgcolor: 'transparent',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transitionDelay: '0ms',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'rgba(25, 118, 210, 0.04)',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)',
                      transition: 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      transitionDelay: '50ms'
                    }
                  }}
                >
                  <CardContent
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}
                  >
                    <IconButton
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        mb: 1,
                        '&:hover': {
                          bgcolor: 'primary.dark',
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      <Add />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                      Добавить кошелек
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          </Grid>
        </Box>

      <AddWalletModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <ActivationModal
        open={isActivationModalOpen}
        onClose={handleCloseActivationModal}
        wallet={selectedWallet}
      />

      <WalletTransactionsModal
        open={isTransactionsModalOpen}
        onClose={handleCloseTransactionsModal}
        wallet={selectedWallet}
      />
    </LayoutContent>
  )
}
