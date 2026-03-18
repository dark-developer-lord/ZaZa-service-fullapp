import { useState, useRef } from 'react'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Avatar,
  Divider,
  CircularProgress,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material'
import StoreIcon from '@mui/icons-material/Store'
import EditIcon from '@mui/icons-material/Edit'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'

import { api } from '@shared/api'
import { getLSLoginSource } from '@shared/auth'
import { usePageTitle } from '@shared/lib'

interface StoreProfile {
  name: string
  address: string
  phone: string
  f_name?: string
  email?: string
}

interface PasswordForm {
  current_password: string
  password: string
  password_confirmation: string
}

const PROFILE_PATH_MAP: Record<string, string> = {
  vendor: '/v3/vendor/auth/getVendor',
  'vendor-employee': '/v3/vendor/employee/auth/getEmployee',
  saas: '/v3/saas/tenant-profile',
  admin: '/v3/admin/auth/getAdmin',           // was: getUser (404)
  'delivery-man': '/v1/delivery-man/profile', // v1 flat endpoint
}

const UPDATE_PATH_MAP: Record<string, string> = {
  vendor: '/v3/vendor/auth/update-profile',
  'vendor-employee': '/v3/vendor/employee/auth/update-profile',
  saas: '/v3/saas/tenant-profile',
  admin: '/v3/admin/auth/update-profile',     // alias added in admin.php
  'delivery-man': '/v1/delivery-man/update-profile',
}

const CHANGE_PASSWORD_PATH_MAP: Partial<Record<string, string>> = {
  vendor: '/v3/vendor/auth/change-password',
  'vendor-employee': '/v3/vendor/employee/auth/change-password',
  admin: '/v3/admin/auth/change-password',
  // delivery-man and saas: no change-password endpoint
}

/** Whether the update request should use PUT (v1 delivery-man) */
const UPDATE_METHOD_MAP: Record<string, 'post' | 'put'> = {
  vendor: 'post',
  'vendor-employee': 'post',
  saas: 'post',
  admin: 'post',
  'delivery-man': 'put',
}

/** Field name for logo/avatar depending on panel */
const LOGO_FIELD_MAP: Record<string, string> = {
  vendor: 'logo',
  'vendor-employee': 'image',
  admin: 'image',
  'delivery-man': 'image',
  saas: 'logo',
}

/** Whether this panel has a "store info" section */
const HAS_STORE_INFO: Partial<Record<string, boolean>> = {
  vendor: true,
}

export const Page = () => {
  const loginSource = getLSLoginSource() ?? 'vendor'
  const queryClient = useQueryClient()
  usePageTitle('Настройки профиля')

  const [form, setForm] = useState<StoreProfile>({ name: '', address: '', phone: '', f_name: '', email: '' })
  const [pwForm, setPwForm] = useState<PasswordForm>({
    current_password: '',
    password: '',
    password_confirmation: '',
  })
  const [profileErrors, setProfileErrors] = useState<Partial<Record<keyof StoreProfile, string>>>({})
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ---------- Load profile ----------
  const { isLoading } = useQuery(
    ['profile-settings'],
    () => api.get(PROFILE_PATH_MAP[loginSource] ?? PROFILE_PATH_MAP.vendor),
    {
      retry: false,
      onSuccess: (res) => {
        const d = res.data?.data ?? res.data
        // delivery-man profile is a flat object; vendor profile nests store data
        setForm({
          name: d?.store?.name ?? d?.restaurant?.name ?? d?.name ?? '',
          address: d?.store?.address ?? d?.restaurant?.address ?? d?.address ?? '',
          phone: d?.phone ?? '',
          f_name: d?.f_name ?? '',
          email: d?.email ?? '',
        })
        const logo =
          d?.store?.logo ?? d?.restaurant?.logo ?? d?.logo ?? d?.image ?? null
        if (logo) setLogoPreview(logo)
      },
    },
  )

  // ---------- Save profile ----------
  const { mutate: save, isLoading: isSaving } = useMutation(
    () => {
      const method = UPDATE_METHOD_MAP[loginSource] ?? 'post'
      const path = UPDATE_PATH_MAP[loginSource] ?? UPDATE_PATH_MAP.vendor
      const logoField = LOGO_FIELD_MAP[loginSource] ?? 'logo'
      const fd = new FormData()
      if (form.name) fd.append('name', form.name)
      if (form.address) fd.append('address', form.address)
      if (form.phone) fd.append('phone', form.phone)
      if (form.f_name) fd.append('f_name', form.f_name)
      if (form.email) fd.append('email', form.email)
      if (logoFile) fd.append(logoField, logoFile)
      return api[method](path, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    },
    {
      onSuccess: (res) => {
        toast.success('Профиль сохранён')
        setLogoFile(null)
        queryClient.invalidateQueries(['profile-settings'])
        const d = res.data?.data
        const logo = d?.store?.logo ?? d?.logo ?? d?.image
        if (logo) setLogoPreview(logo)
      },
      onError: () => { toast.error('Не удалось сохранить') },
    },
  )

  const changePasswordPath = CHANGE_PASSWORD_PATH_MAP[loginSource]

  // ---------- Change password ----------
  const { mutate: changePassword, isLoading: isChangingPw } = useMutation(
    (payload: PasswordForm) => api.post(changePasswordPath!, payload),
    {
      onSuccess: () => {
        toast.success('Пароль изменён')
        setPwForm({ current_password: '', password: '', password_confirmation: '' })
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message ?? 'Не удалось изменить пароль'
        toast.error(msg)
      },
    },
  )

  const validateProfile = (): boolean => {
    const errs: Partial<Record<keyof StoreProfile, string>> = {}
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Введите корректный email'
    }
    if (!form.phone || form.phone.replace(/\D/g, '').length < 9) {
      errs.phone = 'Номер телефона слишком короткий'
    }
    if (HAS_STORE_INFO[loginSource] && !form.name.trim()) {
      errs.name = 'Название магазина обязательно'
    }
    setProfileErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setLogoPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Настройки профиля
      </Typography>

      {/* -------- Main profile card -------- */}
      <Card
        variant="outlined"
        sx={{ borderRadius: 3, mb: 2 }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Logo */}
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <Avatar
                src={logoPreview ?? undefined}
                sx={{ width: 80, height: 80, bgcolor: 'primary.main', cursor: 'pointer' }}
                onClick={() => fileInputRef.current?.click()}
              >
                <StoreIcon fontSize="large" />
              </Avatar>
              <Tooltip title="Изменить логотип">
                <IconButton
                  size="small"
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'white',
                    boxShadow: 1,
                    width: 26,
                    height: 26,
                    '&:hover': { bgcolor: 'grey.100' },
                  }}
                >
                  <EditIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleLogoChange}
              />
            </Box>
            <Box>
              <Typography fontWeight={600}>{form.name || 'Название магазина'}</Typography>
              {logoFile && (
                <Typography variant="caption" color="success.main">
                  Новый логотип выбран — сохраните, чтобы применить
                </Typography>
              )}
              {!logoFile && (
                <Typography variant="caption" color="text.secondary">
                  Нажмите на аватар, чтобы изменить логотип
                </Typography>
              )}
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="subtitle2" color="text.secondary" mb={1.5}>
            Данные аккаунта
          </Typography>
          <Stack spacing={2.5} mb={3}>
            {form.f_name !== undefined && (
              <TextField
                label="Имя контактного лица"
                value={form.f_name}
                onChange={(e) => setForm((p) => ({ ...p, f_name: e.target.value }))}
                fullWidth
                size="small"
              />
            )}
            <TextField
              label="Email"
              type="email"
              value={form.email ?? ''}
              onChange={(e) => {
                setForm((p) => ({ ...p, email: e.target.value }))
                if (profileErrors.email) setProfileErrors((p) => ({ ...p, email: undefined }))
              }}
              fullWidth
              size="small"
              error={!!profileErrors.email}
              helperText={profileErrors.email}
            />
            <TextField
              label="Телефон"
              value={form.phone}
              onChange={(e) => {
                setForm((p) => ({ ...p, phone: e.target.value }))
                if (profileErrors.phone) setProfileErrors((p) => ({ ...p, phone: undefined }))
              }}
              fullWidth
              size="small"
              error={!!profileErrors.phone}
              helperText={profileErrors.phone}
            />
          </Stack>

          {HAS_STORE_INFO[loginSource] && (
            <>
              <Divider sx={{ mb: 2 }} />

              <Typography variant="subtitle2" color="text.secondary" mb={1.5}>
                Информация о магазине
              </Typography>
              <Stack spacing={2.5}>
                <TextField
                  label="Название магазина"
                  value={form.name}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, name: e.target.value }))
                    if (profileErrors.name) setProfileErrors((p) => ({ ...p, name: undefined }))
                  }}
                  fullWidth
                  size="small"
                  error={!!profileErrors.name}
                  helperText={profileErrors.name}
                />
                <TextField
                  label="Адрес"
                  value={form.address}
                  onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                />
              </Stack>
            </>
          )}

          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button
              variant="contained"
              onClick={() => { if (validateProfile()) save() }}
              disabled={isSaving}
              startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : undefined}
            >
              {isSaving ? 'Сохраняем...' : 'Сохранить изменения'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* -------- Change password card -------- */}
      {changePasswordPath && <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} mb={2}>
            Смена пароля
          </Typography>
          <Stack spacing={2.5}>
            <TextField
              label="Текущий пароль"
              type="password"
              value={pwForm.current_password}
              onChange={(e) => setPwForm((p) => ({ ...p, current_password: e.target.value }))}
              fullWidth
              size="small"
              autoComplete="current-password"
            />
            <TextField
              label="Новый пароль"
              type="password"
              value={pwForm.password}
              onChange={(e) => setPwForm((p) => ({ ...p, password: e.target.value }))}
              fullWidth
              size="small"
              autoComplete="new-password"
            />
            <TextField
              label="Подтвердите новый пароль"
              type="password"
              value={pwForm.password_confirmation}
              onChange={(e) =>
                setPwForm((p) => ({ ...p, password_confirmation: e.target.value }))
              }
              fullWidth
              size="small"
              autoComplete="new-password"
              error={
                Boolean(pwForm.password) &&
                Boolean(pwForm.password_confirmation) &&
                pwForm.password !== pwForm.password_confirmation
              }
              helperText={
                Boolean(pwForm.password) &&
                Boolean(pwForm.password_confirmation) &&
                pwForm.password !== pwForm.password_confirmation
                  ? 'Пароли не совпадают'
                  : ''
              }
            />
          </Stack>
          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button
              variant="outlined"
              onClick={() => changePassword(pwForm)}
              disabled={
                isChangingPw ||
                !pwForm.current_password ||
                !pwForm.password ||
                pwForm.password !== pwForm.password_confirmation
              }
              startIcon={
                isChangingPw ? <CircularProgress size={16} color="inherit" /> : undefined
              }
            >
              {isChangingPw ? 'Сохраняем...' : 'Сменить пароль'}
            </Button>
          </Box>
        </CardContent>
      </Card>}
    </Box>
  )
}
