import { Stack, Typography, useTheme, useMediaQuery } from '@mui/material'
import { MuiChipsInput } from 'mui-chips-input'
import { VariationType } from '../../model/variation-types'

interface Props {
  value: VariationType[]
  onChange: (types: string[]) => void
  variationName: string
  error?: string
}

export const VariationTypes = ({ value, onChange, variationName, error }: Props) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))

  if (!variationName) {
    return null
  }

  return (
    <Stack
      spacing={isMobile ? '14px' : '24px'}
      direction={isMobile ? 'column' : 'row'}
      sx={{ mb: '24px' }}
    >
      <Typography
        sx={{
          bgcolor: 'grey.100',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          padding: '16px',
          borderRadius: '56px',
          fontWeight: 500,
          width: 'fit-content',
          flexShrink: 0,
          minWidth: '300px',
        }}
        variant="small"
      >
        {variationName}
      </Typography>
      <MuiChipsInput
        value={value.map(type => type.name)}
        onChange={onChange}
        placeholder={`Введите тип вариации "${variationName}" - Например: Большой/Маленький или X/M/L...`}
        fullWidth
        helperText={error}
        error={Boolean(error)}
      />
    </Stack>
  )
}
