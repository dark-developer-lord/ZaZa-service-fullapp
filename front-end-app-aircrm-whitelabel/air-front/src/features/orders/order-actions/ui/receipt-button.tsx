import { useState } from 'react'
import { IconButton, useTheme, useMediaQuery } from '@mui/material'

import { Modal } from './modal'

import DocumentIcon from '@icons/document.svg?react'

interface Props {
    orderId: number,
}

export const ReceiptButton = ({ orderId: id }: Props) => {
    const [open, setOpen] = useState(false)
    const { palette } = useTheme()
    const isMobile = useMediaQuery(useTheme().breakpoints.down('mobile'))

    // Hide document icon on mobile
    if (isMobile) {
        return null
    }

    return (
      <div>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          orderId={ id }
        />
        <IconButton
            size="small"
            onClick={() => setOpen(true)}
        >
            <DocumentIcon
                width={16}
                height={16}
                stroke={palette.success.main}
            />
        </IconButton>
      </div>
    )
  }