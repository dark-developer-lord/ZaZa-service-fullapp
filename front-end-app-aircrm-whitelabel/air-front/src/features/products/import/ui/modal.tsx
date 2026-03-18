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
  IconButton,
  Stack,
} from '@mui/material'
import { GridCloseIcon } from '@mui/x-data-grid'
import { AxiosError } from 'axios'
import * as yup from 'yup'

import { ApiKeys, postQuery, queryClient, VendorApi } from '@shared/api'
import { FileUploader } from '@shared/ui'

interface Props {
  open: boolean
  onClose: () => void
}

export const Modal = ({ open, onClose }: Props) => {
  const { mutate } = useMutation({
    mutationKey: [ApiKeys.Products.importProductExcel],
    mutationFn: postQuery(VendorApi.importProductExcel),
  })

  const [files, setFiles] = useState<File[]>([])
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<{ products_file: string }>({
    resolver: yupResolver(
      yup
        .object()
        .shape({ products_file: yup.string().required('Выберите файл') }),
    ),
  })

  const onSubmit: SubmitHandler<{ products_file: string }> = () => {
    const formData = new FormData()
    formData.append('file', files[0])
    mutate(formData, {
      onSuccess() {
        toast.success('Товар успешно добавлен')
        setFiles([])
        onClose()
        queryClient.refetchQueries(ApiKeys.Products.getProducts)
      },
      onError(error) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data.message || 'Произошла ошибка при создании',
          )
        }
      },
    })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>Импорт</DialogTitle>
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 24,
          right: 24,
        }}
      >
        <GridCloseIcon
          width={24}
          height={24}
        />
      </IconButton>
      <DialogContent>
        <Stack
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FileUploader
            name="products_file"
            control={control}
            setValue={setValue}
            files={files}
            setFiles={setFiles}
            acceptFiles={{
              'file/*': ['.xlsx'],
            }}
            acceptFilesText="xlsx"
            errorMessage={errors.products_file?.message}
          />
          <Stack
            direction="row"
            spacing="16px"
            justifyContent="space-between"
          >
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => {
                setFiles([])
                onClose()
              }}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              size="large"
              fullWidth
            >
              Сохранить
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
