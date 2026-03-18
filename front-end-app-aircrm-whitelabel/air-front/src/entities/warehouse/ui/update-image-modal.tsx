import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Stack,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { AxiosError } from 'axios'
import * as yup from 'yup'

import { ApiKeys, getApiPaths, postQuery, queryClient } from '@shared/api'
import { FileUploader } from '@shared/ui'
import { DialogClose } from '@shared/ui/dialog-close'

const fileUploadProps = {
  acceptFiles: {
    'image/*': ['.png', '.jpg', '.jpeg', '.svg'],
  },
  acceptFilesText: '*.jpeg, *.jpg, *.png, *.svg',
  maxFileSize: 1,
}

const schema = yup.object().shape({
  image: yup.mixed().required('Выберите изображение'),
})

type FormData = yup.InferType<typeof schema>

interface Props {
  open: boolean
  productId: number | null
  onClose: () => void
}

export const UpdateImageModal = ({ open, productId, onClose }: Props) => {
  const [files, setFiles] = useState<File[]>([])

  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Products.updateProductImage_ + productId + '/update-image'],
    mutationFn: postQuery(getApiPaths().updateProductImage_ + productId + '/update-image'),
    onSuccess() {
      toast.success('Изображение успешно обновлено')
      queryClient.refetchQueries(ApiKeys.Products.getProducts)
      handleClose()
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message || 'Произошла ошибка при обновлении изображения',
        )
      }
    },
  })

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const handleClose = () => {
    setFiles([])
    reset()
    onClose()
  }

  const onSubmit: SubmitHandler<FormData> = () => {
    if (!files[0]) {
      toast.error('Выберите изображение')
      return
    }

    const formData = new FormData()
    formData.append('image', files[0])

    mutate(formData, {
      onSuccess() {
        handleClose()
      },
    })
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Обновить изображение продукта</DialogTitle>
      <DialogClose onClose={handleClose} />
      <DialogContent>
        <Stack
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          spacing="24px"
          sx={{ padding: '16px 0' }}
        >
          <FormControl fullWidth>
            <InputLabel>Изображение продукта</InputLabel>
            <FileUploader
              name="image"
              control={control}
              files={files}
              setFiles={setFiles}
              setValue={setValue}
              errorMessage={errors.image?.message}
              acceptFiles={fileUploadProps.acceptFiles}
              acceptFilesText={fileUploadProps.acceptFilesText}
              maxFileSize={fileUploadProps.maxFileSize}
            />
          </FormControl>

          <Stack
            direction="row"
            spacing="16px"
            justifyContent="space-between"
          >
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={handleClose}
            >
              Отмена
            </Button>
            <LoadingButton
              type="submit"
              size="large"
              fullWidth
              loading={isLoading}
            >
              Сохранить
            </LoadingButton>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}