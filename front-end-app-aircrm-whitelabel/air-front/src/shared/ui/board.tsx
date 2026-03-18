import { Paper, PaperProps } from '@mui/material'

export const Board = ({ sx, children, ...props }: PaperProps) => {
  return (
    <Paper
      {...props}
      sx={{ padding: { xs: '10px', mobile: '24px' }, borderRadius: '20px', ...sx }}
      elevation={0}
    >
      {children}
    </Paper>
  )
}
