import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { ApiKeys, getApiPaths, postQuery, queryClient } from '@shared/api'
import { DialogClose, FormInput } from '@shared/ui'

import { Dto, schema } from '../model/dto'
import { useStore } from '../model/store'

const defaultValues: Dto = {
  label: '',
}

export const CreateDialog = () => {
  const [opened, close] = useStore((state) => [
    state.createOpened,
    state.closeCreate,
  ])
  
  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Counterparties.createCounterpartyType],
    mutationFn: postQuery(getApiPaths().createCounterpartyType),
    onSuccess() {
      toast.success('Тип контрагента успешно создан')
      queryClient.refetchQueries(ApiKeys.Counterparties.getCounterpartyTypes)
      reset()
      onClose()
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Произошла ошибка при создании типа контрагента')
      }
    },
  })
  
  const {
    control,
    handleSubmit,
    reset,
  } = useForm<Dto>({
    defaultValues,
    resolver: yupResolver(schema),
  })

  const onClose = () => {
    close()
    reset(defaultValues)
  }

  const onSubmit: SubmitHandler<Dto> = async (dto) => {
    // Send as JSON object instead of FormData
    mutate({ label: dto.label })
  }

  return (
    <Dialog
      open={opened}
      onClose={onClose}
      PaperProps={{
        sx: { minWidth: { xs: '328px', mobile: '480px' } }
      }}
    >
      <DialogTitle>Создать тип контрагента</DialogTitle>
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
            Добавить тип контрагента
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

