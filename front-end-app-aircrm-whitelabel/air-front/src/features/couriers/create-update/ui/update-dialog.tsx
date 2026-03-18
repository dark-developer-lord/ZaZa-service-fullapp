import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Stack,
} from '@mui/material'
import { AxiosError } from 'axios'

import { useGetCourier } from '@entities/courier'
import { getApiPaths, ApiKeys, postQuery, queryClient } from '@shared/api'
import { formatPhoneNumber, removeSpaces } from '@shared/lib'
import { DialogClose, FileUploader, FormInput, FormPassword } from '@shared/ui'

import { fileUploadProps } from '../lib/file-upload-props'
import { UpdateDto, updateSchema } from '../model/dto'
import { useStore } from '../model/store'
import { SelectType } from './select-type'

const defaultValues: Record<keyof UpdateDto, string | number | string[]> = {
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

export const UpdateDialog = () => {
  const [images, setImages] = useState<File[]>([])
  const [avatar, setAvatar] = useState<File[]>([])
  const [courier, close] = useStore((state) => [
    state.updateOpened,
    state.closeUpdate,
  ])
  const { data, isFetching } = useGetCourier(courier?.id)
  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Couriers.updateCourier_ + courier?.id],
    mutationFn: postQuery(getApiPaths().updateCourier_ + courier?.id),
    onSuccess() {
      toast.success('Курьер успешно изменен')
      queryClient.refetchQueries(ApiKeys.Couriers.getCouriers)
      reset()
      onClose()
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message || 'Произошла ошибка при изменении',
        )
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
  } = useForm<UpdateDto>({
    defaultValues: defaultValues as UpdateDto,
    resolver: yupResolver(updateSchema),
  })

  const phone = watch('phone')

  useEffect(() => {
    setValue('phone', formatPhoneNumber(phone))
  }, [phone, setValue])

  useEffect(() => {
    if (data) {
      const courier = data.data
      reset({
        f_name: courier.f_name,
        l_name: courier.l_name,
        email: courier.email,
        phone: courier.phone,
        identity_number: courier.identity_number,
        identity_type: courier.identity_type as UpdateDto['identity_type'],
        earning: courier.earning,
      })
    }
  }, [data])

  const onClose = () => {
    close()
    reset(defaultValues as UpdateDto)
    setImages([])
    setAvatar([])
  }

  const onSubmit: SubmitHandler<UpdateDto> = async (dto) => {
    const formData = new FormData()
    formData.append('f_name', dto.f_name)
    formData.append('l_name', dto.l_name)
    formData.append('email', dto.email)
    formData.append('phone', removeSpaces(dto.phone))
    formData.append('identity_number', dto.identity_number.toString())
    formData.append('identity_type', dto.identity_type)
    if (dto.password && dto.password.trim() !== '') {
      formData.append('password', dto.password)
    }
    formData.append('earning', dto.earning.toString())
    if (avatar[0]) {
      formData.append('image', avatar[0])
    }
    if (images.length > 0) {
      images.forEach((image) => {
        formData.append('identity_image[]', image)
      })
    }
    mutate(formData)
  }

  return (
    <Dialog
      open={Boolean(courier)}
      onClose={onClose}
    >
      <DialogTitle>Изменить курьера</DialogTitle>
      <DialogClose onClose={onClose} />
      <DialogContent>
        {isFetching ? (
          <Box sx={{ width: '100%', height: '400px' }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
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
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/ban-ts-comment */}
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
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/ban-ts-comment */}
            {/* @ts-expect-error */}
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
              Изменить
            </LoadingButton>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  )
}
