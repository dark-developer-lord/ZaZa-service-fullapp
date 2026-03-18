import { SVGProps } from 'react'
import { IconButton, IconButtonProps, useTheme } from '@mui/material'

import CloseIcon from '@icons/close.svg?react'

interface Props extends IconButtonProps {
  onClose: () => void
  svgProps?: SVGProps<SVGSVGElement>
}

export const DialogClose = ({ onClose, svgProps, ...props }: Props) => {
  const { palette } = useTheme()
  return (
    <IconButton
      onClick={onClose}
      sx={{ position: 'absolute', top: 16, right: 16, ...props }}
      size="medium"
      {...props}
    >
      <CloseIcon
        width={24}
        height={24}
        stroke={palette.text.primary}
        {...svgProps}
      />
    </IconButton>
  )
}
