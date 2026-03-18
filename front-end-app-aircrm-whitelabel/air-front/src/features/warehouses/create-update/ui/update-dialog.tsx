import { useEffect } from 'react'
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
  Stack,
  Typography,
} from '@mui/material'
import { AxiosError } from 'axios'

import { useGetWarehouse } from '@entities/warehouses'
import { ApiKeys, getApiPaths, postQuery, queryClient } from '@shared/api'
import { formatPhoneNumber, removeSpaces } from '@shared/lib'
import { DialogClose, FormInput, FormPassword } from '@shared/ui'

import { CreateDto, UpdateDto, updateSchema } from '../model/dto'
import { useStore } from '../model/store'

const defaultValues: Record<keyof UpdateDto, string | number | string[]> = {
  name: '',
  address: '',
  responsible: '',
  phone: '+992 ',
  owner_name: '',
  owner_phone: '+992 ',
  email: '',
  password: '',
}

export const UpdateDialog = () => {
  const [activeWarehouse, close] = useStore((state) => [
    state.updateOpened,
    state.closeUpdate,
  ])
  const { data, isFetching } = useGetWarehouse(activeWarehouse?.id)
  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Warehouses.updateWarehouse_ + activeWarehouse?.id],
    mutationFn: postQuery(getApiPaths().updateWarehouse_ + activeWarehouse?.id),
    onSuccess() {
      toast.success('Склад успешно изменен')
      queryClient.refetchQueries(ApiKeys.Warehouses.getWarehousesList)
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
      const warehouse = data.data
      reset({
        name: warehouse.name,
        address: warehouse.address,
        responsible: warehouse.responsible,
        phone: warehouse.phone,
        owner_name: warehouse.owner.name ?? '',
        owner_phone: warehouse.owner.phone ?? '',
        email: warehouse.owner.email ?? ''
      })
    }
  }, [data, activeWarehouse?.id, reset])

  const onClose = () => {
    close()
    reset(defaultValues as CreateDto)
  }

  const onSubmit: SubmitHandler<UpdateDto> = async (dto) => {
    const formData = new FormData()
    if (dto.name) {
      formData.append('name', dto.name)
    }
    formData.append('address', dto.address)
    formData.append('responsible', dto.responsible)
    formData.append('phone', removeSpaces(dto.phone))
    formData.append('owner_name', removeSpaces(dto.owner_name ?? ''))
    formData.append('owner_phone', removeSpaces(dto.owner_phone ?? ''))
    formData.append('owner_email', dto.email ?? '')
    formData.append('_method', 'PUT')
    mutate(formData)
  }

  return (
    <Dialog
      open={Boolean(activeWarehouse)}
      onClose={onClose}
      scroll="body"
    >
      <DialogTitle>Изменение склада</DialogTitle>
      <DialogClose onClose={onClose} />
      <DialogContent>
        {isFetching ? (
          <Box
            sx={{
              height: 150,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Stack
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            spacing="24px"
            sx={{ padding: '16px 0' }}
          >
            <Stack
              mb="24px"
              spacing="24px"
            >
              <Typography
                variant="h6"
                mb="24px"
              >
                Информация о складе
              </Typography>
              {/* <SelectZone control={control as Control<CreateDto>} /> */}
              <FormInput
                  name="name"
                  control={control}
                  label="Название"
                />
              <FormInput
                name="address"
                control={control}
                label="Адрес"
              />
              <FormInput
                name="responsible"
                control={control}
                label="Ответственный"
              />
              <FormInput
                name="phone"
                type="tel"
                control={control}
                label="Телефон"
              />
            </Stack>
            <Stack spacing="24px">
              <Typography
                variant="h6"
                mb="24px"
              >
                Информация о владельце
              </Typography>
              <FormInput
                name="owner_name"
                control={control}
                label="Имя"
              />
              <FormInput
                name="owner_phone"
                type="tel"
                control={control}
                label="Телефон"
              />
            </Stack>
            <Stack
              mb="24px"
              spacing="24px"
            >
              <Typography
                variant="h6"
                mb="24px"
              >
                Учётная запись
              </Typography>
              <FormInput
                name="email"
                type="email"
                control={control}
                label="Email"
              />
              <FormPassword
                name="password"
                control={control}
                label="Пароль"
              />
            </Stack>
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
