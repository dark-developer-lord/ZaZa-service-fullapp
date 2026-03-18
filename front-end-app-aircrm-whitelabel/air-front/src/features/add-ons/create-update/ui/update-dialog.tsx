import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { ApiKeys, getApiPaths, postQuery, queryClient } from '@shared/api'
import { DialogClose, FormInput } from '@shared/ui'

import { UpdateDto, updateSchema } from '../model/dto'
import { useStore } from '../model/store'

export const UpdateDialog = () => {
  const [addOn, close] = useStore((state) => [
    state.updateOpened,
    state.closeUpdate,
  ])
  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.AddOns.updateAddOn_ + addOn?.id],
    mutationFn: postQuery(getApiPaths().updateAddOn_ + addOn?.id),
    onSuccess() {
      toast.success('Дополнения успешна изменена')
      queryClient.refetchQueries(ApiKeys.AddOns.getAddOns)
      reset()
      onClose()
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Произошла ошибка')
      }
    },
  })
  const { control, handleSubmit, reset } = useForm<UpdateDto>({
    resolver: yupResolver(updateSchema),
  })

  useEffect(() => {
    if (addOn) {
      reset({
        ...addOn,
        restaurant_id: addOn.restaurant.id,
      })
    }
  }, [addOn, reset])

  const onClose = () => {
    close()
    reset()
  }

  const onSubmit: SubmitHandler<UpdateDto> = async (dto) => {
    mutate(dto)
  }

  return (
    <Dialog
      open={Boolean(addOn)}
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
            label="Название дополнения"
          />
          <FormInput
            name="price"
            control={control}
            label="Цена"
          />
          <LoadingButton
            type="submit"
            fullWidth
            sx={{ mt: '24px' }}
            size="large"
            loading={isLoading}
          >
            Изменить
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
