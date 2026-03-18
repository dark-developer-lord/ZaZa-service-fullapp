import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import { VendorApi, api, postQuery } from '@shared/api'
import { storageToken, useProfile } from '@shared/auth'
import { removeSpaces, RouterPaths } from '@shared/lib'
import { FormInput, FormPassword } from '@shared/ui'

const hint = localStorage.getItem('hint')

const schema = yup.object({
  name: yup.string().required('Введите название магазина'),
  address: yup.string().required('Введите адрес магазина'),
  f_name: yup.string().required('Введите имя владельца'),
  phone: yup.string().required('Введите номер телефона'),
  email: yup.string().email('Введите валидный email').required('Введите email'),
  otp_code: yup
    .string()
    .matches(/^\d{6}$/, 'Код должен содержать 6 цифр')
    .required('Введите код подтверждения'),
  password: yup.string().min(6, 'Минимум 6 символов').required('Введите пароль'),
  confirmPassword: yup
    .string()
    .required('Подтвердите пароль')
    .oneOf([yup.ref('password')], 'Пароли не совпадают'),
})

type RegisterDto = yup.InferType<typeof schema>

interface RegisterResponse {
  message: string
}

interface VendorLoginResponse {
  token: string
  type: 'vendor'
}

interface ApiErrorResponse {
  message?: string
  errors?: Record<string, string[]>
}

export const Form = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [otpSent, setOtpSent] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const authorize = useProfile(({ authorize }) => authorize)

  const { control, handleSubmit, trigger, getValues } = useForm<RegisterDto>({
    defaultValues: {
      name: '',
      address: '',
      f_name: '',
      phone: '+992 ',
      email: '',
      otp_code: '',
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(schema),
  })

  const { mutate, isLoading } = useMutation({
    mutationFn: postQuery<Omit<RegisterDto, 'confirmPassword'>, RegisterResponse>(VendorApi.register),
    async onSuccess(_, dto) {
      try {
        const loginResponse = await api.post<VendorLoginResponse>(VendorApi.login, {
          email: dto.email,
          password: dto.password,
        })

        const token = loginResponse.data.token
        authorize(token)
        storageToken(token, false, 'vendor')
        toast.success('Регистрация прошла успешно')
        if (hint === null) {
          localStorage.setItem('hint', 'show')
        }
        navigate(hint === 'hide' ? RouterPaths.posTerminal : RouterPaths.onboarding)
      } catch (error) {
        toast.success('Регистрация прошла успешно')
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message || 'Выполните вход для продолжения')
        }
        navigate('/auth/login')
      }
    },
    onError(error) {
      if (error instanceof AxiosError) {
        const responseData = error.response?.data as ApiErrorResponse | undefined
        const firstFieldError = responseData?.errors
          ? Object.values(responseData.errors)[0]?.[0]
          : undefined
        toast.error(responseData?.message || firstFieldError || 'Не удалось зарегистрировать магазин')
      }
    },
  })

  const onSubmit = (dto: RegisterDto) => {
    const { confirmPassword, ...payload } = dto
    void confirmPassword
    mutate({
      ...payload,
      phone: removeSpaces(dto.phone),
    })
  }

  const sendOtp = async () => {
    const phoneValid = await trigger('phone')
    if (!phoneValid) return

    const phone = removeSpaces(getValues('phone'))
    setOtpLoading(true)
    try {
      await api.post(VendorApi.sendPhoneOtp, { phone })
      setOtpSent(true)
      toast.success('Код подтверждения отправлен на номер ' + phone)
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || 'Не удалось отправить SMS')
      }
    } finally {
      setOtpLoading(false)
    }
  }

  const nextStep = async () => {
    const fieldsByStep: Record<number, Array<keyof RegisterDto>> = {
      0: ['name', 'address'],
      1: ['f_name', 'phone', 'email', 'otp_code'],
      2: ['password', 'confirmPassword'],
    }

    const valid = await trigger(fieldsByStep[step])
    if (!valid) {
      return
    }

    setStep((prev) => Math.min(prev + 1, 2))
  }

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 0))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2.5}>
        <Typography color="text.secondary">Шаг {step + 1} из 3</Typography>

        {step === 0 && (
          <>
            <FormInput
              name="name"
              control={control}
              label="Название магазина"
            />
            <FormInput
              name="address"
              control={control}
              label="Адрес магазина"
            />
          </>
        )}

        {step === 1 && (
          <>
            <FormInput
              name="f_name"
              control={control}
              label="Имя владельца"
            />
            <FormInput
              name="email"
              control={control}
              label="Email"
            />

            <Box>
              <FormInput
                name="phone"
                control={control}
                label="Номер телефона"
              />
              <LoadingButton
                size="small"
                variant="outlined"
                loading={otpLoading}
                onClick={sendOtp}
                sx={{ mt: 1 }}
              >
                {otpSent ? 'Отправить код повторно' : 'Отправить код подтверждения'}
              </LoadingButton>
            </Box>

            {otpSent && (
              <>
                <Divider />
                <FormInput
                  name="otp_code"
                  control={control}
                  label="Код из SMS (6 цифр)"
                  inputProps={{ maxLength: 6, pattern: '[0-9]*', inputMode: 'numeric' }}
                />
              </>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <FormPassword
              name="password"
              control={control}
              label="Пароль"
            />
            <FormPassword
              name="confirmPassword"
              control={control}
              label="Подтвердите пароль"
            />
          </>
        )}

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {step > 0 && (
            <Button
              fullWidth
              color="inherit"
              onClick={prevStep}
              disabled={isLoading}
            >
              Назад
            </Button>
          )}

          {step < 2 ? (
            <Button
              fullWidth
              variant="contained"
              onClick={nextStep}
              disabled={isLoading || (step === 1 && !otpSent)}
            >
              Далее
            </Button>
          ) : (
            <LoadingButton
              fullWidth
              type="submit"
              size="large"
              loading={isLoading}
            >
              Зарегистрировать магазин
            </LoadingButton>
          )}
        </Box>
      </Stack>
    </form>
  )
}
