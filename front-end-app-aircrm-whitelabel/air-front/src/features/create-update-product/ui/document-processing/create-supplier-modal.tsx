import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Dialog, DialogContent, DialogTitle, Stack, MenuItem, TextField } from '@mui/material'
import { AxiosError } from 'axios'

import { ApiKeys, postQuery, queryClient, VendorApi } from '@shared/api'
import { formatPhoneNumber } from '@shared/lib'
import { DialogClose, FormInput, FormSelect } from '@shared/ui'
import { useGetCounterpartyTypes } from '@features/finance/schedule-transaction/api/get-counterparty-types'

import { SupplierDto, supplierSchema } from '../../model/supplier-dto'

interface Props {
  open: boolean
  onClose: () => void
  onSupplierCreated?: (supplier: any) => void
}

const defaultValues: SupplierDto = {
  counterparty: '',
  name: '',
  requisite: '',
  type: 'supplier', // Fixed to supplier type
  address: '',
  phone: '',
  notes: '',
  status: 'active',
  balance: 0,
}

// Status options
const statusOptions = [
  { value: 'active', label: 'Активный' },
  { value: 'inactive', label: 'Неактивный' },
]

export const CreateSupplierModal = ({ open, onClose, onSupplierCreated }: Props) => {
  const { data: counterpartyTypes, isFetching: isFetchingTypes } = useGetCounterpartyTypes()

  // Get the supplier label from API
  const supplierLabel = counterpartyTypes?.types?.find(type => type.value === 'supplier')?.label || 'Поставщик'

  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Counterparties.createCounterparty],
    mutationFn: postQuery<SupplierDto, { data: any }>(VendorApi.createCounterparty),
    onSuccess(response) {
      toast.success('Поставщик успешно создан')
      queryClient.refetchQueries(ApiKeys.Counterparties.getCounterparties)
      queryClient.refetchQueries(ApiKeys.Counterparties.searchCounterparties)
      
      // Call the callback with the created supplier
      if (onSupplierCreated && response.data) {
        onSupplierCreated(response.data)
      }
      
      reset()
      onClose()
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Произошла ошибка при создании поставщика')
      }
    },
  })

  const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<SupplierDto>({
    defaultValues,
    resolver: yupResolver(supplierSchema),
  })

  const phone = watch('phone')

  useEffect(() => {
    setValue('phone', formatPhoneNumber(phone))
  }, [phone, setValue])

  const onSubmit: SubmitHandler<SupplierDto> = (data) => {
    // Map the supplier-specific fields to the standard counterparty API format
    const apiData = {
      counterparty: data.counterparty, // Наименования
      name: data.name, // ФИО
      requisite: data.requisite, // ИНН
      type: 'supplier', // Always supplier for this modal
      address: data.address, // Адрес
      phone: data.phone, // Контакты
      notes: data.notes, // Заметки
      balance: data.balance || 0,
      status: data.status,
    }
    mutate(apiData as any)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
        },
      }}
    >
      <DialogTitle>Добавить поставщика</DialogTitle>
      <DialogClose onClose={handleClose} />
      <DialogContent>
        <Stack
          component="form"
          spacing="24px"
          sx={{ pt: '12px' }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormInput
            name="counterparty"
            control={control}
            label="Наименование компании"
            disabled={isLoading}
            placeholder="Введите наименование компании"
            error={Boolean(errors.counterparty)}
            helperText={errors.counterparty?.message}
          />

          <FormInput
            name="name"
            control={control}
            label="ФИО"
            disabled={isLoading}
            placeholder="Введите ФИО"
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
          />

          <FormInput
            name="requisite"
            control={control}
            label="ИНН"
            disabled={isLoading}
            placeholder="Введите ИНН (необязательно)"
          />

          <TextField
            label="Тип контрагента"
            value={supplierLabel}
            disabled={true}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            sx={{
              '& .MuiInputBase-input': {
                backgroundColor: 'grey.100',
              },
            }}
          />

          <FormInput
            name="address"
            control={control}
            label="Адрес"
            disabled={isLoading}
            placeholder="Введите адрес (необязательно)"
          />

          <FormInput
            name="phone"
            control={control}
            label="Контакты"
            disabled={isLoading}
            placeholder="Введите номер телефона"
            error={Boolean(errors.phone)}
            helperText={errors.phone?.message}
          />

          <FormInput
            name="notes"
            control={control}
            label="Заметки"
            disabled={isLoading}
            multiline
            rows={3}
            placeholder="Введите заметки (необязательно)"
          />

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isLoading}
            fullWidth
            sx={{
              mt: 2,
              borderRadius: 1,
              textTransform: 'none',
              fontSize: '16px',
              py: 1.5,
              backgroundColor: 'primary.main',
            }}
          >
            Добавить поставщика
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
