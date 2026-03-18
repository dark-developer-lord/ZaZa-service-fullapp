import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { ApiKeys, getApiPaths, postQuery, queryClient } from '@shared/api'
import { DialogClose, FileUploader, FormInput } from '@shared/ui'

import { fileUploadProps } from '../lib/file-upload-props'
import { CreateDto, createSchema } from '../model/dto'
import { useStore } from '../model/store'
import { CategorySelect } from './category-select'

const defaultValues: CreateDto = {
  name: '',
  image: '',
  parent_id: 0,
  position: 1,
}

export const CreateDialog = () => {
  const [images, setImages] = useState<File[]>([])
  const [opened, close] = useStore((state) => [
    state.createOpened,
    state.closeCreate,
  ])
  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Categories.createSubCategory],
    mutationFn: postQuery(getApiPaths().createCategory),
    onSuccess() {
      toast.success('Подкатегория успешно создана')
      queryClient.refetchQueries(ApiKeys.Categories.getSubCategories)
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
    formState: { errors },
    setValue,
    reset,
  } = useForm<CreateDto>({
    defaultValues,
    resolver: yupResolver(createSchema),
  })

  const onClose = () => {
    close()
    reset(defaultValues)
    setImages([])
  }

  const onSubmit: SubmitHandler<CreateDto> = async (dto) => {
    const formData = new FormData()
    formData.append('name', dto.name)
    // formData.append('image', images[0])
    formData.append('position', dto.position.toString())
    formData.append('parent_id', dto.parent_id.toString())
    mutate(formData)
  }

  return (
    <Dialog
      open={opened}
      onClose={onClose}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
          e.stopPropagation()
        }
      }}
      PaperProps={{
        sx: {minWidth: {xs: '328px', mobile: '480px'}}
      }}
    >
      <DialogTitle>Создать подкатегорию</DialogTitle>
      <DialogClose onClose={onClose} />
      <DialogContent>
        <Stack
          component="form"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleSubmit(onSubmit)(e)
          }}
          spacing="24px"
          sx={{ padding: '16px 0' }}
        >
          {/* <FileUploader
            name="image"
            control={control}
            files={images}
            setFiles={setImages}
            setValue={setValue}
            errorMessage={errors.image?.message}
            acceptFiles={fileUploadProps.acceptFiles}
            acceptFilesText={fileUploadProps.acceptFilesText}
            maxFileSize={fileUploadProps.maxFileSize}
          /> */}
          <CategorySelect control={control} storeId={null} />
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
            Добавить подкатегорию 
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
