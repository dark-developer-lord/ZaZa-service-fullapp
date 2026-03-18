import { useState } from 'react'
import { LoadingButton } from '@mui/lab'

import { palette } from '@shared/theme/palette'
import UploadIcon from '@icons/upload.svg?react'

import { ImportArrivalModal, ParsedProduct } from './import-arrival-modal'

interface Props {
  onImport: (data: ParsedProduct[]) => void
}

export const ImportArrivalButton = ({ onImport }: Props) => {
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
      <ImportArrivalModal
        open={open}
        onClose={() => setOpen(false)}
        onImport={onImport}
      />
    </>
  )
}

