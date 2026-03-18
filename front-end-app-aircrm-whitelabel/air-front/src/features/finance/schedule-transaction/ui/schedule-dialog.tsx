import { useEffect, useState } from 'react'
import { SubmitHandler, useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import dayjs from 'dayjs'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
  CircularProgress,
  Typography,
  IconButton,
  Divider,
  InputLabel,
  Select,
  FormHelperText,
} from '@mui/material'
import { AxiosError } from 'axios'

import { ApiKeys, getApiPaths, postQuery, queryClient, VendorApi } from '@shared/api'
import { DialogClose, FormSelect, FormInput, FormDateInput } from '@shared/ui'
import { useGetTransactionType } from '@features/finance/create-cash-flow/api/get-transaction-types'
import { useGetTransactionCategories } from '@features/finance/create-cash-flow/api/get-transaction-categories'
import { useGetTransactionSubCategories } from '@features/finance/create-cash-flow/api/get-transaction-subcategories'
import AddIcon from '@icons/add-fill.svg?react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Dto as CategoryDto, schema as categorySchema } from '@features/transaction-categories/create-update/model/dto'
import { Dto as SubCategoryDto, schema as subCategorySchema } from '@features/transaction-sub-categories/create-update/model/dto'

import { ScheduleTransactionDto, scheduleTransactionSchema } from '../model/dto'
import { useStore } from '../model/store'
import { useGetCounterpartyTypes } from '../api/get-counterparty-types'
import { useGetCycleTypes } from '../api/get-cycle-types'
import { CounterpartySearch } from './counterparty-search'
import { CreateCounterpartyModal } from './create-counterparty-modal'

const defaultValues: ScheduleTransactionDto = {
  counterparty_type: '',
  counterparty_id: 0,
  transaction_type: '',
  transaction_category_id: 0,
  subcategory_id: null,
  amount: 0,
  cycle_type: 'one_time',
  scheduled_date: '',
  end_date: null,
  description: null,
}

export const ScheduleDialog = () => {
  const [opened, close, openCreateCounterparty, cachedFormData] = useStore((state) => [
    state.scheduleOpened,
    state.closeSchedule,
    state.openCreateCounterparty,
    state.cachedFormData,
  ])

  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0)
  const [activeView, setActiveView] = useState<'form' | 'createCategory' | 'createSubcategory'>('form')

  const { data: counterpartyTypes, isFetching: isFetchingCounterpartyTypes } = useGetCounterpartyTypes()
  const { data: transactionTypes, isFetching: isFetchingTypes } = useGetTransactionType()
  const { data: categories, isFetching: isFetchingCategories } = useGetTransactionCategories()
  const { data: subcategories, isFetching: isFetchingSubcategories } = useGetTransactionSubCategories(selectedCategoryId)
  const { data: cycleTypes, isFetching: isFetchingCycleTypes } = useGetCycleTypes()

  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.CashFlow.scheduleTransaction],
    mutationFn: postQuery<ScheduleTransactionDto, { data: any }>(VendorApi.scheduleTransaction),
    onSuccess() {
      toast.success('Транзакция успешно запланирована')
      queryClient.refetchQueries(ApiKeys.CashFlow.getFinancialCalendar_)
      queryClient.refetchQueries(ApiKeys.CashFlow.getTransactions)
      queryClient.refetchQueries(ApiKeys.CashFlow.getScheduledTransactionsCalendar_)
      queryClient.refetchQueries(ApiKeys.CashFlow.getAvailableWallets)
      // Close modal and reset form
      onClose()
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Произошла ошибка при планировании транзакции')
      }
    },
  })

  // Create category form
  const {
    control: categoryControl,
    handleSubmit: handleSubmitCategory,
    reset: resetCategoryForm,
  } = useForm<CategoryDto>({
    defaultValues: {
      name: '',
      parent_id: 0,
    },
    resolver: yupResolver(categorySchema),
  })

  const {
    control: subCategoryControl,
    handleSubmit: handleSubmitSubCategory,
    reset: resetSubCategoryForm,
  } = useForm<SubCategoryDto>({
    defaultValues: {
      name: '',
      parent_id: 0,
    },
    resolver: yupResolver(subCategorySchema),
  })

  const { mutate: createCategory, isLoading: isCreatingCategory } = useMutation({
    mutationKey: [ApiKeys.CashFlow.createTransactionCategory],
    mutationFn: postQuery(getApiPaths().createTransactionCategory),
    onSuccess() {
      toast.success('Категория успешно создана')
      queryClient.refetchQueries(ApiKeys.CashFlow.getTransactionCategories)
      resetCategoryForm({
        name: '',
        parent_id: 0,
      })
      setActiveView('form')
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message)
      }
    },
  })

  const { mutate: createSubCategory, isLoading: isCreatingSubCategory } = useMutation({
    mutationKey: [ApiKeys.CashFlow.createTransactionCategory],
    mutationFn: postQuery(getApiPaths().createTransactionCategory),
    onSuccess() {
      toast.success('Подкатегория успешно создана')
      // Invalidate subcategory list for the currently selected category
      if (selectedCategoryId) {
        queryClient.invalidateQueries({
          queryKey: [ApiKeys.CashFlow.getTransactionSubCategories_, selectedCategoryId],
        })
      } else {
        // Fallback: invalidate all subcategory queries
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === ApiKeys.CashFlow.getTransactionSubCategories_,
        })
      }
      resetSubCategoryForm({
        name: '',
        parent_id: selectedCategoryId || 0,
      })
      setActiveView('form')
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message)
      }
    },
  })

  const { control, handleSubmit, reset, watch, setValue, getValues } = useForm<ScheduleTransactionDto>({
    defaultValues,
    resolver: yupResolver(scheduleTransactionSchema),
  })

  const watchedCategoryId = watch('transaction_category_id')
  const watchedCycleType = watch('cycle_type')
  const watchedCounterpartyType = watch('counterparty_type')

  // Restore cached form data when returning from create counterparty modal
  useEffect(() => {
    if (opened && cachedFormData) {
      Object.keys(cachedFormData).forEach((key) => {
        const value = cachedFormData[key as keyof ScheduleTransactionDto]
        if (value !== undefined) {
          setValue(key as any, value)
        }
      })
      if (cachedFormData.transaction_category_id) {
        setSelectedCategoryId(cachedFormData.transaction_category_id)
      }
    }
  }, [opened, cachedFormData, setValue])

  // Update selected category when form value changes
  useEffect(() => {
    if (watchedCategoryId && watchedCategoryId !== selectedCategoryId) {
      setSelectedCategoryId(watchedCategoryId)
      // Reset subcategory when category changes
      setValue('subcategory_id', null)
    }
  }, [watchedCategoryId, selectedCategoryId, setValue])

  // Reset counterparty selection when counterparty type changes
  useEffect(() => {
    setValue('counterparty_id', 0)
  }, [watchedCounterpartyType, setValue])

  const handleCreateCategorySubmit: SubmitHandler<CategoryDto> = (dto) => {
    const formData = new FormData()
    formData.append('name', dto.name)
    formData.append('parent_id', '0')
    createCategory(formData)
  }

  const handleCreateSubCategorySubmit: SubmitHandler<SubCategoryDto> = (dto) => {
    const parentId = watchedCategoryId || selectedCategoryId || dto.parent_id || 0
    const formData = new FormData()
    formData.append('name', dto.name)
    formData.append('parent_id', parentId.toString())
    createSubCategory(formData)
  }

  const onSubmit: SubmitHandler<ScheduleTransactionDto> = (data) => {
    // FormDateInput already returns date in DD.MM.YYYY format
    mutate(data)
  }

  const onClose = () => {
    reset()
    setSelectedCategoryId(0)
    setActiveView('form')
    close()
  }

  const handleAddCounterparty = () => {
    // Save current form data before opening create counterparty modal
    const currentFormData = getValues()
    openCreateCounterparty(currentFormData)
  }

  return (
    <>
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
        {activeView === 'form' && (
          <>
            Запланировать транзакцию
            <DialogClose onClose={onClose} />
          </>
        )}
        {activeView === 'createCategory' && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={() => setActiveView('form')}
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
            <span>Создать категорию</span>
            <DialogClose onClose={onClose} />
          </Box>
        )}
        {activeView === 'createSubcategory' && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={() => setActiveView('form')}
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
            <span>Создать подкатегорию</span>
            <DialogClose onClose={onClose} />
          </Box>
        )}
      </DialogTitle>
      <DialogContent>
        {activeView === 'form' && (
        <Stack
          component="form"
          spacing="24px"
          sx={{ pt: '12px' }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormSelect
            name="counterparty_type"
            control={control}
            label="Тип контрагента"
            disabled={isLoading || isFetchingCounterpartyTypes}
          >
            {counterpartyTypes?.types?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </FormSelect>

          <CounterpartySearch
            name="counterparty_id"
            control={control}
            label="Контрагент"
            disabled={isLoading || !watchedCounterpartyType}
            onAddClick={handleAddCounterparty}
            counterpartyType={watchedCounterpartyType}
          />

          <FormSelect
            name="transaction_type"
            control={control}
            label="Тип транзакции"
            disabled={isLoading || isFetchingTypes}
          >
            {transactionTypes?.data.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </FormSelect>

          <FormControl fullWidth disabled={isLoading || isFetchingCategories}>
            <InputLabel id="schedule-category-select">Категория</InputLabel>
            <Controller
              name="transaction_category_id"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Select
                    {...field}
                    labelId="schedule-category-select"
                    label="Категория"
                    error={Boolean(fieldState.error)}
                    onChange={(e) => {
                      if (e.target.value === 'create_new') {
                        setActiveView('createCategory')
                        return
                      }
                      field.onChange(e)
                    }}
                  >
                    {categories?.data.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                    <Divider />
                    <MenuItem value="create_new" sx={{ color: 'primary.main' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AddIcon width={20} height={20} fill="currentColor" />
                        <span>Создать категорию</span>
                      </Box>
                    </MenuItem>
                  </Select>
                  <FormHelperText error>{fieldState.error?.message}</FormHelperText>
                </>
              )}
            />
          </FormControl>

          <FormControl
            fullWidth
            disabled={isLoading || isFetchingSubcategories || !selectedCategoryId}
          >
            <InputLabel id="schedule-subcategory-select">Подкатегория</InputLabel>
            <Controller
              name="subcategory_id"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Select
                    {...field}
                    labelId="schedule-subcategory-select"
                    label="Подкатегория"
                    error={Boolean(fieldState.error)}
                    onChange={(e) => {
                      if (e.target.value === 'create_new') {
                        setActiveView('createSubcategory')
                        return
                      }
                      field.onChange(e)
                    }}
                  >
                    {subcategories?.data.map((subcategory) => (
                      <MenuItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </MenuItem>
                    ))}
                    <Divider />
                    <MenuItem value="create_new" sx={{ color: 'primary.main' }} disabled={!selectedCategoryId}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AddIcon width={20} height={20} fill="currentColor" />
                        <span>Создать подкатегорию</span>
                      </Box>
                    </MenuItem>
                  </Select>
                  <FormHelperText error>{fieldState.error?.message}</FormHelperText>
                </>
              )}
            />
          </FormControl>

          <FormInput
            name="amount"
            control={control}
            label="Сумма"
            disabled={isLoading}
            type="number"
            placeholder="0"
          />

          <FormDateInput
            name="scheduled_date"
            control={control}
            label="Запланированная дата"
            disabled={isLoading}
            placeholder="ДД.ММ.ГГГГ"
            minDate={dayjs()}
            readOnly={true}
          />

          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ mb: 1, fontSize: '14px', fontWeight: 500 }}>
              Выберите цикличность
            </FormLabel>
            {isFetchingCycleTypes ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 2 }}>
                <CircularProgress size={20} />
                <Typography variant="body2" color="text.secondary">
                  Загрузка...
                </Typography>
              </Box>
            ) : (
              <RadioGroup
                value={watchedCycleType}
                onChange={(e) => {
                  setValue('cycle_type', e.target.value as any)
                  // Clear end_date when switching back to one_time
                  if (e.target.value === 'one_time') {
                    setValue('end_date', null)
                  }
                }}
              >
                {cycleTypes?.map((cycleType) => (
                  <FormControlLabel
                    key={cycleType.value}
                    value={cycleType.value}
                    control={<Radio />}
                    label={cycleType.label}
                    disabled={isLoading}
                  />
                ))}
              </RadioGroup>
            )}
          </FormControl>

          {watchedCycleType && watchedCycleType !== 'one_time' && (
            <FormDateInput
              name="end_date"
              control={control}
              label="Дата окончания"
              disabled={isLoading}
              placeholder="ДД.ММ.ГГГГ"
              minDate={watch('scheduled_date') ? dayjs(watch('scheduled_date'), 'DD.MM.YYYY') : dayjs()}
              readOnly={true}
            />
          )}

          <FormInput
            name="description"
            control={control}
            label="Комментарий"
            disabled={isLoading}
            multiline
            rows={3}
            placeholder="Введите комментарий (необязательно)"
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              fullWidth
              disabled={isLoading}
              sx={{
                borderRadius: 1,
                textTransform: 'none',
                fontSize: '16px',
                py: 1.5,
              }}
            >
              Отмена
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isLoading}
              fullWidth
              sx={{
                borderRadius: 1,
                textTransform: 'none',
                fontSize: '16px',
                py: 1.5,
              }}
            >
              Добавить
            </LoadingButton>
          </Box>
        </Stack>
        )}

        {activeView === 'createCategory' && (
          <Stack
            component="form"
            spacing="24px"
            sx={{ pt: '12px' }}
            onSubmit={handleSubmitCategory(handleCreateCategorySubmit)}
          >
            <FormInput
              name="name"
              control={categoryControl}
              label="Название категории"
              disabled={isCreatingCategory}
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setActiveView('form')}
                fullWidth
                disabled={isCreatingCategory}
                sx={{
                  borderRadius: 1,
                  textTransform: 'none',
                  fontSize: '16px',
                  py: 1.5,
                }}
              >
                Назад
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isCreatingCategory}
                fullWidth
                sx={{
                  borderRadius: 1,
                  textTransform: 'none',
                  fontSize: '16px',
                  py: 1.5,
                }}
              >
                Добавить категорию
              </LoadingButton>
            </Box>
          </Stack>
        )}

        {activeView === 'createSubcategory' && (
          <Stack
            component="form"
            spacing="24px"
            sx={{ pt: '12px' }}
            onSubmit={handleSubmitSubCategory(handleCreateSubCategorySubmit)}
          >
            <FormInput
              name="name"
              control={subCategoryControl}
              label="Название подкатегории"
              disabled={isCreatingSubCategory}
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setActiveView('form')}
                fullWidth
                disabled={isCreatingSubCategory}
                sx={{
                  borderRadius: 1,
                  textTransform: 'none',
                  fontSize: '16px',
                  py: 1.5,
                }}
              >
                Назад
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isCreatingSubCategory}
                fullWidth
                sx={{
                  borderRadius: 1,
                  textTransform: 'none',
                  fontSize: '16px',
                  py: 1.5,
                }}
              >
                Добавить подкатегорию
              </LoadingButton>
            </Box>
          </Stack>
        )}
      </DialogContent>
    </Dialog>

    <CreateCounterpartyModal />
    </>
  )
}

