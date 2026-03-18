import { Box, Typography, Chip, Stack } from '@mui/material'
import { useProfile, getLSLoginSource } from '@shared/auth'

export const ProfileDebug = () => {
  const profile = useProfile((state) => state.profile)
  const loginSource = getLSLoginSource()

  return (
    <Box p={2} border={1} borderColor="grey.300" borderRadius={1} mb={2}>
      <Typography variant="h6" gutterBottom>
        Profile Debug Info
      </Typography>
      
      <Stack spacing={1}>
        <Typography variant="body2">
          <strong>Login Source:</strong> {loginSource}
        </Typography>
        
        <Typography variant="body2">
          <strong>Profile Exists:</strong> {profile ? 'Yes' : 'No'}
        </Typography>
        
        {profile && (
          <>
            <Typography variant="body2">
              <strong>Profile Type:</strong> {typeof profile}
            </Typography>
            
            <Typography variant="body2">
              <strong>Profile Data:</strong>
            </Typography>
            
            <Box component="pre" sx={{ fontSize: '12px', overflow: 'auto' }}>
              {JSON.stringify(profile, null, 2)}
            </Box>
          </>
        )}
      </Stack>
    </Box>
  )
}
