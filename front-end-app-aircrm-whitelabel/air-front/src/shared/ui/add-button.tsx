import { ElementType } from 'react'
import { Button, ButtonProps, ButtonTypeMap, useMediaQuery, useTheme } from '@mui/material'

import AddIcon from '@icons/plus.svg?react'

export const AddButton = <
  RootComponent extends ElementType = ButtonTypeMap['defaultComponent'],
  AdditionalProps = NonNullable<unknown>,
>({
  ...props
}: ButtonProps<RootComponent, AdditionalProps>) => {

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))

  return (
    <Button
      variant="contained"
      color="primary"
      size={ !isMobile ? 'medium' : 'small' }
      startIcon={
        <AddIcon
          width={20}
          height={20}
          stroke="white"
        />
      }
      {...props}
    />
  )
}
