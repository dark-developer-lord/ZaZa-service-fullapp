import { useEffect, useState } from 'react'
import { Control, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { useGetRestaurants } from '@entities/warehouses'
import { Api, ApiKeys, postQuery, queryClient } from '@shared/api'
import { DialogClose, FileUploader, FormInput } from '@shared/ui'

// TODO: fix this import
import { fileUploadProps } from '../../../categories/create-update/lib/file-upload-props'
import { CreateDto, UpdateDto, updateSchema } from '../model/dto'
import { useStore } from '../model/store'
import { SelectRestaurant } from './select-restaurant'

const defaultValues: Record<keyof UpdateDto, string | number> = {
  title: '',
  image: '',
  restaurant_id: '',
}

export const UpdateDialog = () => {
  const [image, setImage] = useState<File[]>([])
  const { data: restaurants } = useGetRestaurants()
  const [banner, close] = useStore((state) => [
    state.updateOpened,
    state.closeUpdate,
  ])
  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Banners.updateBanner_ + banner?.id],
    mutationFn: postQuery(Api.updateBanner_ + banner?.id),
    onSuccess() {
      toast.success('Баннер успешно изменен')
      queryClient.refetchQueries(ApiKeys.Banners.getBanners)
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
    formState: { errors },
  } = useForm<UpdateDto>({
    defaultValues: defaultValues as UpdateDto,
    resolver: yupResolver(updateSchema),
  })

  useEffect(() => {
    if (banner) {
      reset({
        title: banner.title,
        restaurant_id: banner.restaurant.id,
      })
    }
  }, [banner, reset])

  const onClose = () => {
    close()
    reset(defaultValues as UpdateDto)
    setImage([])
  }

  const onSubmit: SubmitHandler<UpdateDto> = async (dto) => {
    const restaurant = restaurants?.data.find(
      (restaurant) => restaurant.id === dto.restaurant_id,
    )
    const formData = new FormData()
    formData.append('title', dto.title)
    formData.append('restaurant_id', dto.restaurant_id.toString())
    if (restaurant) {
      formData.append('zone_id', restaurant.zone.id.toString())
    }
    if (image[0]) {
      formData.append('image', image[0])
    }
    mutate(formData)
  }

  return (
    <Dialog
      open={Boolean(banner)}
      onClose={onClose}
      scroll="body"
    >
      <DialogTitle>Изменить баннер</DialogTitle>
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
          <SelectRestaurant control={control as Control<CreateDto>} />
          <LoadingButton
            type="submit"
            fullWidth
            sx={{ mt: '24px' }}
            size="large"
            loading={isLoading}
          >
            Изменить баннер
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
