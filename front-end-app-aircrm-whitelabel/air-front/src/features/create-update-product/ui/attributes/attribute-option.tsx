import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { MuiChipsInput } from 'mui-chips-input'

interface Props {
  id: number
  name: string
  options: string[]
  addOptions: (name: string, values: string[]) => void
  error?: string
}

export const AttributeOption = ({
  id,
  name,
  options,
  addOptions,
  error,
}: Props) => {
  const handleChange = (chips: string[]) => {
    addOptions(`choice_${id}`, chips)
  }

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))

  return (
    <Stack
      spacing={isMobile ? '14px' : '24px'}
      direction={isMobile ? 'column' : 'row'}
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
        {name}
      </Typography>
      <MuiChipsInput
        value={options}
        onChange={handleChange}
        placeholder=""
        fullWidth
        helperText={error}
        error={Boolean(error)}
      />
    </Stack>
  )
}
