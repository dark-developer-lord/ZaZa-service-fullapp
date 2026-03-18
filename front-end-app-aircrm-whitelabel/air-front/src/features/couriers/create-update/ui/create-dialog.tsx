import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Stack,
} from '@mui/material'
import { AxiosError } from 'axios'

import { getApiPaths, ApiKeys, postQuery, queryClient } from '@shared/api'
import { formatPhoneNumber, removeSpaces } from '@shared/lib'
import { DialogClose, FileUploader, FormInput, FormPassword } from '@shared/ui'

import { fileUploadProps } from '../lib/file-upload-props'
import { CreateDto, createSchema } from '../model/dto'
import { useStore } from '../model/store'
import { SelectType } from './select-type'

const defaultValues: Record<keyof CreateDto, string | number | string[]> = {
  f_name: '',
  l_name: '',
  image: '',
  email: '',
  identity_image: [],
  password: '',
  earning: 0,
  identity_number: '',
  phone: '+992 ',
  identity_type: 'passport',
}

export const CreateDialog = () => {
  const [images, setImages] = useState<File[]>([])
  const [avatar, setAvatar] = useState<File[]>([])
  const [opened, close] = useStore((state) => [
    state.createOpened,
    state.closeCreate,
  ])
  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Couriers.createCourier],
    mutationFn: postQuery(getApiPaths().createCourier),
    onSuccess() {
      toast.success('Курьер успешно добавлен')
      queryClient.refetchQueries(ApiKeys.Couriers.getCouriers)
      reset()
      onClose()
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message)
      }
    },
  })
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<CreateDto>({
    defaultValues: defaultValues as CreateDto,
    resolver: yupResolver(createSchema),
  })

  const phone = watch('phone')

  useEffect(() => {
    setValue('phone', formatPhoneNumber(phone))
  }, [phone, setValue])

  const onClose = () => {
    close()
    reset(defaultValues as CreateDto)
    setImages([])
    setAvatar([])
  }

  const onSubmit: SubmitHandler<CreateDto> = async (dto) => {
    const formData = new FormData()
    formData.append('f_name', dto.f_name)
    formData.append('l_name', dto.l_name)
    formData.append('email', dto.email)
    formData.append('phone', removeSpaces(dto.phone))
    formData.append('identity_number', dto.identity_number.toString())
    formData.append('identity_type', dto.identity_type)
    formData.append('password', dto.password)
    formData.append('earning', dto.earning.toString())
    formData.append('image', avatar[0])
    images.forEach((image) => {
      formData.append('identity_image[]', image)
    })
    mutate(formData)
  }

  return (
    <Dialog
      open={opened}
      onClose={onClose}
      PaperProps={{
        sx: {minWidth: {xs: '360px', mobile: '480px'}}
      }}
    >
      <DialogTitle>Добавить курьера</DialogTitle>
      <DialogClose onClose={onClose} />
      <DialogContent>
        <Stack
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          spacing="24px"
          sx={{ padding: '16px 0' }}
        >
          <FormControl fullWidth>
            <InputLabel>Фото курьера</InputLabel>
            <FileUploader
              name="image"
              control={control}
              files={avatar}
              setFiles={setAvatar}
              setValue={setValue}
              errorMessage={errors.image?.message}
              acceptFiles={fileUploadProps.acceptFiles}
              acceptFilesText={fileUploadProps.acceptFilesText}
              maxFileSize={fileUploadProps.maxFileSize}
            />
          </FormControl>
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
            type="email"
            control={control}
            label="Email"
          />
          <FormInput
            name="phone"
            type="tel"
            control={control}
            label="Телефон"
          />
          <FormInput
            name="identity_number"
            control={control}
            label="Идентификационный номер"
          />
          <SelectType control={control} />
          <FormControl fullWidth>
            <InputLabel>Фото паспорта</InputLabel>
            <FileUploader
              name="identity_image"
              control={control}
              files={images}
              setFiles={setImages}
              setValue={setValue}
              errorMessage={errors.identity_image?.message}
              acceptFiles={fileUploadProps.acceptFiles}
              acceptFilesText={fileUploadProps.acceptFilesText}
              maxFileSize={fileUploadProps.maxFileSize}
              maxFiles={10}
            />
          </FormControl>
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
            Добавить
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
