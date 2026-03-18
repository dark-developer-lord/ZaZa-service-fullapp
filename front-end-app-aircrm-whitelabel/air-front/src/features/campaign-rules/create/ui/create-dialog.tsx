import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { CampaignRuleType } from '@entities/campaign-rule'
import { Api, ApiKeys, postQuery, queryClient } from '@shared/api'
import { DialogClose, FormInput } from '@shared/ui'

import { CreateDto, createSchema } from '../model/dto'
import { useStore } from '../model/store'
import { SelectRuleType } from './select-rule-type'

const defaultValues: Record<keyof CreateDto, string | null | boolean> = {
  bonus: '',
  rule_type: '',
  total_amount: '',
  description: '',
}

export const CreateDialog = () => {
  const [opened, close] = useStore((state) => [
    state.createOpened,
    state.closeCreate,
  ])
  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Campaigns.createCampaignRule],
    mutationFn: postQuery(Api.createCampaignRule),
    onSuccess() {
      toast.success('Правила акции успешно создана')
      queryClient.refetchQueries(ApiKeys.Campaigns.getCampaignRules)
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
  const { control, handleSubmit, reset, watch } = useForm<CreateDto>({
    defaultValues: defaultValues as unknown as CreateDto,
    resolver: yupResolver(createSchema),
  })

  const onClose = () => {
    close()
    reset(defaultValues as unknown as CreateDto)
  }

  const onSubmit: SubmitHandler<CreateDto> = async (dto) => {
    const formData: {
      rule_type: string
      criteria: { bonus: number; total_amount?: number }
      description: string
    } = {
      rule_type: dto.rule_type,
      criteria: {
        bonus: Number(dto.bonus),
      },
      description: dto.description,
    }
    if (dto.rule_type === CampaignRuleType.total_order) {
      formData.criteria.total_amount = dto.total_amount
    }
    mutate(formData)
  }

  return (
    <Dialog
      open={opened}
      onClose={onClose}
      scroll="body"
    >
      <DialogTitle>Создать правила акции</DialogTitle>
      <DialogClose onClose={onClose} />
      <DialogContent>
        <Stack
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          spacing="24px"
          sx={{ padding: '16px 0' }}
        >
          <SelectRuleType control={control} />
          <FormInput
            name="bonus"
            control={control}
            label="Кол-во баллов"
          />
          {watch('rule_type') === CampaignRuleType.total_order && (
            <FormInput
              name="total_amount"
              control={control}
              label="Общая сумма заказа"
            />
          )}
          <FormInput
            name="description"
            control={control}
            label="Описание"
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
