import { useState } from 'react'
import { LoadingButton } from '@mui/lab'

import { palette } from '@shared/theme/palette'
import UploadIcon from '@icons/upload.svg?react'

import { Modal } from './modal'

export const ImportButton = () => {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      <LoadingButton
        aria-controls="import-menu"
        aria-haspopup="true"
        aria-expanded="true"
        onClick={() => setOpen(true)}
        startIcon={
          <UploadIcon
            width={20}
            height={20}
            stroke={palette.text.primary}
          />
        }
        color="secondary"
      >
        Импорт
      </LoadingButton>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
