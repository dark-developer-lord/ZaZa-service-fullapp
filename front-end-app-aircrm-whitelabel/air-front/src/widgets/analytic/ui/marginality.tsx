import { Box, Typography } from '@mui/material'
import { MarginalityList } from './marginality-list'
import { Board } from '@shared/ui'

export const Marginality = () => {

  return (
    <Board>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h5"
          component="h2"
        >
          Маржинальность
        </Typography>
      </Box>
      <MarginalityList />
    </Board>
  )
}
