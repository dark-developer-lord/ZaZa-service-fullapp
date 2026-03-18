import { ReactNode } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import {
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  SelectProps,
} from '@mui/material'

export interface FormSelectProps<Dto extends FieldValues> {
  name: Path<Dto>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<Dto, any, any>
  label: string
  children: ReactNode
  disabled?: boolean
  valueAsNumber?: boolean // New prop to handle number values
}

export const FormSelect = <Dto extends FieldValues>({
  name,
  control,
  label,
  children,
  disabled,
  valueAsNumber = false,
  ...props
}: FormSelectProps<Dto> & Omit<SelectProps, 'name' | 'label'>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, onBlur, ref }, fieldState: { error } }) => {
        // Ensure value is never undefined or null for MUI Select
        const selectValue = value ?? ''

        return (
          <FormControl fullWidth error={Boolean(error)}>
            <InputLabel id={`${name}-label`}>{label}</InputLabel>
            <Select
              label={label}
              labelId={`${name}-label`}
              disabled={disabled}
              error={Boolean(error)}
              value={selectValue}
              onBlur={onBlur}
              ref={ref}
              onChange={(e) => {
                const newValue = e.target.value

                // Handle empty value
                if (newValue === '') {
                  onChange(undefined)
                  return
                }

                // Convert to number if valueAsNumber is true
                if (valueAsNumber) {
                  if (typeof newValue === 'string') {
                    const numValue = parseInt(newValue, 10)
                    onChange(isNaN(numValue) ? undefined : numValue)
                  } else if (typeof newValue === 'number') {
                    onChange(newValue)
                  } else {
                    onChange(newValue)
                  }
                } else {
                  onChange(newValue)
                }
              }}
              {...props}
            >
              {children}
            </Select>
            {error && <FormHelperText error>{error.message}</FormHelperText>}
          </FormControl>
        )
      }}
    />
  )
}

