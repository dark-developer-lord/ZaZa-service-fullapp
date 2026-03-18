import * as React from 'react'
import { IconButton, IconButtonProps, useTheme } from '@mui/material'
import { IconButtonTypeMap } from '@mui/material/IconButton/IconButton'

import EditIcon from '@icons/edit.svg?react'

export const EditButton = <
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
      <EditIcon
        width={16}
        height={16}
        stroke={palette.success.main}
      />
    </IconButton>
  )
}
