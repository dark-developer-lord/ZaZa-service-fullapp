import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { FormHelperText, Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { Api, ApiKeys, postQuery, queryClient } from '@shared/api'
import { RouterPaths } from '@shared/lib'
import { Board, FormInput } from '@shared/ui'

import { Dto, schema } from '../model/dto'
import { Map } from './map'

const defaultValues: Dto = {
  name: '',
  coordinates: '',
  minimum_delivery_charge: 0,
  per_km_delivery_charge: 0,
}

export const Form = () => {
  const navigate = useNavigate()
  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Common.createZone],
    mutationFn: postQuery(Api.createZone),
    onSuccess: () => {
      toast.success('Зона успешно создана')
      queryClient.refetchQueries({
        queryKey: [ApiKeys.Common.zones],
      })
      navigate(RouterPaths.zones)
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message || 'Произошла ошибка при создании',
        )
      }
    },
  })
  const {
    formState: { errors },
    control,
    setValue,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  })

  const onSubmit: SubmitHandler<Dto> = (data) => {
    mutate(data)
  }

  return (
    <Board>
      <Stack
        spacing="24px"
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Map setValue={setValue} />
        <FormHelperText error>{errors.coordinates?.message}</FormHelperText>
        <FormInput
          name="name"
          control={control}
          label="Зона"
        />
        <FormInput
          name="coordinates"
          control={control}
          label="Координаты"
          type="hidden"
          sx={{ display: 'none' }}
        />
        <LoadingButton
          type="submit"
          size="large"
          loading={isLoading}
        >
          Отправить
        </LoadingButton>
      </Stack>
    </Board>
  )
}
