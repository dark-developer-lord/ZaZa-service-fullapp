import { useState } from 'react'
import {
  Box,
  Typography,
  Switch,
  Card,
  CardContent,
  CardActions,
  Grid,
  Button,
  Snackbar,
  Alert,
  Divider,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Board } from '@shared/ui'
import {
  PANEL_CONFIGS,
  getEnabledPanels,
  setEnabledPanels,
  useGetLoginSource,
} from '@shared/auth'

// Filter panel configs to only those visible to the current login source
const useVisiblePanels = () => {
  const loginSource = useGetLoginSource()
  return PANEL_CONFIGS.filter(
    (p) => !p.module || p.module.includes(loginSource as 'vendor' | 'admin' | 'vendor-employee'),
  )
}

export const Page = () => {
  const navigate = useNavigate()
  const visiblePanels = useVisiblePanels()
  const ALL_IDS = visiblePanels.map((p) => p.id)

  const resolveInitial = (): string[] => {
    const stored = getEnabledPanels()
    return stored ?? ALL_IDS
  }

  const [enabled, setEnabled] = useState<string[]>(resolveInitial)
  const [saved, setSaved] = useState(false)

  const toggle = (id: string) => {
    setEnabled((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const handleSave = () => {
    // If all panels are enabled save null so future additions are visible by default
    const payload = enabled.length === ALL_IDS.length ? null : enabled
    setEnabledPanels(payload)
    setSaved(true)
  }

  const handleReset = () => {
    setEnabledPanels(null)
    setEnabled(ALL_IDS)
    setSaved(true)
  }

  return (
    <Box>
      <Board sx={{ mb: '20px' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <Box>
            <Typography variant="h5">Выбор панелей</Typography>
            <Typography color="text.secondary" sx={{ mt: '4px' }}>
              Включите только те разделы, которые нужны вашему магазину.
              Изменения применятся при следующем обновлении страницы.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: '8px' }}>
            <Button size="small" variant="text" onClick={handleReset}>
              Сбросить
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleSave}
              disabled={enabled.length === 0}
            >
              Сохранить
            </Button>
          </Box>
        </Box>
      </Board>

      <Grid container spacing={2}>
        {visiblePanels.map((panel) => {
          const isEnabled = enabled.includes(panel.id)
          return (
            <Grid item xs={12} sm={6} md={4} key={panel.id}>
              <Card
                variant="outlined"
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '16px',
                  borderColor: isEnabled ? 'primary.main' : 'divider',
                  borderWidth: isEnabled ? 2 : 1,
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxShadow: isEnabled ? '0 0 0 2px rgba(25,118,210,0.08)' : 'none',
                }}
              >
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ mb: '4px' }}>
                    {panel.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {panel.description}
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'space-between', px: '16px' }}>
                  <Typography variant="body2" color={isEnabled ? 'primary' : 'text.secondary'}>
                    {isEnabled ? 'Включено' : 'Отключено'}
                  </Typography>
                  <Switch
                    checked={isEnabled}
                    onChange={() => toggle(panel.id)}
                    color="primary"
                  />
                </CardActions>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {enabled.length === 0 && (
        <Board sx={{ mt: '20px' }}>
          <Typography color="warning.main" textAlign="center">
            Выберите хотя бы одну панель, иначе навигация будет пустой
          </Typography>
        </Board>
      )}

      <Box sx={{ mt: '20px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <Button variant="text" onClick={() => navigate(-1)}>
          Назад
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={enabled.length === 0}
        >
          Сохранить и применить
        </Button>
      </Box>

      <Snackbar
        open={saved}
        autoHideDuration={3000}
        onClose={() => setSaved(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSaved(false)} sx={{ width: '100%' }}>
          Настройки сохранены — навигация обновлена
        </Alert>
      </Snackbar>
    </Box>
  )
}
