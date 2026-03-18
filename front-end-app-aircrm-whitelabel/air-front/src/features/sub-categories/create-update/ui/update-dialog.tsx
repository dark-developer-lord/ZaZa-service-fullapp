import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { ApiKeys, getApiPaths, putQuery, queryClient, VendorApi } from '@shared/api'
import { DialogClose, FileUploader, FormInput } from '@shared/ui'

import { fileUploadProps } from '../lib/file-upload-props'
import { UpdateDto, updateSchema } from '../model/dto'
import { useStore } from '../model/store'
import { CategorySelect } from './category-select'

export const UpdateDialog = () => {
  const [images, setImages] = useState<File[]>([])
  const [category, close] = useStore((state) => [
    state.updateOpened,
    state.closeUpdate,
  ])
  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Categories.updateSubCategory_ + category?.id],
    mutationFn: putQuery(getApiPaths().updateCategory_ + category?.id),
    onSuccess() {
      toast.success('Подкатегория успешно изменена')
      queryClient.refetchQueries(ApiKeys.Categories.getSubCategories)
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
    formState: { errors },
    setValue,
    reset,
  } = useForm<UpdateDto>({
    resolver: yupResolver(updateSchema),
  })

  useEffect(() => {
    if (category) {
      reset({
        ...category,
        store_id: category.parent.store_id,
        image: '',
      })
    }
  }, [category, reset])

  const onClose = () => {
    close()
    reset()
    setImages([])
  }

  const onSubmit: SubmitHandler<UpdateDto> = async (dto) => {
    const formData = new FormData()
    formData.append('name', dto.name)
    if (dto.store_id) {
      formData.append('store_id', dto.store_id?.toString())
    }
    if (images[0]) {
      formData.append('image', images[0])
    }
    formData.append('position', dto.position.toString())
    formData.append('parent_id', dto.parent_id.toString())
    formData.append('_method', 'PUT')
    mutate(formData)
  }


  return (
    <Dialog
      open={Boolean(category)}
      onClose={onClose}
    >
      <DialogTitle>Изменить подкатегорию</DialogTitle>
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
            files={images}
            setFiles={setImages}
            setValue={setValue}
            errorMessage={errors.image?.message}
            maxFileSize={fileUploadProps.maxFileSize}
            acceptFiles={fileUploadProps.acceptFiles}
            acceptFilesText={fileUploadProps.acceptFilesText}
          />
          <CategorySelect control={control} storeId={category ? category?.parent.store_id : null} />
          <FormInput
            name="name"
            control={control}
            label="Название подкатегории"
          />
          <LoadingButton
            type="submit"
            fullWidth
            sx={{ mt: '24px' }}
            size="large"
            loading={isLoading}
          >
            Изменить подкатегорию
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
