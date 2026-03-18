import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { useGetRestaurants } from '@entities/warehouses'
import { Api, ApiKeys, postQuery, queryClient } from '@shared/api'
import { DialogClose, FileUploader, FormInput } from '@shared/ui'

import { fileUploadProps } from '../../../categories/create-update/lib/file-upload-props'
import { CreateDto, createSchema } from '../model/dto'
import { useStore } from '../model/store'
import { SelectRestaurant } from './select-restaurant'

const defaultValues: Record<keyof CreateDto, string | number> = {
  title: '',
  image: '',
  restaurant_id: '',
}

export const CreateDialog = () => {
  const [image, setImage] = useState<File[]>([])
  const { data: restaurants } = useGetRestaurants()
  const [opened, close] = useStore((state) => [
    state.createOpened,
    state.closeCreate,
  ])
  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Banners.createBanner],
    mutationFn: postQuery(Api.createBanner),
    onSuccess() {
      toast.success('Баннер успешно создан')
      queryClient.refetchQueries(ApiKeys.Banners.getBanners)
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
    formState: { errors },
  } = useForm<CreateDto>({
    defaultValues: defaultValues as CreateDto,
    resolver: yupResolver(createSchema),
  })

  const onClose = () => {
    close()
    reset(defaultValues as CreateDto)
    setImage([])
  }

  const onSubmit: SubmitHandler<CreateDto> = async (dto) => {
    const restaurant = restaurants?.data.find(
      (restaurant) => restaurant.id === dto.restaurant_id,
    )
    const formData = new FormData()
    formData.append('title', dto.title)
    formData.append('restaurant_id', dto.restaurant_id.toString())
    if (restaurant) {
      formData.append('zone_id', restaurant.zone.id.toString())
    }
    formData.append('image', image[0])
    mutate(formData)
  }

  return (
    <Dialog
      open={opened}
      onClose={onClose}
      scroll="body"
    >
      <DialogTitle>Создать баннер</DialogTitle>
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
          <SelectRestaurant control={control} />
          <LoadingButton
            type="submit"
            fullWidth
            sx={{ mt: '24px' }}
            size="large"
            loading={isLoading}
          >
            Добавить баннер
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
