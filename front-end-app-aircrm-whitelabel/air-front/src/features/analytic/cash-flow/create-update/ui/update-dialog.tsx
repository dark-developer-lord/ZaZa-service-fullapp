import { useEffect, useRef } from 'react'
import { Controller, useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  Stack, 
  Grid, 
  TextField, 
  Button,
  DialogActions,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material'

import { FormInput } from '@shared/ui'
import CloseIcon from '@icons/close.svg?react'

import { CreateCashFlowDto, createCashFlowSchema } from '@features/finance'
import { useStore } from '../model/store'
import { useGetTransaction } from '../api/get-transaction'
import { useUpdateTransaction } from '../api/update-transaction'

import { TransactionTypeSelect } from '@features/finance'
import { CategorySelect } from '@features/finance'
import { SubCategorySelect } from '@features/finance'
import { WalletMultiSelect } from '@features/finance/create-cash-flow/ui/wallet-multi-select'

export const UpdateDialog = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))
  const [transactionId, isEditMode, close, setEditMode] = useStore((state) => [
    state.updateOpened,
    state.isEditMode,
    state.closeUpdate,
    state.setEditMode,
  ])
  
  const { data, isLoading } = useGetTransaction(transactionId)
  const { mutate: updateTransaction, isLoading: isUpdating } = useUpdateTransaction(transactionId, () => {
    setEditMode(false)
    close()
  })

  const {
    control,
    watch,
    reset,
    handleSubmit,
    setValue,
  } = useForm<CreateCashFlowDto>({
    resolver: yupResolver(createCashFlowSchema),
    disabled: !isEditMode,
  })

  const watchedCategoryId = watch("category_id")
  const previousCategoryIdRef = useRef<number | null | undefined>(undefined)

  useEffect(() => {
    if (data?.data) {
      const walletIds = data.data.wallets 
        ? data.data.wallets.map(w => w.id)
        : (data.data.wallet_id ? [data.data.wallet_id] : []);
      
      reset({
        type: data.data.type,
        category_id: data.data.category_id,
        subcategory_id: data.data.subcategory_id,
        wallet_id: walletIds[0] || '', // For backward compatibility
        wallet_ids: walletIds,
        name: data.data.name,
        amount: Number(data.data.amount),
        description: data.data.description || '',
      } as any)
      // Set initial category id ref
      previousCategoryIdRef.current = data.data.category_id
    }
  }, [data, reset])

  // Clear subcategory when category changes (but not on initial load)
  useEffect(() => {
    if (!isEditMode) return
    
    // Only clear subcategory if category actually changed (not on initial mount)
    if (previousCategoryIdRef.current !== undefined && 
        watchedCategoryId !== undefined && 
        watchedCategoryId !== previousCategoryIdRef.current &&
        watchedCategoryId !== null) {
      setValue('subcategory_id', null)
    }
    // Update the ref to track the current category
    previousCategoryIdRef.current = watchedCategoryId
  }, [watchedCategoryId, isEditMode, setValue])

  const onClose = () => {
    setEditMode(false)
    close()
    reset()
  }

  const handleEdit = () => {
    setEditMode(true)
  }

  const onSubmit: SubmitHandler<CreateCashFlowDto> = (dto) => {
    updateTransaction(dto)
  }

  return (
    <Dialog
      open={Boolean(transactionId)}
      onClose={onClose}
      PaperProps={{
        sx: { minWidth: { xs: '360px', mobile: '480px' } }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box component="span">Детали транзакции</Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon width={22} height={22} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>Загрузка...</Box>
        ) : (
          <Stack
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ padding: '16px 0' }}
          >
            <Grid container columnSpacing={isMobile ? 2 : 3} rowSpacing={isMobile ? 2 : 3}>
              {/* Тип операции */}
              <Grid item xs={12}>
                <TransactionTypeSelect control={control} disabled={!isEditMode} />
              </Grid>
              
              {/* Категория и Подкатегория on same line */}
              <Grid item xs={6}>
                <CategorySelect control={control} disabled={!isEditMode} />
              </Grid>
              <Grid item xs={6}>
                <SubCategorySelect
                  control={control}
                  categoryId={watch("category_id")}
                  disabled={!isEditMode}
                />
              </Grid>
              
              {/* Кошелек */}
              <Grid item xs={12}>
                <WalletMultiSelect control={control} disabled={!isEditMode} />
              </Grid>
              
              {/* Введите наименование транзакции */}
              <Grid item xs={12}>
                <FormInput
                  name="name"
                  control={control}
                  label="Введите наименование транзакции"
                  disabled={!isEditMode}
                />
              </Grid>
              
              {/* Сумма */}
              <Grid item xs={12}>
                <FormInput
                  name="amount"
                  control={control}
                  label="Сумма"
                  fullWidth
                  disabled={!isEditMode}
                />
              </Grid>
              
              {/* Комментарий */}
              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      label="Комментарий"
                      fullWidth
                      multiline
                      rows={isMobile ? 4 : 5}
                      error={Boolean(fieldState.error)}
                      helperText={fieldState.error?.message}
                      disabled={!isEditMode}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '16px',
                        },
                      }}
                      {...field}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
        <Stack direction="row" spacing={2} width="100%">
          <Button
            variant="outlined"
            onClick={onClose}
            fullWidth
            size={isMobile ? 'medium' : 'large'}
          >
            Отмена
          </Button>
          {!isEditMode ? (
            <Button
              variant="contained"
              onClick={handleEdit}
              fullWidth
              size={isMobile ? 'medium' : 'large'}
            >
              Изменить
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              fullWidth
              size={isMobile ? 'medium' : 'large'}
              disabled={isUpdating}
            >
              Сохранить
            </Button>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
