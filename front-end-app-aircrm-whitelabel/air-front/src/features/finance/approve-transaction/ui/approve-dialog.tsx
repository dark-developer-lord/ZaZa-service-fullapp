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
  Stack,
  MenuItem,
  Button,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material'
import { AxiosError } from 'axios'

import { ApiKeys, deleteQuery, postQuery, putQuery, queryClient, VendorApi } from '@shared/api'
import { DialogClose, FormInput, FormSelect } from '@shared/ui'
import { useGetAvailableWallets } from '@features/pos-terminal/api/get-available-wallets'
import { useGetTransactionType } from '@features/finance/create-cash-flow/api/get-transaction-types'
import { palette } from '@shared/theme/palette'
import { useProfile } from '@shared/auth'
import { TransactionApproval } from '@pages/financial-overview/api/get-transaction-approvals'

import {
  ApproveTransactionDto,
  approveTransactionSchema,
  UpdateTransactionScheduleDto,
  updateTransactionScheduleSchema
} from '../model/dto'
import { useStore } from '../model/store'

const approveDefaultValues: ApproveTransactionDto = {
  wallet_id: 0 as any,
  approval_date: '',
  description: null,
}

const updateDefaultValues: UpdateTransactionScheduleDto = {
  transaction_type: '',
  amount: 0,
}

export const ApproveDialog = () => {
  const [opened, close, selectedTransaction, updateSelectedTransaction] = useStore((state) => [
    state.approveOpened,
    state.closeApprove,
    state.selectedTransaction,
    state.updateSelectedTransaction,
  ])

  const [isEditing, setIsEditing] = useState(false)
  const source = useProfile((profile) => profile.source)

  const { data: wallets, isFetching: isFetchingWallets } = useGetAvailableWallets()
  const { data: transactionTypes, isFetching: isFetchingTypes } = useGetTransactionType()

  // Update mutation
  const { mutate: updateMutate, isLoading: isUpdating } = useMutation({
    mutationKey: [ApiKeys.CashFlow.updateTransactionSchedule],
    mutationFn: (data: UpdateTransactionScheduleDto) =>
      putQuery<UpdateTransactionScheduleDto, { data: any }>(`${VendorApi.updateTransactionSchedule_}${selectedTransaction?.id}`)(data),
    onSuccess(_, variables) {
      toast.success('Транзакция успешно обновлена')
      setIsEditing(false)
      // Update selectedTransaction immediately with new values
      if (selectedTransaction) {
        updateSelectedTransaction({
          ...selectedTransaction,
          transaction_type: variables.transaction_type as string,
          amount: variables.amount.toString(),
        })
      }
      refetchAll().then(() => {
        // Try to find updated transaction from refetched data to get any server-side computed values
        if (selectedTransaction) {
          const queryCache = queryClient.getQueryCache()
          const transactionApprovalQueries = queryCache.findAll({
            queryKey: [ApiKeys.CashFlow.getTransactionApprovals],
          })
          
          for (const query of transactionApprovalQueries) {
            const data = query.state.data as { approvals?: TransactionApproval[] } | undefined
            if (data?.approvals) {
              const updatedTransaction = data.approvals.find((t) => t.id === selectedTransaction.id)
              if (updatedTransaction) {
                updateSelectedTransaction(updatedTransaction)
                break
              }
            }
          }
        }
      })
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Произошла ошибка при обновлении транзакции')
      }
    },
  })

  // Delete mutation
  const { mutate: deleteMutate, isLoading: isDeleting } = useMutation({
    mutationKey: [ApiKeys.CashFlow.deleteTransactionSchedule],
    mutationFn: (() => deleteQuery(`${VendorApi.deleteTransactionSchedule_}${selectedTransaction?.id}`)) as any,
    onSuccess() {
      toast.success('Транзакция успешно удалена')
      refetchAll()
      onClose()
    },
    onError(error: any) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Произошла ошибка при удалении транзакции')
      }
    },
  })

  // Approve mutation
  const { mutate: approveMutate, isLoading: isApproving } = useMutation({
    mutationKey: [ApiKeys.CashFlow.approveTransaction],
    mutationFn: (data: ApproveTransactionDto) =>
      postQuery<ApproveTransactionDto, { data: any }>(`${VendorApi.approveTransaction}/${selectedTransaction?.id}`)(data),
    onSuccess() {
      toast.success('Транзакция успешно подтверждена')
      approveReset()
      refetchAll().then(() => {
        // Close the approve dialog after refetching
        close()
      })
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Произошла ошибка при подтверждении транзакции')
      }
    },
  })

  const refetchAll = async () => {
    await Promise.all([
      queryClient.refetchQueries(ApiKeys.CashFlow.getTransactionApprovals),
      queryClient.refetchQueries(ApiKeys.CashFlow.getScheduledTransactionsCalendar_),
      queryClient.refetchQueries(ApiKeys.CashFlow.getFinancialCalendar_),
      queryClient.refetchQueries(ApiKeys.CashFlow.getTransactions),
      queryClient.refetchQueries(ApiKeys.CashFlow.getAvailableWallets),
    ])
    
    // Find and update the selected transaction from the refetched data
    if (selectedTransaction) {
      const queryCache = queryClient.getQueryCache()
      const transactionApprovalQueries = queryCache.findAll({
        queryKey: [ApiKeys.CashFlow.getTransactionApprovals],
      })
      
      for (const query of transactionApprovalQueries) {
        const data = query.state.data as { approvals?: TransactionApproval[] } | undefined
        if (data?.approvals) {
          const updatedTransaction = data.approvals.find((t) => t.id === selectedTransaction.id)
          if (updatedTransaction) {
            updateSelectedTransaction(updatedTransaction)
            break
          }
        }
      }
    }
  }

  // Form for updating transaction
  const { control: updateControl, handleSubmit: handleUpdateSubmit, reset: updateReset, setValue: setUpdateValue } = useForm<UpdateTransactionScheduleDto>({
    defaultValues: updateDefaultValues,
    resolver: yupResolver(updateTransactionScheduleSchema),
  })

  // Form for approving transaction
  const { control: approveControl, handleSubmit: handleApproveSubmit, reset: approveReset, setValue: setApproveValue } = useForm<ApproveTransactionDto>({
    defaultValues: approveDefaultValues,
    resolver: yupResolver(approveTransactionSchema),
  })

  // Pre-fill forms when modal opens or transaction changes
  useEffect(() => {
    if (opened && selectedTransaction && !isEditing) {
      // Pre-fill update form
      setUpdateValue('transaction_type', selectedTransaction.transaction_type)
      setUpdateValue('amount', parseFloat(selectedTransaction.amount))

      // Pre-fill approve form
      if (selectedTransaction.approval_date) {
        setApproveValue('approval_date', selectedTransaction.approval_date)
      }
      if (selectedTransaction.wallet_id) {
        setApproveValue('wallet_id', selectedTransaction.wallet_id)
      }
    }
  }, [opened, selectedTransaction, setUpdateValue, setApproveValue, isEditing])

  const onUpdateSubmit: SubmitHandler<UpdateTransactionScheduleDto> = (data) => {
    updateMutate(data)
  }

  const onApproveSubmit: SubmitHandler<ApproveTransactionDto> = (data) => {
    approveMutate(data)
  }

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить эту транзакцию?')) {
      deleteMutate()
    }
  }

  const onClose = () => {
    updateReset()
    approveReset()
    setIsEditing(false)
    close()
  }

  if (!selectedTransaction) return null

  const isLoading = isUpdating || isDeleting || isApproving

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
        Подтвердить транзакцию
        <DialogClose onClose={onClose} />
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ pt: '12px' }}>
          {/* Editable Form Fields */}
          <Stack
            component="form"
            spacing={3}
            onSubmit={handleUpdateSubmit(onUpdateSubmit)}
          >
            {/* Transaction Type - Editable */}
            <FormSelect
              name="transaction_type"
              control={updateControl}
              label="Тип транзакции"
              disabled={!isEditing || isLoading || isFetchingTypes}
            >
              {transactionTypes?.data.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </FormSelect>

            {/* Amount - Editable */}
            <FormInput
              name="amount"
              control={updateControl}
              label="Сумма"
              disabled={!isEditing || isLoading}
              type="number"
              placeholder="0"
            />

            {/* Edit/Save Button */}
            {!isEditing ? (
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
              >
                Редактировать
              </Button>
            ) : (
              <LoadingButton
                type="submit"
                variant="contained"
                fullWidth
                loading={isUpdating}
                disabled={isLoading}
              >
                Сохранить изменения
              </LoadingButton>
            )}
          </Stack>

          {/* Wallet Selection and Approve Form */}
          <Stack
            component="form"
            spacing={3}
            onSubmit={handleApproveSubmit(onApproveSubmit)}
          >
            {isFetchingWallets ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 2 }}>
                <CircularProgress size={20} />
              </Box>
            ) : (
              <FormSelect
                name="wallet_id"
                control={approveControl}
                label="Выберите кошелек"
                disabled={isLoading}
                valueAsNumber
              >
                {wallets?.wallets?.map((wallet) => (
                  <MenuItem key={wallet.vendor_wallet_id} value={wallet.vendor_wallet_id}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <Typography>{wallet.name}</Typography>
                      <Typography
                        sx={{
                          color: wallet.total_amount < 0 ? palette.error.main : palette.success.main,
                          fontWeight: 600,
                        }}
                      >
                        {wallet.total_amount.toLocaleString()} с.
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </FormSelect>
            )}

            {/* Notes/Comment Field */}
            <FormInput
              name="description"
              control={approveControl}
              label="Комментарий"
              disabled={isLoading}
              multiline
              rows={3}
              placeholder="Введите комментарий (необязательно)"
            />

            {/* Action Buttons */}
            <Stack direction="row" spacing={2}>
              <LoadingButton
                type="submit"
                variant="contained"
                fullWidth
                loading={isApproving}
                disabled={isLoading}
                sx={{ bgcolor: 'primary.main' }}
              >
                Подтвердить
              </LoadingButton>

              <LoadingButton
                variant="outlined"
                color="error"
                fullWidth
                loading={isDeleting}
                disabled={isLoading}
                onClick={handleDelete}
              >
                Удалить
              </LoadingButton>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
