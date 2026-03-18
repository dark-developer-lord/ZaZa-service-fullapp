import React from 'react'
import { Link } from 'react-router-dom'
import { Stack, Box } from '@mui/material'

import { ArrivalItem } from '@entities/warehouse'

import { RouterPaths } from '@shared/lib'
import { EditButton } from '@shared/ui'

interface Props {
  row: ArrivalItem
}

export const Ui = ({ row }: Props) => {
  const isDisabled = row.is_refunded === true

  return (
    <Stack
      direction="row"
      spacing="16px"
      alignItems="center"
      height="100%"
    >
      <Box
        sx={{
          display: 'inline-flex',
          cursor: isDisabled ? 'not-allowed' : 'default',
        }}
      >
        <EditButton
          component={isDisabled ? 'div' : Link}
          to={isDisabled ? undefined : RouterPaths.editReceipt_ + row.id}
          disabled={isDisabled}
          onClick={(e: React.MouseEvent) => {
            if (isDisabled) {
              e.preventDefault()
              e.stopPropagation()
            }
          }}
          sx={{
            pointerEvents: isDisabled ? 'none' : 'auto',
            '&.Mui-disabled': {
              cursor: 'not-allowed',
            },
          }}
        />
      </Box>
    </Stack>
  )
}
