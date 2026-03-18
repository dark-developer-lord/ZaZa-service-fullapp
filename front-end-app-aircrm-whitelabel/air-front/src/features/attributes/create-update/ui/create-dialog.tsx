import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { ApiKeys, getApiPaths, postQuery, queryClient } from '@shared/api'
import { DialogClose, FormInput } from '@shared/ui'
import { SelectStore } from './select-store'

import { CreateDto, createSchema } from '../model/dto'
import { useStore } from '../model/store'
import { useGetLoginSource } from '@shared/auth'

const defaultValues: CreateDto = {
  name: '',
  store_id: null
}

export const CreateDialog = () => {
  const [opened, close] = useStore((state) => [
    state.createOpened,
    state.closeCreate,
  ])
  const loginSource = useGetLoginSource()
  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Attributes.createAttribute],
    mutationFn: postQuery(getApiPaths().createAttribute),
    onSuccess() {
      toast.success('Атрибут успешно создан')
      queryClient.refetchQueries(ApiKeys.Attributes.getAttributes)
      reset()
      onClose()
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message || 'Произошла ошибка при создании',
        )
      }
    },
  })
  const { control, handleSubmit, reset } = useForm<CreateDto>({
    defaultValues,
    resolver: yupResolver(createSchema),
  })

  const onClose = () => {
    close()
    reset(defaultValues)
  }

  const onSubmit: SubmitHandler<CreateDto> = async (dto) => {
    mutate(dto)
  }

  return (
    <Dialog
      open={opened}
      onClose={onClose}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
          e.stopPropagation()
        }
      }}
    >
      <DialogTitle>Создать атрибут</DialogTitle>
      <DialogClose onClose={onClose} />
      <DialogContent>
        <Stack
          component="form"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleSubmit(onSubmit)(e)
          }}
          spacing="24px"
          sx={{ padding: '16px 0' }}
        >
          <FormInput
            name="name"
            control={control}
            label="Название атрибута"
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
            Добавить атрибут
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
