import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { Api, ApiKeys, postQuery, queryClient } from '@shared/api'
import { DialogClose, FileUploader, FormInput, FormPassword } from '@shared/ui'

import { fileUploadProps } from '../lib/file-upload-props'
import { CreateDto, createSchema } from '../model/dto'
import { useStore } from '../model/store'
import { SelectRole } from './select-role'

const defaultValues: Record<keyof CreateDto, string | null | boolean> = {
  f_name: '',
  l_name: '',
  image: '',
  email: '',
  phone: '',
  password: '',
  role_id: '',
}

export const CreateDialog = () => {
  const [image, setImage] = useState<File[]>([])
  const [opened, close] = useStore((state) => [
    state.createOpened,
    state.closeCreate,
  ])
  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Admins.createAdmin],
    mutationFn: postQuery(Api.createAdmin),
    onSuccess() {
      toast.success('Сотрудник успешно создан')
      queryClient.refetchQueries(ApiKeys.Admins.getAdmins)
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
    formData.append('email', dto.email)
    formData.append('phone', dto.phone)
    formData.append('password', dto.password)
    formData.append('role_id', dto.role_id.toString())
    formData.append('image', image[0])
    mutate(formData)
  }

  return (
    <Dialog
      open={opened}
      onClose={onClose}
      scroll="body"
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
            name="email"
            control={control}
            label="Email"
            type="email"
          />
          <FormInput
            name="phone"
            control={control}
            label="Телефон"
            type="tel"
          />
          <SelectRole control={control} />
          <FormPassword
            name="password"
            control={control}
            label="Пароль"
          />
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
