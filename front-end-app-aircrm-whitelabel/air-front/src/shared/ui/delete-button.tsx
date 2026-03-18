import * as React from 'react'
import { IconButton, IconButtonProps, useTheme } from '@mui/material'
import { IconButtonTypeMap } from '@mui/material/IconButton/IconButton'

import DeleteIcon from '@icons/delete.svg?react'

export const DeleteButton = <
  RootComponent extends
    React.ElementType = IconButtonTypeMap['defaultComponent'],
  AdditionalProps = NonNullable<unknown>,
>(
  props: IconButtonProps<RootComponent, AdditionalProps>,
) => {
  const { palette } = useTheme()
  return (
    <IconButton
      size="small"
      {...props}
    >
      <DeleteIcon
        width={16}
        height={16}
        stroke={palette.error.main}
      />
    </IconButton>
  )
}
