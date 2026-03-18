import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Dialog, DialogContent, DialogTitle, Stack, MenuItem, IconButton, Box } from '@mui/material'
import { AxiosError } from 'axios'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import { ApiKeys, postQuery, queryClient, VendorApi } from '@shared/api'
import { DialogClose, FormInput, FormSelect } from '@shared/ui'
import { CounterpartyDto, counterpartySchema } from '@features/counterparties/create/model/dto'

import { useStore } from '../model/store'
import { useGetCounterpartyTypes } from '../api/get-counterparty-types'

const defaultValues: CounterpartyDto = {
  counterparty: '',
  name: '',
  type: '',
  requisite: '',
  address: '',
  phone: '',
  balance: 0,
  comment: '',
  status: 'active',
}

// Status options
const statusOptions = [
  { value: 'active', label: 'Активный' },
  { value: 'inactive', label: 'Неактивный' },
]

export const CreateCounterpartyModal = () => {
  const [opened, returnToSchedule, closeCreateCounterparty] = useStore((state) => [
    state.createCounterpartyOpened,
    state.returnToSchedule,
    state.closeCreateCounterparty,
  ])

  const { data: counterpartyTypes, isFetching: isFetchingTypes } = useGetCounterpartyTypes()

  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Counterparties.createCounterparty],
    mutationFn: postQuery<CounterpartyDto, { data: any }>(VendorApi.createCounterparty),
    onSuccess() {
      toast.success('Контрагент успешно создан')
      queryClient.refetchQueries(ApiKeys.Counterparties.getCounterparties)
      queryClient.refetchQueries(ApiKeys.Counterparties.searchCounterparties)
      reset()
      returnToSchedule()
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Произошла ошибка при создании контрагента')
      }
    },
  })

  const { control, handleSubmit, reset } = useForm<CounterpartyDto>({
    defaultValues,
    resolver: yupResolver(counterpartySchema),
  })

  const onSubmit: SubmitHandler<CounterpartyDto> = (data) => {
    const cleanedData = {
      ...data,
      requisite: data.requisite?.trim() || undefined,
      address: data.address?.trim() || undefined,
      phone: data.phone?.trim() || undefined,
      comment: data.comment?.trim() || undefined,
    }
    mutate(cleanedData)
  }

  const onClose = () => {
    reset()
    closeCreateCounterparty()
  }

  const handleBack = () => {
    returnToSchedule()
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={handleBack}
            size="small"
            sx={{
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(0, 84, 86, 0.08)',
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <span>Новый контрагент</span>
        </Box>
        <DialogClose onClose={onClose} />
      </DialogTitle>
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
            Создать контрагента
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

