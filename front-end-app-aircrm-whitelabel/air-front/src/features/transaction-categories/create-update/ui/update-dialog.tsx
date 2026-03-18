import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { DialogClose, FormInput } from '@shared/ui'

import { AxiosError } from 'axios'

import { ApiKeys, postQuery, queryClient, getApiPaths } from '@shared/api'

import { Dto, schema } from '../model/dto'
import { useStore } from '../model/store'

export const UpdateDialog = () => {
  const [category, close] = useStore((state) => [
    state.updateOpened,
    state.closeUpdate,
  ])
  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.CashFlow.updateTransactionCategory_ + category?.id],
    mutationFn: postQuery(getApiPaths().updateTransactionCategory_ + category?.id),
    onSuccess() {
      toast.success('Категория успешно изменена')
      queryClient.refetchQueries(ApiKeys.CashFlow.getTransactionCategories)
      reset()
      onClose()
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message)
      }
    },
  })
  const {
    control,
    handleSubmit,
    reset,
  } = useForm<Dto>({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (category) {
      reset({
        ...category,
      })
    }
  }, [category, reset])

  const onClose = () => {
    close()
    reset()
  }

  const onSubmit: SubmitHandler<Dto> = async (dto) => {
    const formData = new FormData()
    formData.append('name', dto.name)
    formData.append('parent_id', dto.parent_id.toString())
    formData.append('_method', 'put')
    mutate(formData)
  }

  return (
    <Dialog
      open={Boolean(category)}
      onClose={onClose}
    >
      <DialogTitle>Изменить категорию</DialogTitle>
      <DialogClose onClose={onClose} />
      <DialogContent>
        <Stack
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          spacing="24px"
          sx={{ padding: '16px 0' }}
        >
          <FormInput
            name="name"
            control={control}
            label="Название категории"
          />
          <LoadingButton
            type="submit"
            fullWidth
            sx={{ mt: '24px' }}
            size="large"
            loading={isLoading}
          >
            Изменить категорию
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
