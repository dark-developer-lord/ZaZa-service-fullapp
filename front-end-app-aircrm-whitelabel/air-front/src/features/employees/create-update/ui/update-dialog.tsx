import { useEffect, useState } from 'react'
import { Control, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { ApiKeys, postQuery, queryClient, VendorApi } from '@shared/api'
import { DialogClose, FileUploader, FormInput, FormPassword } from '@shared/ui'

import { fileUploadProps } from '../lib/file-upload-props'
import { CreateDto, UpdateDto, updateSchema } from '../model/dto'
import { useStore } from '../model/store'
import { SelectModules } from './select-modules'

const defaultValues: Record<keyof UpdateDto, string | null | boolean | string[]> = {
  f_name: '',
  l_name: '',
  image: '',
  phone: '+992',
  password: '',
  modules: [],
}

export const UpdateDialog = () => {
  const [image, setImage] = useState<File[]>([])
  const [employee, close] = useStore((state) => [
    state.updateOpened,
    state.closeUpdate,
  ])
  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Employees.updateEmployee_ + employee?.id],
    mutationFn: postQuery(VendorApi.updateEmployee_ + employee?.id),
    onSuccess() {
      toast.success('Сотрудник успешно изменен')
      queryClient.refetchQueries(ApiKeys.Employees.getEmployees)
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
    defaultValues: defaultValues as unknown as UpdateDto,
    resolver: yupResolver(updateSchema),
  })

  useEffect(() => {
    if (employee) {
      reset({
        ...employee,
        image: '',
        modules: employee.modules || [],
      })
    }
  }, [employee])

  const onClose = () => {
    close()
    reset(defaultValues as unknown as UpdateDto)
    setImage([])
  }

  const onSubmit: SubmitHandler<UpdateDto> = async (dto) => {
    const formData = new FormData()
    formData.append('f_name', dto.f_name)
    formData.append('l_name', dto.l_name)
    formData.append('phone', dto.phone)
    if (dto.password?.trim()) {
      formData.append('password', dto.password)
    }

    // Add modules as array
    dto.modules.forEach((module, index) => {
      formData.append(`modules[${index}]`, module as string)
    })

    if (image[0]) {
      formData.append('image', image[0])
    }
    mutate(formData)
  }

  return (
    <Dialog
      open={Boolean(employee)}
      onClose={onClose}
      scroll="body"
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          width: {
            xs: '95%',      // Mobile: 95% of screen width
            sm: '80%',      // Tablet: 80% of screen width
            md: '600px',    // Desktop: Fixed 600px width
            lg: '650px',    // Large: Fixed 650px width
            xl: '700px',    // Extra Large: Fixed 700px width
          },
          maxWidth: {
            xs: '95%',
            sm: '80%',
            md: '600px',
            lg: '650px',
            xl: '700px',
          },
          margin: {
            xs: '16px',     // Mobile: 16px margin
            sm: '32px',     // Tablet: 32px margin
            md: 'auto',     // Desktop+: Auto centering
          },
          maxHeight: {
            xs: '90vh',     // Mobile: 90% of viewport height
            sm: '85vh',     // Tablet: 85% of viewport height
            md: '80vh',     // Desktop+: 80% of viewport height
          }
        }
      }}
    >
      <DialogTitle>Изменить сотрудника</DialogTitle>
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
            name="f_name"
            control={control}
            label="Имя"
          />
          <FormInput
            name="l_name"
            control={control}
            label="Фамилия"
          />
          <FormInput
            name="phone"
            control={control}
            label="Телефон"
            type="tel"
            placeholder="+992123456789"
          />
          <FormPassword
            name="password"
            control={control}
            label="Пароль"
          />
          <SelectModules control={control} />
          <LoadingButton
            type="submit"
            fullWidth
            sx={{ mt: '24px' }}
            size="large"
            loading={isLoading}
          >
            Изменить сотруднка
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
