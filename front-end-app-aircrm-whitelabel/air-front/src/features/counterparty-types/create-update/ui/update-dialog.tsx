import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { AxiosError } from 'axios'
import { useEffect } from 'react'

import { ApiKeys, getApiPaths, putQuery, queryClient } from '@shared/api'
import { DialogClose, FormInput } from '@shared/ui'

import { Dto, schema } from '../model/dto'
import { useStore } from '../model/store'

export const UpdateDialog = () => {
  const [opened, updateItem, close] = useStore((state) => [
    state.updateOpened,
    state.updateOpened,
    state.closeUpdate,
  ])
  
  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Counterparties.updateCounterpartyType, updateItem?.id],
    mutationFn: putQuery(getApiPaths().updateCounterpartyType_ + (updateItem?.id || '')),
    onSuccess() {
      toast.success('Тип контрагента успешно обновлен')
      queryClient.refetchQueries(ApiKeys.Counterparties.getCounterpartyTypes)
      reset()
      onClose()
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Произошла ошибка при обновлении типа контрагента')
      }
    },
  })
  
  const {
    control,
    handleSubmit,
    reset,
  } = useForm<Dto>({
    defaultValues: {
      label: '',
    },
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (updateItem) {
      reset({
        label: updateItem.label,
      })
    }
  }, [updateItem, reset])

  const onClose = () => {
    close()
    reset({
      label: '',
    })
  }

  const onSubmit: SubmitHandler<Dto> = async (dto) => {
    if (!updateItem) return
    // Send as JSON object instead of FormData
    mutate({ label: dto.label })
  }

  return (
    <Dialog
      open={Boolean(opened)}
      onClose={onClose}
      PaperProps={{
        sx: { minWidth: { xs: '328px', mobile: '480px' } }
      }}
    >
      <DialogTitle>Обновить тип контрагента</DialogTitle>
      <DialogClose onClose={onClose} />
      <DialogContent>
        <Stack
          component="form"
          onSubmit={handleSubmit(onSubmit, (error) => console.log(error))}
          spacing="24px"
          sx={{ padding: '16px 0' }}
        >
          <FormInput
            name="label"
            control={control}
            label="Название"
          />
          <LoadingButton
            type="submit"
            fullWidth
            sx={{ mt: '24px' }}
            size="large"
            loading={isLoading}
          >
            Обновить тип контрагента
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

