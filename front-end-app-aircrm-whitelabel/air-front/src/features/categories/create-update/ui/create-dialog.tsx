import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { SelectStore } from './select-store'
import { AxiosError } from 'axios'

import { ApiKeys, getApiPaths, postQuery, queryClient } from '@shared/api'
import { DialogClose, FileUploader, FormInput } from '@shared/ui'

import { fileUploadProps } from '../lib/file-upload-props'
import { CreateDto, createSchema, } from '../model/dto'
import { useStore } from '../model/store'
import { useGetLoginSource } from '@shared/auth'

const defaultValues: (CreateDto) = {
  name: '',
  store_id: null,
  image: '',
  parent_id: 0,
  position: 0,
}

export const CreateDialog = () => {
  const loginSource = useGetLoginSource()
  const [images, setImages] = useState<File[]>([])
  const [opened, close] = useStore((state) => [
    state.createOpened,
    state.closeCreate,
  ])
  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Categories.createCategory],
    mutationFn: postQuery(getApiPaths().createCategory),
    onSuccess() {
      toast.success('Категория успешно создана')
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
  if (loginSource === "admin") {
    defaultValues.store_id = null
  }
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
    if (dto.store_id) {
      formData.append('store_id', dto.store_id.toString())
    }
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
      <DialogTitle>Создать категорию</DialogTitle>
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
            Добавить категорию
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
