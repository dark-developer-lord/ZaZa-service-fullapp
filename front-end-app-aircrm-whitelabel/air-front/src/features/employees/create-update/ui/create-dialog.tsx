import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { ApiKeys, postQuery, queryClient, VendorApi } from '@shared/api'
import { DialogClose, FileUploader, FormInput, FormPassword } from '@shared/ui'

import { fileUploadProps } from '../lib/file-upload-props'
import { CreateDto, createSchema } from '../model/dto'
import { useStore } from '../model/store'
import { SelectModules } from './select-modules'

const defaultValues: Record<keyof CreateDto, string | null | boolean | string[]> = {
  f_name: '',
  l_name: '',
  image: '',
  phone: '+992',
  password: '',
  modules: [],
}

export const CreateDialog = () => {
  const [image, setImage] = useState<File[]>([])
  const [opened, close] = useStore((state) => [
    state.createOpened,
    state.closeCreate,
  ])
  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Employees.createEmployee],
    mutationFn: postQuery(VendorApi.createEmployee),
    onSuccess() {
      toast.success('Сотрудник успешно создан')
      queryClient.refetchQueries(ApiKeys.Employees.getEmployees)
      reset()
      onClose()
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message || 'Произошла ошибка при создании',
        )
      }
    },
  })
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateDto>({
    defaultValues: defaultValues as unknown as CreateDto,
    resolver: yupResolver(createSchema),
  })

  const onClose = () => {
    close()
    reset(defaultValues as unknown as CreateDto)
    setImage([])
  }

  const onSubmit: SubmitHandler<CreateDto> = async (dto) => {
    const formData = new FormData()
    formData.append('f_name', dto.f_name)
    formData.append('l_name', dto.l_name)
    formData.append('phone', dto.phone)
    formData.append('password', dto.password)

    // Add modules as array
    dto.modules.forEach((module, index) => {
      formData.append(`modules[${index}]`, module as string)
    })

    if (image[0]) {
      formData.append('image', image[0])
    }

    mutate(formData)
  }

  return (
    <Dialog
      open={opened}
      onClose={onClose}
      scroll="body"
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          width: {
            xs: '95%',      // Mobile: 95% of screen width
            sm: '80%',      // Tablet: 80% of screen width
            md: '600px',    // Desktop: Fixed 600px width
            lg: '650px',    // Large: Fixed 650px width
            xl: '700px',    // Extra Large: Fixed 700px width
          },
          maxWidth: {
            xs: '95%',
            sm: '80%',
            md: '600px',
            lg: '650px',
            xl: '700px',
          },
          margin: {
            xs: '16px',     // Mobile: 16px margin
            sm: '32px',     // Tablet: 32px margin
            md: 'auto',     // Desktop+: Auto centering
          },
          maxHeight: {
            xs: '90vh',     // Mobile: 90% of viewport height
            sm: '85vh',     // Tablet: 85% of viewport height
            md: '80vh',     // Desktop+: 80% of viewport height
          }
        }
      }}
    >
      <DialogTitle>Добавить сотрудника</DialogTitle>
      <DialogClose onClose={onClose} />
      <DialogContent>
        <Stack
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          spacing="24px"
          sx={{ padding: '16px 0' }}
        >
          <FileUploader
            name="image"
            control={control}
            files={image}
            setFiles={setImage}
            setValue={setValue}
            errorMessage={errors.image?.message}
            acceptFiles={fileUploadProps.acceptFiles}
            acceptFilesText={fileUploadProps.acceptFilesText}
            maxFileSize={fileUploadProps.maxFileSize}
          />
          <FormInput
            name="f_name"
            control={control}
            label="Имя"
          />
          <FormInput
            name="l_name"
            control={control}
            label="Фамилия"
          />
          <FormInput
            name="phone"
            control={control}
            label="Телефон"
            type="tel"
            placeholder="+992123456789"
          />
          <FormPassword
            name="password"
            control={control}
            label="Пароль"
          />
          <SelectModules control={control} />
          <LoadingButton
            type="submit"
            fullWidth
            sx={{ mt: '24px' }}
            size="large"
            loading={isLoading}
          >
            Добавить сотруднка
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
