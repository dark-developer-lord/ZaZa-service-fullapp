import { Box, Tooltip } from '@mui/material'
import AirAIIcon from '@icons/AirAI.svg?react'
import { useAIAdvisorStore } from '../model/store'

interface AIAdvisorButtonProps {
  page: 'customers' | 'financial-overview'
}

export const AIAdvisorButton = ({ page }: AIAdvisorButtonProps) => {
  const openAdvisor = useAIAdvisorStore((state) => state.openAdvisor)

  return (
    <Tooltip title="AirAI Помощник" placement="left">
      <Box
        onClick={() => openAdvisor(page)}
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          width: { xs: 60, sm: 72 },
          height: { xs: 60, sm: 72 },
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0, 84, 86, 0.4)',
          borderRadius: '50%',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 6px 24px rgba(0, 84, 86, 0.5)',
          },
          transition: 'all 0.3s ease-in-out',
          zIndex: 1000,
        }}
      >
        <AirAIIcon
          width="100%"
          height="100%"
        />
      </Box>
    </Tooltip>
  )
}

