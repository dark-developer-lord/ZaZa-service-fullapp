import { useEffect, useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { Control, Controller, useController } from 'react-hook-form'
import { Grid, IconButton, TextField, Typography, InputAdornment, styled, Button, Box } from '@mui/material'
import { Html5QrcodeScanner } from 'html5-qrcode'
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner'
import AddIcon from '@icons/add-fill.svg?react'

import { Board } from '@shared/ui'
import { CreateDto } from '../model/dto'
import { isMobile } from '../lib/media'
import { AddProductsModal } from '@features/products/add-products'

interface Props {
  control: Control<CreateDto>
  warehouseId?: number
}

export const Price = ({ control }: Props) => {
  const location = useLocation()
  const params = useParams()
  const isCreatePage = location.pathname.includes('create')
  const isEdit = location.pathname.includes('edit')

  const scannerRef = useRef<HTMLDivElement | null>(null)
  const [scannerActive, setScannerActive] = useState(false)
  const [scannerInstance, setScannerInstance] = useState<Html5QrcodeScanner | null>(null)
  const [addProductsModalOpen, setAddProductsModalOpen] = useState(false)

  const {
    field: productCodeField,
    fieldState: productCodeState
  } = useController({ name: 'product_code', control })

  const config = {
    fps: 10,
    qrbox: { width: 280, height: 180 },
    aspectRatio: 1.0,
    disableFlip: false,
    verbose: false, // Отключить логи
    // Локализация текстов
    qrCodeSuccessCallback: undefined,
    qrCodeErrorCallback: undefined,
    supportedScanTypes: undefined,
    // Кастомные тексты для русификации
    experimentalFeatures: {
      useBarCodeDetectorIfSupported: true
    }
  }

  useEffect(() => {
    if (!scannerRef.current || !scannerActive) {
      // Очистка сканера при деактивации
      if (scannerInstance) {
        scannerInstance.clear().catch(() => {})
        setScannerInstance(null)
      }
      return
    }

    const onScanSuccess = (decodedText: string) => {
      productCodeField.onChange(decodedText)

      // Показать уведомление об успешном сканировании
      if (scannerRef.current) {
        const statusElement = scannerRef.current.querySelector('#html5-qrcode-reader__status_span') as HTMLElement
        if (statusElement) {
          statusElement.textContent = `Успешно отсканировано: ${decodedText}`
          statusElement.style.backgroundColor = '#4caf50'
          statusElement.style.color = 'white'
        }
      }

      if (scannerInstance) {
        scannerInstance.clear().catch(() => {})
        setScannerInstance(null)
      }
      setScannerActive(false)
    }

    const onScanFailure = (errorMessage: string) => {
      // Показать только критические ошибки
      if (errorMessage.includes('NotFoundError') || errorMessage.includes('PermissionDeniedError')) {
        console.warn("Ошибка сканера:", errorMessage)
      }
    }

    // Функция для русификации элементов
    const translateElements = () => {
      if (!scannerRef.current) return

      // Изменить текст кнопок
      const startButton = scannerRef.current.querySelector('#html5-qrcode-button-camera-start') as HTMLElement
      if (startButton && startButton.textContent?.includes('Start')) {
        startButton.textContent = 'Начать сканирование'
      }

      const stopButton = scannerRef.current.querySelector('#html5-qrcode-button-camera-stop') as HTMLElement
      if (stopButton && stopButton.textContent?.includes('Stop')) {
        stopButton.textContent = 'Остановить сканирование'
      }

      // Изменить текст статуса
      const statusElement = scannerRef.current.querySelector('#html5-qrcode-reader__status_span') as HTMLElement
      if (statusElement && statusElement.textContent) {
        const currentText = statusElement.textContent
        if (currentText.includes('Scanning') || currentText.includes('scanning')) {
          statusElement.textContent = 'Сканирование...'
        } else if (currentText.includes('No barcode found') || currentText.includes('not found')) {
          statusElement.textContent = 'Штрих-код не найден'
        } else if (currentText.includes('Unable to access camera') || currentText.includes('camera access')) {
          statusElement.textContent = 'Не удаётся получить доступ к камере'
        } else if (currentText.includes('permission denied') || currentText.includes('Permission denied')) {
          statusElement.textContent = 'Доступ к камере запрещён'
        } else if (currentText.includes('Camera starting') || currentText.includes('Starting')) {
          statusElement.textContent = 'Запуск камеры...'
        } else if (currentText.includes('Camera stopped') || currentText.includes('Stopped')) {
          statusElement.textContent = 'Камера остановлена'
        }
      }

      // Изменить label для выбора камеры
      const cameraSelection = scannerRef.current.querySelector('#html5-qrcode-reader__camera_selection')
      if (cameraSelection) {
        const labels = cameraSelection.querySelectorAll('label')
        labels.forEach(label => {
          if (label.textContent &&
              (label.textContent.includes('Select Camera (2)') || label.textContent.includes('Choose') || label.textContent.includes('Choose'))) {
            label.textContent = 'Выберите камеру:'
          }
        })
      }

      // Изменить тексты в других элементах
      const allSpans = scannerRef.current.querySelectorAll('span')
      allSpans.forEach(span => {
        if (span.textContent) {
          if (span.textContent.includes('Requesting camera permissions')) {
            span.textContent = 'Запрос разрешений камеры...'
          } else if (span.textContent.includes('Camera permission granted')) {
            span.textContent = 'Разрешение на камеру получено'
          } else if (span.textContent.includes('QR code parse error')) {
            span.textContent = 'Ошибка при чтении штрих-кода или QR-кода'
          }
        }
      })
    }

    const scanner = new Html5QrcodeScanner(
      scannerRef.current.id,
      config,
      false
    )

    // Создаем наблюдатель для отслеживания изменений DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          translateElements()
        }
      })
    })

    // Начинаем наблюдение
    if (scannerRef.current) {
      observer.observe(scannerRef.current, {
        childList: true,
        subtree: true,
        characterData: true
      })
    }

    // Русификация с несколькими попытками
    const translateWithRetry = () => {
      translateElements()
      setTimeout(translateElements, 500)
      setTimeout(translateElements, 1000)
      setTimeout(translateElements, 2000)
    }

    scanner.render(onScanSuccess, onScanFailure)
    setScannerInstance(scanner)

    // Запускаем русификацию
    setTimeout(translateWithRetry, 100)

    return () => {
      observer.disconnect()
      scanner.clear().catch(() => {})
    }
  }, [productCodeField, scannerActive])

  const handleToggleScanner = () => {
    setScannerActive(prev => !prev)
  }

  return (
    <Board>
      <Typography variant="h6" mb="24px">
        Сумма
      </Typography>
      <Grid container spacing="24px">
        {isCreatePage && (
          <Grid item xs={12} mobile={3}>
            <Controller
              name="purchase_price"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Цена закупки"
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  fullWidth
                  onChange={(e) => {
                    const value = e.target.value.replace(',', '.');
                    field.onChange(value);
                  }}
                />
              )}
            />
          </Grid>
        )}
        <Grid item xs={12} mobile={isCreatePage ? 3 : 4}>
          <Controller
            name="price"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Цена продажи"
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
                fullWidth
                onChange={(e) => {
                  const value = e.target.value.replace(',', '.');
                  field.onChange(value);
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} mobile={isCreatePage ? 3 : 4}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <Controller
              name="quantity"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Количество"
                  disabled={isEdit}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
            {isEdit && (
              <Button
                variant="contained"
                onClick={() => setAddProductsModalOpen(true)}
                sx={{
                  minWidth: 'auto',
                  width: 'auto',
                  height: 'auto',
                  borderRadius: 1,
                  bgcolor: 'primary.main',
                  flexShrink: 0,
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '& svg': {
                    fill: 'white',
                  },
                }}
              >
                <AddIcon width={24} height={24} />
              </Button>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} mobile={isCreatePage ? 3 : 4}>
          <TextField
            {...productCodeField}
            label="Штрихкод"
            error={Boolean(productCodeState.error)}
            helperText={productCodeState.error?.message}
            fullWidth
            InputProps={{
              endAdornment: (
                isMobile.any() ? (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={handleToggleScanner}
                      aria-label="Сканировать штрих-код"
                    >
                      <DocumentScannerIcon />
                    </IconButton>
                  </InputAdornment>
                ) : undefined
              ),
            }}
          />
          {scannerActive && (
            <ScannerContainer>
              <div
                id="reader"
                ref={scannerRef}
              />
            </ScannerContainer>
          )}
        </Grid>
      </Grid>

      {/* Add Products Modal */}
      {isEdit && params.id && (
        <AddProductsModal
          open={addProductsModalOpen}
          onClose={() => setAddProductsModalOpen(false)}
          productId={params.id}
        />
      )}
    </Board>
  )
}

// Стилизованный контейнер для сканера
const ScannerContainer = styled('div')(({ theme }) => ({
  width: '100%',
  border: `2px solid ${theme.palette.primary.main}`,
  borderRadius: '12px',
  marginTop: '10px',
  overflow: 'hidden',

  '& #html5-qrcode-button-camera-start': {
    width: '95%',
    backgroundColor: `${theme.palette.success.main} !important`,
    color: 'white !important',
    border: 'none !important',
    borderRadius: '8px !important',
    padding: '12px 24px !important',
    fontSize: '12px !important',
    fontWeight: '500 !important',
    cursor: 'pointer !important',
    marginTop: '10px'
  },

  '& #html5-qrcode-button-camera-stop': {
    width: '95%',
    backgroundColor: `${theme.palette.error.main} !important`,
    color: 'white !important',
    border: 'none !important',
    borderRadius: '8px !important',
    padding: '12px 24px !important',
    fontSize: '12px !important',
    fontWeight: '500 !important',
    cursor: 'pointer !important',
    marginTop: '10px'
  },

  // Стилизация области предварительного просмотра видео
  '& video': {
    borderRadius: '8px !important',
    width: '100% !important',
    height: 'auto !important',
  },

  // Стилизация области сканирования
  '& #qr-shaded-region': {
    backgroundColor: 'rgba(0, 0, 0, 0.5) !important',
  },

  // Стилизация рамки сканирования
  '& #qr-scan-region': {
    border: `3px solid ${theme.palette.success.main} !important`,
    borderRadius: '12px !important',
    backgroundColor: 'transparent !important',
  },

  // Стилизация текста и статуса
  '& #html5-qrcode-reader__scan_region': {
    padding: '16px !important',
    backgroundColor: 'rgba(255, 255, 255, 0.95) !important',
    backdropFilter: 'blur(10px) !important',
    borderRadius: '0 0 8px 8px !important',
  },

  '& #html5-qrcode-reader__status_span': {
    color: `${theme.palette.text.primary} !important`,
    fontSize: '14px !important',
    fontWeight: '400 !important',
    padding: '8px !important',
    backgroundColor: 'rgba(255, 255, 255, 0.9) !important',
    borderRadius: '6px !important',
    margin: '8px 0 !important',
    display: 'block !important',
  },

  // Стилизация контейнера камеры
  '& #html5-qrcode-reader__camera_selection': {
    padding: '16px !important',
    backgroundColor: `${theme.palette.background.paper} !important`,
    borderRadius: '8px !important',
    margin: '8px !important',
  },

  // Стилизация селектора камеры
  '& #html5-qrcode-reader__camera_selection > select': {
    width: '100% !important',
    padding: '8px 12px !important',
    border: `1px solid ${theme.palette.divider} !important`,
    borderRadius: '6px !important',
    backgroundColor: `${theme.palette.background.paper} !important`,
    color: `${theme.palette.text.primary} !important`,
    fontSize: '14px !important',
  },

  // Скрыть лишние элементы
  '& #html5-qrcode-reader__scan_type_change': {
    display: 'none !important',
  },

  // Кастомные анимации
  '& #html5-qrcode-reader': {
    animation: 'fadeIn 0.3s ease-in-out !important',
  },

  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: 'translateY(-10px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  }
}))