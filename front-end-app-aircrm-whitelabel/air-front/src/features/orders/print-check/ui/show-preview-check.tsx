import { IconButton, Tooltip, useTheme } from '@mui/material'

import PrintIcon from '@icons/document.svg?react'

export const ShowPreviewCheck = () => {
  const { palette } = useTheme()
  return (
    <Tooltip
      title="Печатать чек"
      placement="top"
    >
      <IconButton
        size="small"
        sx={{
          bgcolor: 'secondary.main',
          '&:hover > svg': {
            stroke: palette.success.main,
          },
        }}
      >
        <PrintIcon stroke={palette.success.main} />
      </IconButton>
    </Tooltip>
  )
}
