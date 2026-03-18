import { ReactNode } from 'react'
import { Box } from '@mui/material'

interface Props {
  userSlot?: ReactNode
}

export const UserPanel = ({ userSlot }: Props) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{userSlot}</Box>
  )
}
