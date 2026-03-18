import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { ApiKeys, getApiPaths, postQuery, queryClient } from '@shared/api'
import { useProfile } from '@shared/auth'
import { DialogClose, FormInput } from '@shared/ui'

import { CreateDto, createSchema } from '../model/dto'
import { useStore } from '../model/store'
import { SelectRestaurant } from './select-restaurant'

const defaultValues: Record<keyof CreateDto, string | number> = {
  name: '',
  restaurant_id: '',
  price: '',
}

export const CreateDialog = () => {
  const [opened, close] = useStore((state) => [
    state.createOpened,
    state.closeCreate,
  ])
  const [loginSource, profile] = useProfile((state) => [
    state.source,
    state.profile,
  ])
  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.AddOns.createAddOn],
    mutationFn: postQuery(getApiPaths().createAddOn),
    onSuccess() {
      toast.success('Дополнения успешна создана')
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
  const { control, handleSubmit, reset } = useForm<CreateDto>({
    defaultValues: {
      ...defaultValues,
      restaurant_id: 'restaurant' in profile! ? profile.restaurant.id : '',
    } as CreateDto,
    resolver: yupResolver(createSchema),
  })

  const onClose = () => {
    close()
    reset(defaultValues as CreateDto)
  }

  const onSubmit: SubmitHandler<CreateDto> = async (dto) => {
    mutate(dto)
  }

  return (
    <Dialog
      open={opened}
      onClose={onClose}
    >
      <DialogTitle>Добавить дополнение</DialogTitle>
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
          {loginSource === 'admin' && <SelectRestaurant control={control} />}
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
            Добавить
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
