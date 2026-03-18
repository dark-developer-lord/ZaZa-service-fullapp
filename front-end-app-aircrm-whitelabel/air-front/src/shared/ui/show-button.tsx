import * as React from 'react'
import { IconButton, IconButtonProps, useTheme } from '@mui/material'
import { IconButtonTypeMap } from '@mui/material/IconButton/IconButton'

import ShowIcon from '@icons/eye-lite.svg?react'

export const ShowButton = <
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
      <ShowIcon
        width={16}
        height={16}
        stroke={palette.primary.main}
      />
    </IconButton>
  )
}
