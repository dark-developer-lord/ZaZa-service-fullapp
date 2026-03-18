import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { Api, ApiKeys, postQuery, queryClient } from '@shared/api'
import { formatPhoneNumber } from '@shared/lib'
import { DialogClose, FormInput } from '@shared/ui'

import { Dto, schema } from '../model/dto'
import { useStore } from '../model/store'

const defaultValues: Record<keyof Dto, string | number | string[]> = {
  f_name: '',
  l_name: '',
  phone: '+992 ',
  addresses: [],
}

export const UpdateDialog = () => {
  const [customer, close] = useStore((state) => [
    state.updateOpened,
    state.closeUpdate,
  ])
  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Customers.updateCustomer_ + customer?.id],
    mutationFn: postQuery(Api.updateCustomer_ + customer?.id),
    onSuccess() {
      toast.success('Данные пользователя успешна изменены')
      queryClient.refetchQueries(ApiKeys.Customers.getCustomers)
      reset()
      onClose()
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message)
      }
    },
  })
  const { control, handleSubmit, setValue, reset, watch } = useForm<Dto>({
    defaultValues: defaultValues as Dto,
    resolver: yupResolver(schema),
  })

  const phone = watch('phone')

  useEffect(() => {
    setValue('phone', formatPhoneNumber(phone))
  }, [phone, setValue])

  useEffect(() => {
    if (customer) {
      reset({
        f_name: customer.f_name,
        l_name: customer.l_name,
        phone: formatPhoneNumber(customer.phone),
        addresses: [],
      })
    }
  }, [customer])

  const onClose = () => {
    close()
    reset(defaultValues as Dto)
  }

  const onSubmit: SubmitHandler<Dto> = async (dto) => {
    mutate(dto)
  }

  return (
    <Dialog
      open={Boolean(customer)}
      onClose={onClose}
      scroll="body"
    >
      <DialogTitle>Изменение данные пользователя</DialogTitle>
      <DialogClose onClose={onClose} />
      <DialogContent>
        <Stack
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          spacing="24px"
          sx={{ padding: '16px 0' }}
        >
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
            type="tel"
            control={control}
            label="Телефон"
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
      </DialogContent>
    </Dialog>
  )
}
