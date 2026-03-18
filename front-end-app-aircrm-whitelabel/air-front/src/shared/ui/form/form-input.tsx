import { FC, SVGProps } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import {
  FormGroup,
  InputAdornment,
  TextField,
  TextFieldProps,
} from '@mui/material'

import { formatPhoneNumber } from '../../lib'

export interface FormInputProps<Dto extends FieldValues> {
  name: Path<Dto>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<Dto, any, any>
  label: string
  required?: boolean
  icon?: FC<SVGProps<SVGSVGElement>>
  inputProps?: TextFieldProps | any
  suffix?: string
}

export const FormInput = <Dto extends FieldValues>({
  name,
  control,
  label,
  icon: Icon,
  inputProps,
  suffix,
  ...props
}: FormInputProps<Dto> & TextFieldProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormGroup>
          <TextField
            label={label}
            error={Boolean(error)}
            helperText={error?.message}
            {...props}
            InputProps={{
              startAdornment: Icon && (
                <InputAdornment position="start">
                  <Icon
                    width={20}
                    height={20}
                    fill="black"
                  />
                </InputAdornment>
              ),
              ...props.InputProps,
            }}
            {...field}
            onChange={(event) => {
              if (props.type === 'tel') {
                event.target.value = formatPhoneNumber(event.target.value)
              }
              field.onChange(event)
            }}
            {...inputProps}
          />
        </FormGroup>
      )}
    />
  )
}
