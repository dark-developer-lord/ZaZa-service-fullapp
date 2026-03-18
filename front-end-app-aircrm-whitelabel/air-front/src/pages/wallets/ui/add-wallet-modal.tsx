import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  IconButton,
  Stack,
  TextField
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import GridCloseIcon from '@icons/close.svg?react'
import { FileUploader } from '@shared/ui'
import { useCreateWallet } from '../api/wallet-actions'

// Validation schema
const createWalletSchema = yup.object().shape({
  name: yup.string().required('Введите название кошелька'),
  logo: yup.mixed().nullable(),
})

type CreateWalletFormData = yup.InferType<typeof createWalletSchema>

interface AddWalletModalProps {
  open: boolean
  onClose: () => void
}

export const AddWalletModal = ({ open, onClose }: AddWalletModalProps) => {
  const [files, setFiles] = useState<File[]>([])

  const createWallet = useCreateWallet()

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<CreateWalletFormData>({
    resolver: yupResolver(createWalletSchema),
    defaultValues: {
      name: '',
      logo: null,
    }
  })

  const onSubmit = (data: CreateWalletFormData) => {
    const formData = {
      name: data.name,
      logo: files[0] || undefined,
    }

    createWallet.mutate(formData, {
      onSuccess: () => {
        handleClose()
      }
    })
  }

  const handleClose = () => {
    reset()
    setFiles([])
    onClose()
  }

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      reset()
      setFiles([])
    }
  }, [open, reset])

  // File upload configuration
  const fileUploadProps = {
    acceptFiles: { 'image/*': ['.jpg', '.jpeg', '.png'] },
    acceptFilesText: '*.jpg, *.jpeg, *.png',
    maxFileSize: 5, // 5MB
    maxFiles: 1, // Only one logo file
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: { xs: 'calc(100vw - 32px)', sm: 480 },
          maxWidth: { xs: 'calc(100vw - 32px)', sm: 520 },
          m: { xs: 2, sm: 'auto' },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        Создать кошелек
        <IconButton onClick={handleClose} size="small">
          <GridCloseIcon width={24} height={24} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Stack
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          spacing={3}
        >
          <Stack spacing={2.5}>
            <FileUploader
              title="Загрузить логотип кошелька"
              name="logo"
              control={control}
              files={files}
              setFiles={setFiles}
              setValue={setValue}
              errorMessage={errors.logo?.message}
              acceptFiles={fileUploadProps.acceptFiles}
              acceptFilesText={fileUploadProps.acceptFilesText}
              maxFileSize={fileUploadProps.maxFileSize}
              maxFiles={fileUploadProps.maxFiles}
              compact={true}
              sx={{ mb: 1 }}
            />

            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Название кошелька"
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  fullWidth
                  size="medium"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    },
                  }}
                />
              )}
            />
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            sx={{
              pt: 1,
              '& .MuiButton-root': {
                height: 48,
                borderRadius: 1,
                fontSize: '16px',
                fontWeight: 500,
              }
            }}
          >
            <Button
              variant="outlined"
              fullWidth
              onClick={handleClose}
              disabled={createWallet.isLoading}
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: 'primary.50',
                },
              }}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={createWallet.isLoading}
              sx={{
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              {createWallet.isLoading ? 'Создание...' : 'Создать'}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
