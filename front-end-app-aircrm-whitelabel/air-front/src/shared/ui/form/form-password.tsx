import { useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { IconButton, useTheme } from '@mui/material'

import EyeIcon from '@icons/eye.svg?react'
import EyeSlashIcon from '@icons/eye-slash.svg?react'

import { FormInput, FormInputProps } from './form-input'

export const FormPassword = <Dto extends FieldValues>(
  props: FormInputProps<Dto>,
) => {
  const [showPassword, setShowPassword] = useState(false)
  const theme = useTheme()

  const Icon = showPassword ? EyeSlashIcon : EyeIcon

  const toggle = () => {
    setShowPassword(!showPassword)
  }

  return (
    <FormInput
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <IconButton
            onClick={toggle}
            type="button"
            sx={{
              '&:hover svg': {
                fill: theme.palette.primary.main,
              },
            }}
          >
            <Icon
              width={20}
              height={20}
              fill={theme.palette.text.secondary}
            />
          </IconButton>
        ),
      }}
      {...props}
    />
  )
}
