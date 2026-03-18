import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { SelectStore } from './select-store'
import { ApiKeys, getApiPaths, putQuery, queryClient, VendorApi } from '@shared/api'
import { DialogClose, FormInput } from '@shared/ui'

import { UpdateDto, updateSchema } from '../model/dto'
import { useStore } from '../model/store'
import { useGetLoginSource } from '@shared/auth'

export const UpdateDialog = () => {
  const [attribute, close] = useStore((state) => [
    state.updateOpened,
    state.closeUpdate,
  ])
  const loginSource = useGetLoginSource()
  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Attributes.updateAttribute + attribute?.id],
    mutationFn: putQuery(getApiPaths().updateAttribute_ + attribute?.id),
    onSuccess() {
      toast.success('Атрибут успешно изменен')
      queryClient.refetchQueries(ApiKeys.Attributes.getAttributes)
      reset()
      onClose()
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message ||
            'Произошла ошибка при изменении атрибута',
        )
      }
    },
  })
  const { control, handleSubmit, reset } = useForm<UpdateDto>({
    resolver: yupResolver(updateSchema),
  })

  useEffect(() => {
    if (attribute) {
      reset(attribute)
    }
  }, [attribute, reset])

  const onClose = () => {
    close()
    reset()
  }

  const onSubmit: SubmitHandler<UpdateDto> = async (dto) => {
    mutate(dto)
  }

  return (
    <Dialog
      open={Boolean(attribute)}
      onClose={onClose}
    >
      <DialogTitle>Изменить атрибут</DialogTitle>
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
            label="Название атрибут"
          />
          { loginSource === 'admin' && (
            <SelectStore control={control} />
          )}
          <LoadingButton
            type="submit"
            fullWidth
            sx={{ mt: '24px' }}
            size="large"
            loading={isLoading}
          >
            Изменить атрибут
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
