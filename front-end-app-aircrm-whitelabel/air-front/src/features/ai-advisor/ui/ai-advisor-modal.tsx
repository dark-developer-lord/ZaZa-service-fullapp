import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Paper,
  CircularProgress,
  Chip,
  Stack,
  Divider,
  Button,
} from '@mui/material'
import CloseIcon from '@icons/close.svg?react'
import AirAIIcon from '@icons/AirAI.svg?react'
import DownloadIcon from '@icons/download.svg?react'
import { useAIAdvisorStore } from '../model/store'
import { useGetAIInsights } from '../api/get-ai-insights'
import dayjs from 'dayjs'

// Download handler for signed URLs
const handleDownload = async (url: string, filename: string) => {
  try {
    const token = localStorage.getItem('accessToken')

    console.log('📥 Downloading file:', filename)
    console.log('📥 Download URL:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    })

    console.log('📥 Response status:', response.status)

    if (!response.ok) {
      throw new Error(`Download failed with status: ${response.status}`)
    }

    const blob = await response.blob()
    console.log('📥 Blob size:', blob.size, 'bytes')
    console.log('📥 Blob type:', blob.type)

    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = downloadUrl
    link.download = filename

    document.body.appendChild(link)
    link.click()

    // Cleanup after a short delay
    setTimeout(() => {
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
      console.log('📥 Download complete:', filename)
    }, 100)
  } catch (error) {
    console.error('❌ Download error:', error)
    alert('Ошибка при скачивании файла')
  }
}

export const AIAdvisorModal = () => {
  const navigate = useNavigate()
  const { isOpen, closeAdvisor, messages, isLoading, setLoading, addMessage, currentPage, setActiveActionUrl } = useAIAdvisorStore()
  const { mutate: getInsights } = useGetAIInsights()

  // Auto-fetch insights when modal opens
  useEffect(() => {
    if (isOpen && currentPage && messages.length === 1) {
      setLoading(true)

      // Send page type to backend - backend will fetch all necessary data
      getInsights(
        { page: currentPage } as any,
        {
          onSuccess: (data: any) => {
            addMessage({
              role: 'assistant',
              content: data.insights,
              excelExport: data.excel_export ? {
                file_name: data.excel_export.file_name,
                download_url: data.excel_export.download_url,
                total_customers: data.excel_export.total_customers,
                min_absence_days: data.excel_export.min_absence_days,
              } : undefined,
              actionLinks: data.action_links || [],
            })

            if (data.warnings && data.warnings.length > 0) {
              addMessage({
                role: 'assistant',
                content: `⚠️ **Предупреждения:**\n${data.warnings.map((w: string) => `• ${w}`).join('\n')}`,
              })
            }

            if (data.recommendations && data.recommendations.length > 0) {
              addMessage({
                role: 'assistant',
                content: `💡 **Рекомендации:**\n${data.recommendations.map((r: string) => `• ${r}`).join('\n')}`,
              })
            }

            setLoading(false)
          },
          onError: () => {
            addMessage({
              role: 'assistant',
              content: 'Извините, произошла ошибка при анализе данных. Пожалуйста, попробуйте позже.',
            })
            setLoading(false)
          }
        }
      )
    }
  }, [isOpen, currentPage])

  return (
    <Dialog
      open={isOpen}
      onClose={closeAdvisor}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          position: 'fixed',
          bottom: { xs: 80, sm: 100 },
          right: { xs: 16, sm: 24 },
          top: 'auto',
          left: 'auto',
          m: 0,
          borderRadius: 3,
          minHeight: { xs: '70vh', sm: '500px' },
          maxHeight: { xs: '70vh', sm: '600px' },
          width: { xs: 'calc(100vw - 32px)', sm: '400px' },
          maxWidth: { xs: 'calc(100vw - 32px)', sm: '400px' },
        },
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'transparent',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <AirAIIcon
          width={40}
          height={40}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            AirAI Помощник
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {currentPage === 'customers' ? 'Анализ клиентов' : 'Финансовый анализ'}
          </Typography>
        </Box>
        <IconButton onClick={closeAdvisor} size="small">
          <CloseIcon width={24} height={24} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                gap: 1.5,
                alignItems: 'flex-start',
              }}
            >
              {message.role === 'assistant' && (
                <AirAIIcon
                  width={32}
                  height={32}
                  style={{ flexShrink: 0 }}
                />
              )}
              
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: message.role === 'assistant' ? '#F5F7FA' : 'primary.light',
                  borderRadius: 2,
                  flex: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.6,
                    '& strong': {
                      fontWeight: 600,
                      display: 'block',
                      mb: 0.5,
                    }
                  }}
                >
                  {message.content}
                </Typography>

                {/* Action Links */}
                {message.actionLinks && message.actionLinks.length > 0 && (
                  <Stack gap={1} mt={2}>
                    {message.actionLinks.map((link, idx) => (
                      <Button
                        key={idx}
                        variant="contained"
                        fullWidth
                        onClick={() => {
                          setActiveActionUrl(link.url)
                          navigate(`/customers?filter=call_results&type=call_results`)
                          closeAdvisor()
                        }}
                        sx={{
                          backgroundColor: '#10B981',
                          '&:hover': {
                            backgroundColor: '#059669',
                          },
                          textTransform: 'none',
                          borderRadius: 1,
                          justifyContent: 'flex-start',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          py: 1.5,
                        }}
                      >
                        <Typography variant="body2" fontWeight={600}>
                          {link.title}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                          {link.description} {link.count && `(${link.count})`}
                        </Typography>
                      </Button>
                    ))}
                  </Stack>
                )}

                {/* Excel Export Download Button (Legacy) */}
                {message.excelExport && (
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon width={18} height={18} />}
                    onClick={() => handleDownload(message.excelExport!.download_url, 'Неактивные клиенты.xlsx')}
                    sx={{
                      mt: 2,
                      backgroundColor: '#10B981',
                      '&:hover': {
                        backgroundColor: '#059669',
                      },
                      textTransform: 'none',
                      borderRadius: 1,
                    }}
                  >
                    Скачать Excel ({message.excelExport.total_customers || 0} клиентов)
                  </Button>
                )}

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 1 }}
                >
                  {dayjs(message.timestamp).format('HH:mm')}
                </Typography>
              </Paper>
            </Box>
          ))}

          {isLoading && (
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <AirAIIcon
                width={32}
                height={32}
                style={{ flexShrink: 0 }}
              />
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: '#F5F7FA',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <CircularProgress size={16} />
                <Typography variant="body2" color="text.secondary">
                  Анализирую данные...
                </Typography>
              </Paper>
            </Box>
          )}
        </Box>

        <Divider />

        {/* Info Footer */}
        <Stack direction="row" spacing={1} justifyContent="center">
          <Chip
            label="Анализ неактивных клиентов"
            size="small"
            variant="outlined"
            sx={{ fontSize: '11px' }}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

