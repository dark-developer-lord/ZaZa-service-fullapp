import { TextField } from '@mui/material'

interface Props {
  value: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
}

export const VariationNameInput = ({ value, onChange, error, disabled = false }: Props) => {
  return (
    <TextField
      value={value}
      onChange={(e) => !disabled && onChange(e.target.value)}
      label="Введите название вариации"
      fullWidth
      error={Boolean(error)}
      helperText={error}
      sx={{ mb: '24px' }}
      disabled={disabled}
    />
  )
}
