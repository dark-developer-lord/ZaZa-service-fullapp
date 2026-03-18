import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { useQueries } from 'react-query'
import { getQuery } from '@shared/api'
import { useProfile } from '@shared/auth'
import { usePageTitle } from '@shared/lib'
import axios from 'axios'
import toast from 'react-hot-toast'

const PIXEL_KEY = 'meta_pixel_id'
const PIXEL_EVENT = 'meta-pixel-changed'

const META_PLATFORMS = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'messenger', label: 'Messenger' },
] as const

interface StatusResponse {
  connected?: boolean
  status?: string
}

export const Page = () => {
  usePageTitle('Meta интеграции')
  const { profile } = useProfile()

  // ── Pixel ID state ────────────────────────────────────────────────────────
  const [pixelId, setPixelId] = useState('')
  const [pixelLoading, setPixelLoading] = useState(false)
  const [pixelSaving, setPixelSaving] = useState(false)

  // Load pixel from backend on mount
  useEffect(() => {
    if (!profile?.id) return
    setPixelLoading(true)
    axios
      .get<{ pixel_id: string | null }>(
        `${import.meta.env.VITE_APP_API_URL}/v3/messengers/pixel?store_id=${profile.id}`,
      )
      .then(({ data }) => {
        const id = data.pixel_id ?? ''
        setPixelId(id)
        // Keep localStorage in sync so useMetaPixel hook picks it up
        if (id) localStorage.setItem(PIXEL_KEY, id)
        else localStorage.removeItem(PIXEL_KEY)
      })
      .catch(() => {
        // fallback to localStorage if backend unavailable
        setPixelId(localStorage.getItem(PIXEL_KEY) ?? '')
      })
      .finally(() => setPixelLoading(false))
  }, [profile?.id])

  const handleSavePixel = async () => {
    if (!profile?.id) return
    setPixelSaving(true)
    try {
      await axios.post(`${import.meta.env.VITE_APP_API_URL}/v3/messengers/pixel`, {
        store_id: profile.id,
        pixel_id: pixelId.trim() || null,
      })
      const trimmed = pixelId.trim()
      if (trimmed) localStorage.setItem(PIXEL_KEY, trimmed)
      else localStorage.removeItem(PIXEL_KEY)
      window.dispatchEvent(new CustomEvent(PIXEL_EVENT))
      toast.success('Meta Pixel ID сохранён')
    } catch {
      toast.error('Ошибка при сохранении Pixel ID')
    } finally {
      setPixelSaving(false)
    }
  }

  const handleDeletePixel = async () => {
    if (!profile?.id) return
    setPixelSaving(true)
    try {
      await axios.post(`${import.meta.env.VITE_APP_API_URL}/v3/messengers/pixel`, {
        store_id: profile.id,
        pixel_id: null,
      })
      setPixelId('')
      localStorage.removeItem(PIXEL_KEY)
      window.dispatchEvent(new CustomEvent(PIXEL_EVENT))
      toast.success('Meta Pixel ID удалён')
    } catch {
      toast.error('Ошибка при удалении Pixel ID')
    } finally {
      setPixelSaving(false)
    }
  }

  // ── Messenger connection status ──────────────────────────────────────────
  const queries = useQueries(
    META_PLATFORMS.map(({ key }) => ({
      queryKey: [`/messengers/checkConnectionStatus?store_id=${profile?.id}&platform=${key}`],
      queryFn: getQuery<StatusResponse>(
        `/messengers/checkConnectionStatus?store_id=${profile?.id}&platform=${key}`,
      ),
      enabled: Boolean(profile?.id),
    })),
  )

  // ── Per-platform OAuth via backend ───────────────────────────────────────
  const handleConnect = async (platform: string) => {
    if (!profile?.id) return
    try {
      const { data } = await axios.get<{ auth_url: string }>(
        `${import.meta.env.VITE_APP_API_URL}/v3/messengers/connect?store_id=${profile.id}&platform=${platform}`,
      )
      if (data.auth_url) {
        window.location.href = data.auth_url
      } else {
        toast.error('Не удалось получить ссылку авторизации')
      }
    } catch {
      toast.error(`Ошибка подключения ${platform}`)
    }
  }

  return (
    <Box sx={{ p: 3, maxWidth: 720 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Meta интеграции
      </Typography>

      {/* ── Messenger channels ───────────────────────────────────────────── */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={1}>
          Meta Business (Instagram / WhatsApp / Messenger)
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Подключите ваш аккаунт Facebook, чтобы отвечать на сообщения клиентов прямо из CRM.
        </Typography>

        <Stack spacing={2}>
          {META_PLATFORMS.map(({ key, label }, i) => {
            const q = queries[i]
            const isConnected = (q?.data as StatusResponse | undefined)?.connected === true
            return (
              <Stack key={key} direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 120 }}>{label}</Typography>
                {q?.isLoading ? (
                  <CircularProgress size={16} />
                ) : (
                  <Chip
                    size="small"
                    icon={isConnected ? <CheckCircleIcon /> : <ErrorOutlineIcon />}
                    label={isConnected ? 'Подключено' : 'Не подключено'}
                    color={isConnected ? 'success' : 'default'}
                    variant="outlined"
                  />
                )}
                {!isConnected && (
                  <Button
                    size="small"
                    variant="contained"
                    disabled={q?.isLoading}
                    onClick={() => handleConnect(key)}
                    sx={{ bgcolor: '#005456', '&:hover': { bgcolor: '#004040' } }}
                  >
                    Подключить
                  </Button>
                )}
              </Stack>
            )
          })}
        </Stack>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* ── Meta Pixel ───────────────────────────────────────────────────── */}
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={1}>
          Meta Pixel
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Вставьте Pixel ID для отслеживания посещений страниц в Facebook Ads Manager.
        </Typography>

        {pixelLoading ? (
          <CircularProgress size={24} />
        ) : (
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Pixel ID"
              size="small"
              value={pixelId}
              onChange={(e) => setPixelId(e.target.value)}
              placeholder="123456789012345"
              sx={{ width: 280 }}
            />
            <Button
              variant="contained"
              disabled={pixelSaving}
              onClick={handleSavePixel}
              sx={{ bgcolor: '#005456', '&:hover': { bgcolor: '#004040' } }}
            >
              {pixelSaving ? 'Сохранение...' : 'Сохранить'}
            </Button>
            {pixelId && (
              <Button
                variant="text"
                color="error"
                disabled={pixelSaving}
                onClick={handleDeletePixel}
              >
                Удалить
              </Button>
            )}
          </Stack>
        )}
      </Paper>
    </Box>
  )
}

