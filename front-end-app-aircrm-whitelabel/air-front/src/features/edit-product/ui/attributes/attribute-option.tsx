import { Stack, Typography } from '@mui/material'
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

  return (
    <Stack
      spacing="24px"
      direction="row"
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
          minWidth: 300,
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
