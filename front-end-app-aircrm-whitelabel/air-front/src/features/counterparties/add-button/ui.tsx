import { Button, useMediaQuery, useTheme } from '@mui/material'
import AddIcon from '@icons/add-fill.svg?react'

import { CreateCounterpartyDialog, useCreateCounterpartyStore } from '../create'

export const Ui = () => {
  const openCreate = useCreateCounterpartyStore((state) => state.openCreate)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        size={!isMobile ? 'medium' : 'small'}
        startIcon={
          <AddIcon
            width={20}
            height={20}
            fill="white"
          />
        }
        onClick={openCreate}
        sx={{
          backgroundColor: 'primary.main',
          '&:hover': {
            backgroundColor: '#004547',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 8px rgba(0, 84, 86, 0.3)',
          },
          transition: 'all 0.2s ease-in-out',
          borderRadius: 1,
        }}
      >
        Новый контрагент
      </Button>
      
      <CreateCounterpartyDialog />
    </>
  )
}

