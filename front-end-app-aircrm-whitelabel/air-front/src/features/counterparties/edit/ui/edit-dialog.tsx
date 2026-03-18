import { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  MenuItem,
  CircularProgress,
  Box,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'

import { DialogClose } from '@shared/ui'
import { FormInput, FormSelect } from '@shared/ui/form'
import { CounterpartyDto, counterpartySchema } from '@features/counterparties/create/model/dto'
import { useGetCounterpartyTypes } from '@features/finance/schedule-transaction/api/get-counterparty-types'
import { useEditCounterpartyModal } from '@features/counterparties/edit/model/store'
import { useGetCounterparty } from '@features/counterparties/edit/api/get-counterparty'
import { useUpdateCounterparty } from '@features/counterparties/edit/api/update-counterparty'

// Status options
const statusOptions = [
  { value: 'active', label: 'Активный' },
  { value: 'inactive', label: 'Неактивный' },
]

export const EditCounterpartyDialog = () => {
  const { opened, counterpartyId, close } = useEditCounterpartyModal()
  const { data: counterpartyData, isFetching } = useGetCounterparty(counterpartyId)
  const { data: counterpartyTypes, isFetching: isFetchingTypes } = useGetCounterpartyTypes()
  const { mutate, isLoading } = useUpdateCounterparty(counterpartyId)

  const { control, handleSubmit, reset } = useForm<CounterpartyDto>({
    resolver: yupResolver(counterpartySchema),
  })

  // Populate form when data is loaded
  useEffect(() => {
    if (counterpartyData?.data) {
      const data = counterpartyData.data
      reset({
        counterparty: data.counterparty || '',
        name: data.name || '',
        type: data.type || '',
        requisite: data.requisite || '',
        address: data.address || '',
        phone: data.phone || '',
        balance: data.balance || 0,
        comment: data.comment || '',
        status: data.status || 'active',
      })
    }
  }, [counterpartyData, reset])

  const onSubmit: SubmitHandler<CounterpartyDto> = (data) => {
    // Clean up the data - convert empty strings to undefined for optional fields
    const cleanedData = {
      ...data,
      requisite: data.requisite?.trim() || undefined,
      address: data.address?.trim() || undefined,
      phone: data.phone?.trim() || undefined,
      comment: data.comment?.trim() || undefined,
    }
    mutate(cleanedData, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  const onClose = () => {
    reset()
    close()
  }

  return (
    <Dialog
      open={opened}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        Редактировать контрагента
        <DialogClose onClose={onClose} />
      </DialogTitle>
      <DialogContent>
        {isFetching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack
            component="form"
            spacing="24px"
            sx={{ pt: '12px' }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormInput
              name="counterparty"
              control={control}
              label="Контрагент"
              disabled={isLoading}
              placeholder="Введите контрагента"
            />

            <FormInput
              name="name"
              control={control}
              label="Наименование"
              disabled={isLoading}
              placeholder="Введите наименование"
            />

            <FormSelect
              name="type"
              control={control}
              label="Тип"
              disabled={isLoading || isFetchingTypes}
            >
              {counterpartyTypes?.types?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </FormSelect>

            <FormInput
              name="requisite"
              control={control}
              label="ИНН"
              disabled={isLoading}
              placeholder="Введите ИНН (необязательно)"
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
              type="tel"
              placeholder="+992"
            />

            <FormInput
              name="balance"
              control={control}
              label="Баланс"
              disabled={isLoading}
              type="number"
              placeholder="0"
            />

            <FormSelect
              name="status"
              control={control}
              label="Статус"
              disabled={isLoading}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </FormSelect>

            <FormInput
              name="comment"
              control={control}
              label="Комментарий"
              disabled={isLoading}
              multiline
              rows={3}
              placeholder="Введите комментарий (необязательно)"
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
              }}
            >
              Сохранить изменения
            </LoadingButton>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  )
}

