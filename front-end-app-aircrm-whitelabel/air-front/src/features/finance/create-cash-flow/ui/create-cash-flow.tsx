import { Link, useLocation } from 'react-router-dom'
import {
    Controller,
    SubmitHandler,
    useForm,
} from 'react-hook-form'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { AxiosError } from 'axios'

import toast from 'react-hot-toast'
import {
    Stack,
    Typography,
    Grid,
    TextField,
    Button,
    IconButton,
    useTheme,
    useMediaQuery
} from '@mui/material'
import { Board, FormInput } from '@shared/ui'

import { TransactionTypeSelect } from './transaction-type-select'
import { CategorySelect } from './category-select'
import { SubCategorySelect } from './sub-category-select'
import { WalletSelect } from './wallet-select'

import ArrowLink from '@icons/arrow-link.svg?react'

import { createSchema, CreateDto } from '../model/dto'
import { ApiKeys, getApiPaths, postQuery, queryClient } from '@shared/api'
import { RouterPaths } from '@shared/lib'
import { useGetLoginSource } from '@shared/auth'


const defaultValues: Partial<
  Record<keyof CreateDto, string | number | null>
> = {
  type: '',
  category_id: '',
  subcategory_id: '',
  wallet_id: '',
  name: '',
  amount: '',
  description: ''
}

interface Props {
  /**
   * When true, renders only the form (no Board wrapper / no "ДДС" header row).
   * Useful for Dialog/Modal usage on mobile.
   */
  embedded?: boolean
  /** Optional title for the header row (non-embedded mode). */
  title?: string
  /** Called after successful submit (e.g., close modal). */
  onSuccess?: () => void
}

export const CreateCashFlow = ({ embedded = false, title = 'ДДС', onSuccess }: Props) => {
    const { palette } = useTheme()
    const { pathname } = useLocation()
    const loginSource = useGetLoginSource()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))
    const {
        control,
        watch,
        handleSubmit,
        reset,
    } = useForm<CreateDto>({
      defaultValues: {
        ...defaultValues,
      } as unknown as CreateDto,
      resolver: yupResolver(createSchema),
    })

    const { mutate } = useMutation({
      mutationKey: [ApiKeys.CashFlow.createTransaction],
      mutationFn: postQuery(getApiPaths().submitTransaction)
    })

    const onSubmit: SubmitHandler<CreateDto> = (dto) => {
      const formData = new FormData();
      formData.append('type', dto.type.toString())
      if (dto.subcategory_id) {
        formData.append("transaction_category_id", dto.subcategory_id.toString())
      } else {
        formData.append("transaction_category_id", dto.category_id.toString())
      }
      formData.append("wallet_id", dto.wallet_id.toString())
      formData.append("name", dto.name)
      formData.append("amount", dto.amount.toString())
      if (dto.description) {
        formData.append("description", dto.description)
      }

      mutate(formData, {
        onSuccess() {
          toast.success("Транзакция успешно заведена")
          reset(defaultValues as CreateDto)
          queryClient.refetchQueries(ApiKeys.CashFlow.getTransactions)
          queryClient.refetchQueries(ApiKeys.CashFlow.getMonthlyFinanceStatistic)
          queryClient.refetchQueries(ApiKeys.CashFlow.getWallets)
          queryClient.refetchQueries(ApiKeys.CashFlow.getFinancialCalendar_)
          onSuccess?.()
        },
        onError(error) {
          if (error instanceof AxiosError) {
            toast.error(
              error.response?.data.message || 'Произошла ошибка при создании',
            )
          }
        },
      })
    }

    const Form = (
      <Stack
        component="form"
        onSubmit={handleSubmit(onSubmit, (errors) => { console.log(errors) } ) }
      >
        <Grid container spacing={isMobile ? 2 : 3} >
            <Grid item xs={15} mobile={3}>
              <TransactionTypeSelect control={control} />
            </Grid>
            <Grid item xs={6} mobile={3}>
              <CategorySelect control={control} />
            </Grid>
            <Grid item xs={6} mobile={3}>
              <SubCategorySelect control={control} categoryId={watch('category_id')}/>
            </Grid>
            <Grid item xs={15} mobile={3}>
              <WalletSelect control={control} />
            </Grid>
            <Grid item xs={15} mobile={3}>
                <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormInput
                        control={control}
                        label="Наименование"
                        error={Boolean(fieldState.error)}
                        helperText={fieldState.error?.message}
                        {...field}
                      />
                    )}
                />
            </Grid>
            <Grid item xs={15} mobile={3}>
              <Controller
                name="amount"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    onChange={(e) => {
                      const rawValue = e.target.value
                      const normalized = rawValue.replace(',', '.')
                      field.onChange(normalized)
                    }}
                    label="Сумма"
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={15} mobile={6}>
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Комментарий"
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                    fullWidth
                    multiline
                    rows={isMobile ? 4 : 5}
                    sx={{
                      '& .MuiInputBase-root': {
                        minHeight: isMobile ? '100px' : '120px',
                      }
                    }}
                  />
                )}
              />
            </Grid>
        </Grid>
        <Button
          type="submit"
          size='medium'
          sx={{
            alignSelf: "flex-end",
            mt: {xs: '14px', mobile: '24px'},
            mb: {xs: '14px', mobile: '24px'}
          }}
        >
          Создать
        </Button>
      </Stack>
    )

    if (embedded) return Form

    return (
      <Board>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
          mb={3}
        >
          <Typography variant="h6" component="h3">{title}</Typography>
          { pathname !== RouterPaths.cashFlow && loginSource === 'vendor' && (
            <Link to={RouterPaths.cashFlow}>
              <IconButton>
                <ArrowLink
                    width={24}
                    height={24}
                    stroke={palette.text.secondary}
                />
              </IconButton>
            </Link>
          )}
        </Stack>
        {Form}
      </Board>
    )
}