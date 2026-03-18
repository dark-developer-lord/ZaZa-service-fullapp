import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { DialogClose, FileUploader, FormInput } from '@shared/ui'
import { SelectStore } from './select-store'

import { AxiosError } from 'axios'

import { ApiKeys, postQuery, queryClient, getApiPaths } from '@shared/api'
import { useGetLoginSource } from '@shared/auth'

import { fileUploadProps } from '../lib/file-upload-props'
import { UpdateDto, updateSchema } from '../model/dto'
import { useStore } from '../model/store'

export const UpdateDialog = () => {
  const loginSource = useGetLoginSource()
  const [images, setImages] = useState<File[]>([])
  const [category, close] = useStore((state) => [
    state.updateOpened,
    state.closeUpdate,
  ])
  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Categories.updateCategory_ + category?.id],
    mutationFn: postQuery(getApiPaths().updateCategory_ + category?.id),
    onSuccess() {
      toast.success('Категория успешно изменена')
      queryClient.refetchQueries(ApiKeys.Categories.getCategories)
      reset()
      onClose()
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message)
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
    formData.append('_method', 'put')
    mutate(formData)
  }

  return (
    <Dialog
      open={Boolean(category)}
      onClose={onClose}
    >
      <DialogTitle>Изменить категорию</DialogTitle>
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
          <FormInput
            name="name"
            control={control}
            label="Название категории"
          />
          { loginSource === "admin" && (
            <SelectStore
              control={control as any}
            />
          )}
          <LoadingButton
            type="submit"
            fullWidth
            sx={{ mt: '24px' }}
            size="large"
            loading={isLoading}
          >
            Изменить категорию
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
