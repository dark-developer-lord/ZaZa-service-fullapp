import { Dispatch, SetStateAction } from 'react'
import {
  FormControl,
  FormHelperText,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'

import { Board } from '@shared/ui'

interface Props {
  attributesOptions: Record<string, string[]>
  optionsPrice: Record<string, number | ''>
  setOptionsPrice: Dispatch<SetStateAction<Record<string, number | ''>>>
  errors: Record<string, string>
}

export const AttributesPrices = ({
  optionsPrice,
  setOptionsPrice,
  errors,
}: Props) => {
  const { palette } = useTheme()

  if (Object.keys(optionsPrice).length === 0) {
    return null
  }

  return (
    <Board sx={{ bgcolor: 'grey.50' }}>
      {Object.keys(optionsPrice).map((option) => (
        <Stack
          key={option}
          spacing="24px"
          mb="24px"
          sx={{
            '&:last-child': {
              mb: 0,
            },
          }}
        >
          <Stack
            direction="row"
            spacing="24px"
          >
            <Typography
              sx={{
                bgcolor: 'white',
                height: 56,
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                borderRadius: '56px',
                fontWeight: 500,
                width: 'fit-content',
                flexShrink: 0,
                minWidth: 300,
                border: `1px solid ${palette.grey[200]}`,
              }}
              variant="small"
            >
              {option}
            </Typography>
            <FormControl fullWidth>
              <TextField
                fullWidth
                variant="outlined"
                label="Цена"
                value={optionsPrice[option]}
                onChange={(event) => {
                  setOptionsPrice({
                    ...optionsPrice,
                    [option]: event.target.value as unknown as number,
                  })
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'white',
                  },
                }}
                error={Boolean(errors[option])}
              />
              <FormHelperText error>{errors[option]}</FormHelperText>
            </FormControl>
          </Stack>
        </Stack>
      ))}
    </Board>
  )
}
