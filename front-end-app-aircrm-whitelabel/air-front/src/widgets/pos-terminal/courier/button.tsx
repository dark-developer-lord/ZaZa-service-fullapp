import { useState } from 'react'
import { Button as MuiButton, darken } from '@mui/material'

import { Modal } from './modal'

interface Props {
  isCourierExist: boolean
  isFetching: boolean
}

export const Button = ({ isFetching, isCourierExist }: Props) => {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      />
      <MuiButton
        fullWidth
        size="large"
        onClick={() => setOpen(true)}
        disabled={isFetching}
        sx={{
          bgcolor: '#FEECDC',
          color: 'primary.main',
          mt: '20px',
          fontWeight: 600,
          '&:hover': {
            bgcolor: darken('#FEECDC', 0.05),
          },
        }}
      >
        {isCourierExist ? 'Изменить курьера' : 'Назначить курьера'}
      </MuiButton>
    </div>
  )
}
