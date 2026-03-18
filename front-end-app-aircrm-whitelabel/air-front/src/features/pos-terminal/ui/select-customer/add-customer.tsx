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
  IconButton,
  Stack,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material'
import { AxiosError } from 'axios'

import { SearchCustomer } from '@entities/customer'
import { ApiKeys, getApiPaths, postQuery, queryClient } from '@shared/api'
import { formatPhoneNumber } from '@shared/lib'
import { FormInput, FormDateInput } from '@shared/ui'
import CloseIcon from '@icons/close.svg?react'

import { useCartStore } from '../../model/cart-store'
import { CustomerDto, customerSchema } from '../../model/customer-dto'

interface Props {
  opened: boolean
  onClose: () => void
}

const defaultValues = {
  name: '',
  address: '',
  phone: '+992 ',
  birthdate: '',
  source: '',
  loyalty_enabled: false,
  loyalty_percentage: 5,
  manual_points_reason: '',
}

export const AddCustomer = ({ opened, onClose }: Props) => {
  const [loyaltyEnabled, setLoyaltyEnabled] = useState(false)
  const setCustomer = useCartStore((state) => state.setCustomer)
  const { isLoading, mutate } = useMutation({
    mutationKey: [ApiKeys.Common.addCustomer],
    mutationFn: postQuery<CustomerDto, { data: SearchCustomer }>(
      getApiPaths().addCustomer,
    ),
  })
  const { control, handleSubmit, setValue, watch, reset } =
    useForm<CustomerDto>({
      defaultValues,
      resolver: yupResolver(customerSchema),
    })

  const onSubmit: SubmitHandler<CustomerDto> = (data) => {
    // Clean up the data - convert empty strings to undefined for optional fields
    const cleanedData = {
      ...data,
      birthdate: data.birthdate?.trim() || undefined,
      source: data.source?.trim() || undefined,
    }

    mutate(cleanedData, {
      onError(error) {
        if (error instanceof AxiosError && error.response?.data.message) {
          toast.error(
            error.response.data.message ||
              'Произошла ошибка при добавлении клиента',
          )
        }
      },
      onSuccess(customer) {
        setCustomer(customer.data)
        onClose()
        reset(defaultValues)
        // Refetch customers list to show the newly created customer
        queryClient.refetchQueries({
          predicate: (query) => {
            const queryKey = query.queryKey as string[]
            return queryKey[0] === ApiKeys.Customers.getCustomers
          }
        })
      },
    })
  }

  useEffect(() => {
    setValue('phone', formatPhoneNumber(watch('phone')))
  }, [setValue, watch('phone')])

  return (
    <Dialog
      open={opened}
      onClose={onClose}
      PaperProps={{
        sx: {minWidth: {xs: '328px', mobile: '480px'}}
      }}
    >
      <DialogTitle>Добавить клиента</DialogTitle>
      <DialogContent>
        <Stack
          component="form"
          spacing="24px"
          sx={{ pt: '12px' }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormInput
            name="name"
            control={control}
            label="ФИО"
            disabled={isLoading}
          />
          <FormInput
            name="phone"
            control={control}
            label="Телефон"
            disabled={isLoading}
          />
          <FormInput
            name="address"
            control={control}
            label="Адрес"
            disabled={isLoading}
          />
          <FormDateInput
            name="birthdate"
            control={control}
            label="Дата рождения"
            disabled={isLoading}
            placeholder="ДД.ММ.ГГГГ"
          />
          <FormInput
            name="source"
            control={control}
            label="Источник"
            disabled={isLoading}
            placeholder="Откуда узнали о нас"
          />

          <Divider />

          {/* Loyalty Points Section */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Программа лояльности
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={loyaltyEnabled}
                  onChange={(e) => {
                    setLoyaltyEnabled(e.target.checked)
                    setValue('loyalty_enabled', e.target.checked)
                    if (!e.target.checked) {
                      setValue('loyalty_percentage', 5)
                    }
                  }}
                />
              }
              label="Включить программу лояльности"
            />

            {loyaltyEnabled && (
              <Box sx={{ mt: 2 }}>
                <FormInput
                  name="loyalty_percentage"
                  control={control}
                  label="Процент начисления баллов (%)"
                  disabled={isLoading}
                  type="number"
                  placeholder="5"
                />
              </Box>
            )}
          </Box>

          <LoadingButton
            type="submit"
            loading={isLoading}
          >
            Добавить клиента
          </LoadingButton>
        </Stack>
      </DialogContent>
      <IconButton
        size="small"
        sx={{ position: 'absolute', top: 10, right: 10 }}
        onClick={onClose}
      >
        <CloseIcon
          width={16}
          height={16}
        />
      </IconButton>
    </Dialog>
  )
}
