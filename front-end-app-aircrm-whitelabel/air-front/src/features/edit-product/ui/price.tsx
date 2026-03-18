import { Control, Controller } from 'react-hook-form'
import { Grid, TextField, Typography } from '@mui/material'

import { Board } from '@shared/ui'

import { Dto } from '../model/dto'
import { AddOnSelect } from './add-on-select'

interface Props {
  control: Control<Dto>
  restaurantId?: number
}

export const Price = ({ control, restaurantId }: Props) => {
  return (
    <Board>
      <Typography
        variant="h6"
        mb="24px"
      >
        Сумма
      </Typography>
      <Grid
        container
        spacing="24px"
      >
        <Grid
          item
          xs={6}
        >
          <Controller
            name="price"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Цена"
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid
          item
          xs={6}
        >
          <AddOnSelect
            control={control}
            restaurantId={restaurantId}
          />
        </Grid>
      </Grid>
    </Board>
  )
}
