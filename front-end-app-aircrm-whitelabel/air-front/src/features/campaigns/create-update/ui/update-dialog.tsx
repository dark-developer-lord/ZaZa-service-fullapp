import { useEffect, useState } from 'react'
import { SubmitHandler, useForm, UseFormSetValue } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'

import { Api, ApiKeys, postQuery, queryClient } from '@shared/api'
import { DialogClose, FileUploader, FormInput } from '@shared/ui'

import { fileUploadProps } from '../lib/file-upload-props'
import { CreateDto, UpdateDto, updateSchema } from '../model/dto'
import { useStore } from '../model/store'
import { DateRangePicker } from './date-range-picker'

const defaultValues: Record<
  keyof UpdateDto,
  string | number | boolean | number[]
> = {
  title: '',
  image: '',
  status: true,
  start_date: '',
  end_date: '',
  start_time: '',
  end_time: '',
  description: '',
  rule_type: '',
  bonus: '',
  total_amount: '',
  restaurant_ids: [],
}

export const UpdateDialog = () => {
  const [image, setImage] = useState<File[]>([])
  const [campaign, close] = useStore((state) => [
    state.updateOpened,
    state.closeUpdate,
  ])
  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Campaigns.updateCampaign_ + campaign?.id],
    mutationFn: postQuery(Api.updateCampaign_ + campaign?.id),
    onSuccess() {
      toast.success('Акция успешно изменена')
      queryClient.refetchQueries(ApiKeys.Campaigns.getCampaigns)
      reset()
      onClose()
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message || 'Произошла ошибка при изменении',
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
  } = useForm<UpdateDto>({
    defaultValues: defaultValues as unknown as UpdateDto,
    resolver: yupResolver(updateSchema),
  })


  useEffect(() => {
    if (campaign) {
      reset({
        title: campaign.title,
        status: campaign.status,
        start_date: dayjs(campaign.start_date).format('YYYY-MM-DD'),
        end_date: dayjs(campaign.end_date).format('YYYY-MM-DD'),
        start_time: dayjs(campaign.start_time, 'HH:mm').format('HH:mm'),
        end_time: dayjs(campaign.end_time, 'HH:mm').format('HH:mm'),
        description: campaign.description,
      })
    }
  }, [campaign, reset])

  const onClose = () => {
    close()
    reset(defaultValues as unknown as UpdateDto)
    setImage([])
  }

  const onSubmit: SubmitHandler<UpdateDto> = async (dto) => {
    const formData = new FormData()
    formData.append('title', dto.title)
    formData.append('status', dto.status ? '1' : '0')
    if (image[0]) {
      formData.append('image', image[0])
    }
    formData.append('start_date', dto.start_date)
    formData.append('end_date', dto.end_date)
    formData.append('start_time', dto.start_time.toString())
    formData.append('end_time', dto.end_time.toString())
    formData.append('description', dto.description)
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
      open={Boolean(campaign)}
      onClose={onClose}
      scroll="body"
    >
      <DialogTitle>Изменить акцию</DialogTitle>
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
            setValue={setValue as unknown as UseFormSetValue<CreateDto>}
            errors={errors}
          />
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
            Изменить
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
