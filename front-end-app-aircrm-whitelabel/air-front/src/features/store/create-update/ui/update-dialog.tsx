import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { AxiosError } from 'axios'

import { useGetStore } from '@entities/stores'

import { Api, ApiKeys, postQuery, queryClient } from '@shared/api'
import { formatPhoneNumber, removeSpaces } from '@shared/lib'
import { DialogClose, FormInput, FormPassword } from '@shared/ui'

import { updateStoreSchema } from '../model/dto'
import { useStore } from '../model/store'

const defaultValues = {
  name: '',
  tax: '',
  minimum_delivery_time: '',
  maximum_delivery_time: '',
  address: '',
  map_link: '',
  latitude: '',
  longitude: '',
  responsible_name: '',
  responsible_phone: '+992 ',
  email: '',
  password: '',
}

export const UpdateDialog = () => {
  const [store, close] = useStore((state) => [
    state.updateOpened,
    state.closeUpdate,
  ])
  const { data, isFetching } = useGetStore(store?.id)
  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Stores.updateStore_ + store?.id],
    mutationFn: postQuery(Api.updateStore_ + store?.id),
    onSuccess() {
      toast.success('Магазин успешно изменен')
      queryClient.refetchQueries(ApiKeys.Stores.getStores)
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
    setValue,
    reset,
    watch,
  } = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(updateStoreSchema as any),
  })

  const phone = watch('responsible_phone')

  useEffect(() => {
    setValue('responsible_phone', formatPhoneNumber(phone))
  }, [phone, setValue])

  useEffect(() => {
    if (data) {
      const store = data.data as any
      reset({
        name: store.name,
        tax: store.tax,
        minimum_delivery_time: store.delivery_time.split('-')[0],
        maximum_delivery_time: store.delivery_time.split('-')[1],
        address: store.address,
        map_link: store.map_link,
        latitude: store.latitude,
        longitude: store.longitude,
        responsible_name: store.vendor.f_name,
        responsible_phone: store.vendor.phone,
        email: store.vendor.email
      })
    }
  }, [data, store?.id, reset])

  const onClose = () => {
    reset(defaultValues)
    close()
  }

  const onSubmit = async (dto: any) => {
    const formData = new FormData()
    formData.append('name', dto.name)
    formData.append('tax', dto.tax.toString())
    formData.append('minimum_delivery_time', dto.minimum_delivery_time.toString())
    formData.append('maximum_delivery_time', dto.maximum_delivery_time.toString())
    formData.append('address', dto.address)
    if (dto.map_link) {
      formData.append('map_link', dto.map_link)
    }
    if (dto.latitude?.toString()) {
      formData.append('latitude', dto.latitude.toString())
    }
    if (dto.longitude?.toString()) {
      formData.append('longitude', dto.longitude.toString())
    }
    formData.append('f_name', dto.responsible_name)
    formData.append('phone', removeSpaces(dto.responsible_phone))
    formData.append('email', dto.email)
    formData.append('password', dto.password)
    mutate(formData)
  }

  return (
    <Dialog
      open={Boolean(store)}
      onClose={onClose}
      scroll="body"
    >
      <DialogTitle>Изменение магазина</DialogTitle>
      <DialogClose onClose={onClose} />
      <DialogContent>
        {isFetching ? (
          <Box
            sx={{
              height: 150,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Stack
            component="form"
            onSubmit={handleSubmit(onSubmit, (errors) => { console.log(errors) })}
            spacing="24px"
            sx={{ padding: '16px 0' }}
          >
            <Stack>
              <Typography
                variant='h6'
                fontSize={16}
                mb={3}
              >Общие сведения</Typography>
              <Grid
                container
                spacing={3}
                sx={{ paddingLeft: '-16px' }}
              >
                <Grid
                  item
                  xs={12}
                >
                  <FormInput
                    name="name"
                    control={control}
                    label="Название"
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <FormInput
                    name="tax"
                    control={control}
                    label="НДС/Налог"
                  />
                </Grid>
                <Grid
                  item
                  xs={6}
                >
                <FormInput
                  name="minimum_delivery_time"
                  control={control}
                  label="Минимальное время доставки"
                />
                </Grid>
                <Grid
                  item
                  xs={6}
                >
                <FormInput
                  name="maximum_delivery_time"
                  control={control}
                  label="Максимальное время доставки"
                />
                </Grid>
              </Grid>
            </Stack>
            <Stack>
              <Typography
                variant='h6'
                fontSize={16}
                mb={2}
              >Местоположение магазина</Typography>
              <Grid
                container
                spacing={3}
                sx={{ paddingLeft: '-16px' }}
              >
                <Grid
                  item
                  xs={12}
                >
                  <FormInput
                    name="address"
                    control={control}
                    label="Адрес"
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <FormInput
                    name="map_link"
                    control={control}
                    label="Ссылка на карту"
                  />
                </Grid>
                <Grid
                  item
                  xs={6}
                >
                  <FormInput
                    name="latitude"
                    control={control}
                    label="Широта"
                  />
                </Grid>
                <Grid
                  item
                  xs={6}
                >
                  <FormInput
                    name="longitude"
                    control={control}
                    label="Долгота"
                  />
                </Grid>
              </Grid>
            </Stack>
            <Stack>
              <Typography
                variant='h6'
                fontSize={16}
                mb={3}
              >Ответсвенный</Typography>
              <Grid
                container
                spacing={3}
                sx={{ paddingLeft: '-16px' }}
              >
                <Grid
                  item
                  xs={12}
                >
                  <FormInput
                    name="responsible_name"
                    control={control}
                    label="Введите ФИО"
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <FormInput
                    name="responsible_phone"
                    control={control}
                    label="Номер телефона"
                  />
                </Grid>
              </Grid>
            </Stack>
            {/* {!data?.data.main_restaurant && (
              <>
                <FormControl fullWidth>
                  <InputLabel>Обложка</InputLabel>
                  <FileUploader
                    name="cover_photo"
                    control={control}
                    files={coverPhoto}
                    setFiles={setCoverPhoto}
                    setValue={setValue}
                    errorMessage={errors.cover_photo?.message}
                    acceptFiles={fileUploadProps.acceptFiles}
                    acceptFilesText={fileUploadProps.acceptFilesText}
                    maxFileSize={fileUploadProps.maxFileSize}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Лого</InputLabel>
                  <FileUploader
                    name="logo"
                    control={control}
                    files={logo}
                    setFiles={setLogo}
                    setValue={setValue}
                    errorMessage={errors.logo?.message}
                    acceptFiles={fileUploadProps.acceptFiles}
                    acceptFilesText={fileUploadProps.acceptFilesText}
                    maxFileSize={fileUploadProps.maxFileSize}
                  />
                </FormControl>
              </>
            )}
            {data?.data.main_restaurant && (
              <TextField
                name="main_restaurant_id"
                label="Главный ресторан"
                value={data.data.main_restaurant.name}
                disabled
              />
            )} */}
            <Stack
              spacing="24px"
            >
              <Typography
                variant="h6"
                fontSize={16}
                mb="24px"
              >
                Учётная запись
              </Typography>
              <FormInput
                name="email"
                type="email"
                control={control}
                label="Email"
              />
              <FormPassword
                name="password"
                control={control}
                label="Пароль"
              />
            </Stack>
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
        )}
      </DialogContent>
    </Dialog>
  )
}
