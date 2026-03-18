import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  IconButtonProps,
  useTheme,
} from '@mui/material'

import DeleteIcon from '@icons/delete.svg?react'

interface Props extends IconButtonProps {
  onDelete: () => void
  dialogTitle?: string
  dialogContent?: string
}

export const DeleteButtonConfirmation = ({
  onDelete,
  dialogTitle,
  dialogContent,
  ...props
}: Props) => {
  const [open, setOpen] = useState(false)
  const { palette } = useTheme()

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <IconButton
        size="small"
        {...props}
        onClick={(event) => {
          setOpen((prev) => !prev)
          if (props.onClick) {
            props.onClick(event)
          }
        }}
      >
        <DeleteIcon
          width={16}
          height={16}
          stroke={palette.error.main}
        />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {minWidth: {xs: '328px', mobile: '480px'}}
        }}
      >
        <DialogTitle>
          {dialogTitle ?? 'Вы действительно хотите удалить?'}
        </DialogTitle>
        {dialogContent && (
          <DialogContent>
            <DialogContentText>
              {dialogContent}
            </DialogContentText>
          </DialogContent>
        )}
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="outlined"
            size="medium"
          >
            Отмена
          </Button>
          <Button
            onClick={() => {
              onDelete()
              handleClose()
            }}
            size="medium"
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
