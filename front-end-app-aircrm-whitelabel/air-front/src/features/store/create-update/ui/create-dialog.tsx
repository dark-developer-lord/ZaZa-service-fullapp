import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  MobileStepper,
  Button,
} from '@mui/material'
import { AxiosError } from 'axios'

import { Api, ApiKeys, postQuery, queryClient } from '@shared/api'
import { formatPhoneNumber, removeSpaces } from '@shared/lib'
import { DialogClose, FormInput, FormPassword } from '@shared/ui'

import { storeSchema } from '../model/dto'
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

export const CreateDialog = () => {
  const [opened, close] = useStore((state) => [
    state.createOpened,
    state.closeCreate,
  ])

  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = 3;

  const handleNext = async () => {
    const isStepValid = await trigger()
    if (isStepValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const currentValidationSchema = storeSchema[activeStep]

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    trigger
  } = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(currentValidationSchema as any),
  })

  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Stores.createStore],
    mutationFn: postQuery(Api.createStore),
    onSuccess() {
      toast.success('Склад успешно добавлен')
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

  const phone = watch('responsible_phone')

  useEffect(() => {
    setValue('responsible_phone', formatPhoneNumber(phone))
  }, [phone, setValue])

  const onClose = () => {
    close()
    reset(defaultValues)
    setActiveStep(0)
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

  interface Field {
    name: 'name' | 'address' | 'map_link' | 'latitude' | 'longitude' | 'responsible' | 'phone' |'minimum_delivery_time' | 'maximum_delivery_time' | 'tax' |'responsible_name' | 'responsible_phone'
    label: string
  }

  interface FormSection {
    title: string
    fields: Field[]
  }

  const formSections: {
    info: FormSection,
    address: FormSection,
    responsible: FormSection
  } = {
    info: {
      title: 'Информация о магазине',
      fields: [
        { name: 'name', label: 'Название магазина' },
        { name: 'tax', label: 'НДС' },
        { name: 'minimum_delivery_time', label: 'Мин.время доставки' },
        { name: 'maximum_delivery_time', label: 'Макс.время доставки' },
      ]
    },
    address: {
      title: 'Местоположение магазина',
      fields: [
        { name: 'address', label: 'Адрес' },
        { name: 'map_link', label: 'Ссылка на карту' },
        { name: 'latitude', label: 'Широта' },
        { name: 'longitude', label: 'Долгота' },
      ]
    },
    responsible: {
      title: 'Информация об ответственном',
      fields: [
        { name: 'responsible_name', label: 'ФИО ответсвенного' },
        { name: 'responsible_phone', label: 'Номер телефона' }
      ]
    } ,
  }

  const formSectionsKeys = Object.keys(formSections)
  const activeFormSection = formSectionsKeys[activeStep] as keyof typeof formSections
  return (
    <Dialog
      open={opened}
      onClose={onClose}
      scroll="body"
    >
      <DialogTitle>Добавление магазина</DialogTitle>
      <DialogClose onClose={onClose} />
      <DialogContent>
        {/* <FormProvider {...methods}> */}
          <Stack
            component="form"
            onSubmit={handleSubmit(onSubmit, (errors) => { console.log(errors) })}
            spacing="24px"
            sx={{ padding: '16px 0' }}
          >
            <Stack
              mb="24px"
              spacing="24px"
            >
              <Typography
                variant="h6"
                mb="16px"
              >
                {formSections[activeFormSection].title}
              </Typography>
              {formSections[activeFormSection].fields.map(({ name, label }) => (
                <FormInput
                  key={name}
                  name={name as any}
                  control={control}
                  label={label}
                />
              ))}
              { activeStep === maxSteps - 1 && (
                <Stack
                  mb="24px"
                  spacing="24px"
                >
                  <Typography
                    variant="h6"
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
              )}
              <MobileStepper
                variant="dots"
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                sx={{
                  flexWrap: 'wrap',
                  gap: '24px',
                  '& .MuiButton-root': {
                    flexBasis: 'calc(50% - 12px)'
                  },
                  '& .MuiMobileStepper-dots': {
                    justifyContent: 'center',
                    flexBasis: '100%',
                    order: 2
                  }
                }}
                nextButton={
                  <Button
                    size="medium"
                    onClick={handleNext}
                    disabled={activeStep === maxSteps - 1}
                  >Далее</Button>
                }
                backButton={
                  <Button
                    size="medium"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                  >Назад</Button>
                }
              />
            </Stack>
            <LoadingButton
              type="submit"
              fullWidth
              sx={{ mt: '24px' }}
              size="medium"
              loading={isLoading}
            >
              Добавить
            </LoadingButton>
          </Stack>
        {/* </FormProvider> */}
      </DialogContent>
    </Dialog>
  )
}
