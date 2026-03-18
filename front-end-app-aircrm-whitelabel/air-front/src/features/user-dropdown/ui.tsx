import { MouseEventHandler, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material'

import { Api, ApiKeys, getQuery } from '@shared/api'
import {
  Profile,
  EmployeeProfile,
  SaasProfile,
  SaasTenant,
  VendorProfile,
  getSaasTenant,
  getSaasTenantId,
  setActiveSaasTenant,
  useLogout,
  useProfile,
  getLSLoginSource,
} from '@shared/auth'
import { RouterPaths } from '@shared/lib'
import ProfileIcon from '@icons/profile.svg?react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

interface SaasTenantsResponse {
  tenants: SaasTenant[]
}

export const Ui = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutate: logout, isLoading } = useLogout()
  const profile = useProfile((state) => state.profile) as Profile | EmployeeProfile | VendorProfile | SaasProfile
  const setProfile = useProfile((state) => state.setProfile)
  const loginSource = getLSLoginSource()
  const isSaas = loginSource === 'saas'

  const { data: tenantsData, isFetching: loadingTenants } = useQuery({
    queryKey: ['saas-tenants'],
    queryFn: getQuery<SaasTenantsResponse>(Api.saasMyTenants),
    enabled: isSaas,
    staleTime: 60_000,
  })

  const currentTenantId = isSaas ? getSaasTenantId() : null
  const currentTenantName = isSaas ? getSaasTenant()?.name : null

  const switchTenant = (tenant: SaasTenant) => {
    const useSession = sessionStorage.getItem('login_source') === 'saas'
    setActiveSaasTenant(tenant, useSession)
    if (profile && loginSource === 'saas') {
      setProfile({ ...(profile as SaasProfile) }, 'saas')
    }
    queryClient.invalidateQueries([ApiKeys.Auth.getPermissions])
    queryClient.invalidateQueries([ApiKeys.Auth.profile])
    queryClient.invalidateQueries([ApiKeys.Common.navOrdersCount])
    queryClient.invalidateQueries(['saas-tenants'])
    setAnchorEl(null)
    navigate(RouterPaths.onboarding)
  }
  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  if (!profile) {
    return null
  }

  // Helper function to get display name
  const getDisplayName = () => {
    if (loginSource === 'vendor') {
      const vendorProfile = profile as VendorProfile
      // Use f_name if available, otherwise fall back to name
      if (vendorProfile.f_name) {
        return `${vendorProfile.f_name}${vendorProfile.l_name ? " " + vendorProfile.l_name : ''}`
      }
      return vendorProfile.name
    }
    if (loginSource === 'saas') {
      return (profile as SaasProfile).name
    }
    const p = profile as Profile | EmployeeProfile
    return `${p.f_name}${p.l_name ? " " + p.l_name : ''}`
  }

  // Helper function to get phone number
  const getPhoneNumber = () => {
    if (loginSource === 'vendor') {
      return (profile as VendorProfile).phone
    }
    if (loginSource === 'saas') {
      return (profile as SaasProfile).phone
    }
    if (loginSource === 'vendor-employee') {
      return (profile as EmployeeProfile).phone
    }
    return null
  }

  // Helper function to get subtitle (role/employee number)
  const getSubtitle = () => {
    if (loginSource === 'vendor-employee') {
      return `Сотрудник #${(profile as EmployeeProfile).employee_number}`
    }
    if (loginSource === 'saas') {
      return 'SaaS клиент'
    }
    return (profile as Profile).role?.name || 'Пользователь'
  }

  const phoneNumber = getPhoneNumber()

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (phoneNumber) {
      navigator.clipboard.writeText(phoneNumber)
    }
  }

  return (
    <div>
      <Tooltip title="Информация о пользователе">
        <IconButton
          onClick={handleClick}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <ProfileIcon
            width={20}
            height={20}
          />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                gridRow: '1/3',
                width: 48,
                height: 48,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <Box
            sx={{
              display: 'grid',
              gap: '0px 12px',
              gridTemplateRows: phoneNumber ? 'auto auto auto' : 'auto auto',
            }}
          >
            <Avatar
              src=""
              alt="profile avatar"
            />
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{
                gridColumn: '2/3',
              }}
            >
              {getDisplayName()}
            </Typography>
            {phoneNumber && (
              <Box
                sx={{
                  gridColumn: '2/3',
                  gridRow: '2/3',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography variant="subtitle2">
                  {phoneNumber}
                </Typography>
                <IconButton
                  size="small"
                  onClick={handleCopyPhone}
                  sx={{ p: 0.5 }}
                >
                  <ContentCopyIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            )}
            <Typography
              variant="subtitle2"
              sx={{
                gridColumn: '2/3',
                gridRow: phoneNumber ? '3/4' : '2/3',
              }}
            >
              {getSubtitle()}
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={async () => {
            await logout()
            handleClose()
          }}
          disabled={isLoading}
        >
          {isLoading && (
            <CircularProgress
              size={20}
              sx={{ mr: 2 }}
            />
          )}
          Выйти
        </MenuItem>
        {isSaas && (
          <>
            <Divider />
            {currentTenantName && (
              <MenuItem disabled>
                Активный tenant: {currentTenantName}
              </MenuItem>
            )}
            {loadingTenants && (
              <MenuItem disabled>
                <CircularProgress
                  size={16}
                  sx={{ mr: 1 }}
                />
                Загрузка тенантов
              </MenuItem>
            )}
            {tenantsData?.tenants?.map((tenant) => (
              <MenuItem
                key={tenant.id}
                selected={tenant.id === currentTenantId}
                disabled={tenant.id === currentTenantId}
                onClick={() => switchTenant(tenant)}
              >
                {tenant.name}
              </MenuItem>
            ))}
          </>
        )}
      </Menu>
    </div>
  )
}
