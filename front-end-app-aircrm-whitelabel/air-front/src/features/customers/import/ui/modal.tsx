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
import { LoadingButton } from '@mui/lab'
import { AxiosError } from 'axios'
import * as yup from 'yup'

import { ApiKeys, VendorApi, postQuery, queryClient } from '@shared/api'
import { FileUploader } from '@shared/ui'
import GridCloseIcon from '@icons/close.svg?react'

interface Props {
  open: boolean
  onClose: () => void
}

const downloadErrorFile = (fileUrl: string) => {
  if (!fileUrl) {
    toast.error('Ссылка на файл с ошибками не найдена')
    return
  }

  try {
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = 'customer-import-errors.xlsx'
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('Файл с ошибками загружается...', { duration: 3000 })
  } catch (error) {
    console.error('Error downloading file:', error)
    toast.error('Не удалось загрузить файл с ошибками')

    try {
      window.open(fileUrl, '_blank', 'noopener,noreferrer')
    } catch {
      toast.error('Не удалось загрузить файл с ошибками: fallBack')
    }
  }
}

export const Modal = ({ open, onClose }: Props) => {
  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Customers.importCustomers],
    mutationFn: postQuery(VendorApi.importCustomers),
  })

  const [files, setFiles] = useState<File[]>([])
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<{ customers_file: string }>({
    resolver: yupResolver(
      yup
        .object()
        .shape({ customers_file: yup.string().required('Выберите файл') }),
    ),
  })

  const onSubmit: SubmitHandler<{ customers_file: string }> = () => {
    const formData = new FormData()
    formData.append('file', files[0])
    mutate(formData, {
      onSuccess(response: any) {
        
        const importData = response?.data
        const message = response?.message || ''

        const errorFileUrl = response?.error_file_url
        const importedCount = importData?.imported || 0

        if (errorFileUrl) {
          toast.error(message, { duration: 6000 })
          downloadErrorFile(errorFileUrl)
        } else if (importedCount > 0) {
          toast.success(message || `Успешно импортировано ${importedCount} клиентов`)
        } else {
          toast.error('Импорт завершен, но клиенты не были добавлены')
        }

        setFiles([])
        onClose()

        if (importedCount > 0) {
          queryClient.refetchQueries({
            predicate: (query) => {
              const queryKey = query.queryKey as string[]
              return queryKey[0] === ApiKeys.Customers.getCustomers
            }
          })
        }
      },
      onError(error) {
        if (error instanceof AxiosError) {
          const errorData = error.response?.data
          const message = errorData?.message || 'Произошла ошибка при импорте'

          if (errorData?.error_file_url) {
            toast.error(
              `${message}. Файл с ошибками будет загружен автоматически.`,
              { duration: 6000 }
            )
            downloadErrorFile(errorData.error_file_url)
          } else {
            toast.error(message)
          }
        }
      },
    })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>Импорт клиентов</DialogTitle>
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
            name="customers_file"
            control={control}
            setValue={setValue}
            files={files}
            setFiles={setFiles}
            acceptFiles={{
              'file/*': ['.xlsx'],
            }}
            acceptFilesText="xlsx"
            errorMessage={errors.customers_file?.message}
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
