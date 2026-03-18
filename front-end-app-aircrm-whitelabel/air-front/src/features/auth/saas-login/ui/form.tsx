import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Checkbox, FormControlLabel, Stack } from '@mui/material'

import { FormInput, FormPassword } from '@shared/ui'

import { Dto, schema } from '../api/dto'
import { useFormSubmit } from '../api/form-submit'

export const Form = () => {
  const { control, handleSubmit, setValue } = useForm<Dto>({
    defaultValues: {
      login: '',
      password: '',
      remember: true,
    },
    resolver: yupResolver(schema),
  })

  const { handler, mutating } = useFormSubmit()

  return (
    <form onSubmit={handleSubmit(handler)}>
      <Stack spacing={2.5}>
        <FormInput
          name="login"
          control={control}
          label="Email или телефон"
        />
        <FormPassword
          name="password"
          control={control}
          label="Пароль"
        />
        <Controller
          render={({ field }) => (
            <FormControlLabel
              sx={{ width: 'fit-content' }}
              control={
                <Checkbox
                  size="small"
                  checked={field.value}
                  onChange={(_, checked) => {
                    setValue('remember', checked)
                  }}
                />
              }
              label="Запомнить меня"
            />
          )}
          name="remember"
          control={control}
        />

        <LoadingButton
          type="submit"
          size="large"
          loading={mutating}
        >
          Войти
        </LoadingButton>
      </Stack>
    </form>
  )
}
