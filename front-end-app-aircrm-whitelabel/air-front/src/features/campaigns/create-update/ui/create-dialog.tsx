import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'

import { CampaignRuleType } from '@entities/campaign-rule'
import { Api, ApiKeys, postQuery, queryClient } from '@shared/api'
import { DialogClose, FileUploader, FormInput } from '@shared/ui'

import { fileUploadProps } from '../lib/file-upload-props'
import { CreateDto, createSchema } from '../model/dto'
import { useStore } from '../model/store'
import { DateRangePicker } from './date-range-picker'
import { SelectRestaurant } from './select-restaurant'
import { SelectRuleType } from './select-rule-type'

const defaultValues: Record<
  keyof CreateDto,
  string | null | boolean | number[]
> = {
  title: '',
  image: '',
  status: true,
  start_date: null,
  end_date: null,
  start_time: null,
  end_time: null,
  bonus: '',
  rule_type: '',
  restaurant_ids: [],
  total_amount: '',
  description: '',
}

export const CreateDialog = () => {
  const [image, setImage] = useState<File[]>([])
  const [opened, close] = useStore((state) => [
    state.createOpened,
    state.closeCreate,
  ])
  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Campaigns.createCampaign],
    mutationFn: postQuery(Api.createCampaign),
    onSuccess() {
      toast.success('Акция успешно создана')
      queryClient.refetchQueries(ApiKeys.Campaigns.getCampaigns)
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
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateDto>({
    defaultValues: defaultValues as unknown as CreateDto,
    resolver: yupResolver(createSchema),
  })

  const onClose = () => {
    close()
    reset(defaultValues as unknown as CreateDto)
    setImage([])
  }

  const onSubmit: SubmitHandler<CreateDto> = async (dto) => {
    const formData = new FormData()
    formData.append('title', dto.title)
    formData.append('status', dto.status ? '1' : '0')
    formData.append('image', image[0])
    formData.append('start_date', dto.start_date.toString())
    formData.append('end_date', dto.end_date.toString())
    formData.append('start_time', dto.start_time.toString())
    formData.append('end_time', dto.end_time.toString())
    formData.append('rule_type', dto.rule_type)
    formData.append('criteria_bonus', dto.bonus.toString())
    if (dto.rule_type === 'total_order' && dto.total_amount) {
      formData.append('criteria_total_amount', dto.total_amount.toString())
    }
    formData.append('description', dto.description)
    dto.restaurant_ids.forEach((id) => {
      formData.append('restaurant_ids[]', id.toString())
    })
    mutate(formData)
  }

  const startDateTime =
    watch('start_date') && watch('start_time')
      ? dayjs(`${watch('start_date')}T${watch('start_time')}`)
      : null
  const endDateTime =
    watch('end_date') && watch('end_time')
      ? dayjs(`${watch('end_date')}T${watch('end_time')}`)
      : null

  return (
    <Dialog
      open={opened}
      onClose={onClose}
      scroll="body"
    >
      <DialogTitle>Создать акцию</DialogTitle>
      <DialogClose onClose={onClose} />
      <DialogContent>
        <Stack
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          spacing="24px"
          sx={{ padding: '16px 0' }}
        >
          <FileUploader
            name="image"
            control={control}
            files={image}
            setFiles={setImage}
            setValue={setValue}
            errorMessage={errors.image?.message}
            acceptFiles={fileUploadProps.acceptFiles}
            acceptFilesText={fileUploadProps.acceptFilesText}
            maxFileSize={fileUploadProps.maxFileSize}
          />
          <FormInput
            name="title"
            control={control}
            label="Заголовок"
          />
          <DateRangePicker
            startDateTime={startDateTime}
            endDateTime={endDateTime}
            setValue={setValue}
            errors={errors}
          />
          <SelectRestaurant control={control} />
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
            Добавить акцию
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
