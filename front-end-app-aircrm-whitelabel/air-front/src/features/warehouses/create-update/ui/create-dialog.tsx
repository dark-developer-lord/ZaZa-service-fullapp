import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { AxiosError } from 'axios'

import { ApiKeys, getApiPaths, postQuery, queryClient } from '@shared/api'
import { formatPhoneNumber, removeSpaces } from '@shared/lib'
import { DialogClose, FormInput } from '@shared/ui'

import { CreateDto, createSchema } from '../model/dto'
import { useStore } from '../model/store'

const defaultValues: Record<string, string | number | string[]> = {
  name: '',
  address: '',
  responsible: '',
  phone: '+992 ',
  owner_name: '',
  owner_phone: '+992 ',
  email: '',
  password: '',
}

export const CreateDialog = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("mobile"))
  const [opened, close] = useStore((state) => [
    state.createOpened,
    state.closeCreate,
  ])
  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Warehouses.createWarehouse],
    mutationFn: postQuery(getApiPaths().createWarehouse),
    onSuccess() {
      toast.success('Склад успешно добавлен')
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
  }

  const onSubmit: SubmitHandler<CreateDto> = async (dto) => {
    const formData = new FormData()
    if (dto.name) {
      formData.append('name', dto.name)
    }
    formData.append('address', dto.address)
    formData.append('responsible', dto.responsible)
    formData.append('phone', removeSpaces(dto.phone))
    mutate(formData)
  }


  return (
    <Dialog
      open={opened}
      onClose={onClose}
      scroll={!isMobile ? 'body' : undefined}
      PaperProps={{
        sx: {minWidth: {xs: '360px', mobile: '480px'}}
      }}
    >
      <DialogTitle>Добавление склада</DialogTitle>
      <DialogClose onClose={onClose} />
      <DialogContent>
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
              variant="subtitle1"
              mb="24px"
              color="text.secondary"
              fontWeight={500}
            >
              Информация о складе
            </Typography>
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
              label="Ответсвенный"
            />
            <FormInput
              name="phone"
              type="tel"
              control={control}
              label="Телефон"
            />
          </Stack>
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
