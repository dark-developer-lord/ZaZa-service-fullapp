import { ReactNode } from 'react'
import { Box, Typography, Button, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { useGetPermissions } from './get-permissions'
import { getLSLoginSource } from '../storage-token'
import { PermissionModules } from './modules'

interface PermissionGuardProps {
  children: ReactNode
  requiredPermission?: PermissionModules
  fallback?: ReactNode
}

export const PermissionGuard = ({ 
  children, 
  requiredPermission, 
  fallback 
}: PermissionGuardProps) => {
  const { data: permissions } = useGetPermissions()
  const navigate = useNavigate()
  const loginSource = getLSLoginSource()

  // If no permission required, allow access
  if (!requiredPermission) {
    return <>{children}</>
  }

  // If permissions not loaded yet, show loading
  if (!permissions) {
    return <Box p={3}>Загрузка...</Box>
  }

  // For vendor-employee, check if they have the required module
  if (loginSource === 'vendor-employee') {
    const hasPermission = Array.isArray(permissions) && 
      permissions.includes(requiredPermission)

    if (!hasPermission) {
      return fallback || (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="60vh"
          p={3}
        >
          <Stack spacing={3} alignItems="center" maxWidth={400} textAlign="center">
            <Typography variant="h5" color="text.secondary">
              Доступ ограничен
            </Typography>
            
            <Typography variant="body1" color="text.secondary">
              У вас нет разрешения для доступа к этой странице. 
              Обратитесь к работодателю для получения необходимых разрешений.
            </Typography>
            
            <Button 
              variant="contained" 
              onClick={() => navigate(-1)}
              sx={{ mt: 2 }}
            >
              Назад
            </Button>
          </Stack>
        </Box>
      )
    }
  }

  // For other login sources (vendor, admin), allow access if they have permission
  if (typeof permissions === 'string' || 
      (Array.isArray(permissions) && permissions.includes(requiredPermission))) {
    return <>{children}</>
  }

  // Default fallback for no permission
  return fallback || (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      minHeight="60vh"
      p={3}
    >
      <Typography variant="h5" color="text.secondary">
        Доступ запрещен
      </Typography>
      <Typography variant="body1" color="text.secondary" mt={2}>
        У вас нет разрешения для доступа к этой странице.
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => navigate(-1)}
        sx={{ mt: 2 }}
      >
        Назад
      </Button>
    </Box>
  )
}
