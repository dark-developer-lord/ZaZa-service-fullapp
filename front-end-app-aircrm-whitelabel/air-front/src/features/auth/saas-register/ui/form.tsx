import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import { Api, api, postQuery } from '@shared/api'
import { storageToken, storeSaasSession, useProfile } from '@shared/auth'
import { removeSpaces, RouterPaths } from '@shared/lib'
import { FormInput, FormPassword } from '@shared/ui'

const hint = localStorage.getItem('hint')

const schema = yup.object({
  business_name: yup.string().required('Введите название бизнеса'),
  sector_type: yup
    .string()
    .oneOf(['goods', 'services', 'hybrid'], 'Выберите тип бизнеса')
    .required('Выберите тип бизнеса'),
  owner_name: yup.string().required('Введите имя владельца'),
  email: yup.string().email('Введите валидный email').nullable().optional(),
  phone: yup.string().required('Введите номер телефона'),
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
  token: string
  owner: { id: number; name: string; phone: string; email: string }
  tenant: { id: number; name: string; slug: string; sector_type: string; panel_preset: string; timezone: string; currency: string; is_active: boolean }
}

export const Form = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [otpSent, setOtpSent] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const authorize = useProfile(({ authorize }) => authorize)
  const setProfile = useProfile(({ setProfile }) => setProfile)

  const { control, handleSubmit, trigger, getValues } = useForm<RegisterDto>({
    defaultValues: {
      business_name: '',
      sector_type: 'goods',
      owner_name: '',
      email: '',
      phone: '+992 ',
      otp_code: '',
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(schema),
  })

  const { mutate, isLoading } = useMutation({
    mutationFn: postQuery<Omit<RegisterDto, 'confirmPassword'>, RegisterResponse>(Api.saasRegister),
    onSuccess(response) {
      toast.success('Регистрация прошла успешно')
      authorize(response.token)
      storageToken(response.token, false, 'saas')
      storeSaasSession({ user: response.owner, tenant: response.tenant as never })
      setProfile(response.owner, 'saas')
      if (hint === null) localStorage.setItem('hint', 'show')
      navigate(hint === 'hide' ? RouterPaths.posTerminal : RouterPaths.onboarding)
    },
    onError(error) {
      if (error instanceof AxiosError) {
        const data = error.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined
        const fieldError = data?.errors ? Object.values(data.errors)[0]?.[0] : undefined
        toast.error(data?.message || fieldError || 'Не удалось зарегистрироваться')
      }
    },
  })

  const onSubmit = (dto: RegisterDto) => {
    const { confirmPassword, ...payload } = dto
    void confirmPassword
    mutate({ ...payload, phone: removeSpaces(dto.phone) })
  }

  const sendOtp = async () => {
    const phoneValid = await trigger('phone')
    if (!phoneValid) return

    const phone = removeSpaces(getValues('phone'))
    setOtpLoading(true)
    try {
      await api.post(Api.saasSendPhoneOtp, { phone })
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
      0: ['business_name', 'sector_type'],
      1: ['owner_name', 'phone', 'email', 'otp_code'],
      2: ['password', 'confirmPassword'],
    }

    const valid = await trigger(fieldsByStep[step])
    if (!valid) return

    setStep((prev) => Math.min(prev + 1, 2))
  }

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0))

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2.5}>
        <Typography color="text.secondary">Шаг {step + 1} из 3</Typography>

        {step === 0 && (
          <>
            <FormInput name="business_name" control={control} label="Название бизнеса" />

            <Controller
              name="sector_type"
              control={control}
              render={({ field, fieldState }) => (
                <FormControl error={!!fieldState.error}>
                  <FormLabel>Тип бизнеса</FormLabel>
                  <RadioGroup row {...field}>
                    <FormControlLabel value="goods" control={<Radio />} label="Товары" />
                    <FormControlLabel value="services" control={<Radio />} label="Услуги" />
                    <FormControlLabel value="hybrid" control={<Radio />} label="Смешанный" />
                  </RadioGroup>
                  {fieldState.error && (
                    <Typography variant="caption" color="error">
                      {fieldState.error.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
          </>
        )}

        {step === 1 && (
          <>
            <FormInput name="owner_name" control={control} label="Имя владельца" />
            <FormInput name="email" control={control} label="Email (необязательно)" />

            <Box>
              <FormInput name="phone" control={control} label="Номер телефона" />
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
            <FormPassword name="password" control={control} label="Пароль" />
            <FormPassword name="confirmPassword" control={control} label="Подтвердите пароль" />
          </>
        )}

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {step > 0 && (
            <Button fullWidth color="inherit" onClick={prevStep} disabled={isLoading}>
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
            <LoadingButton fullWidth type="submit" size="large" loading={isLoading}>
              Зарегистрироваться
            </LoadingButton>
          )}
        </Box>
      </Stack>
    </form>
  )
}
