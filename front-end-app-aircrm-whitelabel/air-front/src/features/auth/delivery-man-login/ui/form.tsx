import { useEffect } from "react"
import { LoadingButton } from "@mui/lab"
import { Checkbox, FormControlLabel, Stack } from "@mui/material"
import { Controller, useForm } from "react-hook-form"
import { Dto, schema } from "../api/dto"
import { yupResolver } from "@hookform/resolvers/yup"
import { useFormSubmit } from "../api/form-submit"
import { FormInput, FormPassword } from "@shared/ui"
import { formatPhoneNumber } from '@shared/lib'

export const Form = () => {
    const { control, handleSubmit, setValue, watch } = useForm<Dto>({
      defaultValues: {
        phone: '',
        password: '',
        remember: true,
      },
      resolver: yupResolver(schema),
    })

    const { handler, mutating } = useFormSubmit()

    // const phone = watch('phone')

    // useEffect(() => {
    //   setValue('phone', formatPhoneNumber(phone))
    // }, [phone, setValue])

    return (
        <form onSubmit={handleSubmit(handler)}>
            <Stack spacing={2.5}>
              <FormInput
                name="phone"
                control={control}
                label="Номер телефона"
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