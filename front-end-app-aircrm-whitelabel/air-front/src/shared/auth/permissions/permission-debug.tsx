import { Box, Typography, Chip, Stack } from '@mui/material'
import { useGetPermissions } from './get-permissions'
import { getLSLoginSource } from '../storage-token'

export const PermissionDebug = () => {
  const { data: permissions, isLoading } = useGetPermissions()
  const loginSource = getLSLoginSource()

  if (isLoading) {
    return <Typography>Loading permissions...</Typography>
  }

  return (
    <Box p={2} border={1} borderColor="grey.300" borderRadius={1}>
      <Typography variant="h6" gutterBottom>
        Permission Debug Info
      </Typography>
      
      <Stack spacing={1}>
        <Typography variant="body2">
          <strong>Login Source:</strong> {loginSource}
        </Typography>
        
        <Typography variant="body2">
          <strong>Permissions Type:</strong> {typeof permissions}
        </Typography>
        
        <Typography variant="body2">
          <strong>Permissions:</strong>
        </Typography>
        
        {Array.isArray(permissions) ? (
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {permissions.map((permission) => (
              <Chip 
                key={permission} 
                label={permission} 
                size="small" 
                color="primary" 
              />
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {String(permissions)}
          </Typography>
        )}
      </Stack>
    </Box>
  )
}
