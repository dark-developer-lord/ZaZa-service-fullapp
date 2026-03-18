
import {
  Control,
  UseFormSetValue,
} from 'react-hook-form'
import { Grid, Typography } from '@mui/material'

import { WarehouseSelect } from './warehouse-select'
import { SupplierSearch } from './supplier-search'
import { Board, FormInput } from '@shared/ui'

import { ArrivalDto } from '../model/dto'

interface Props {
  control: Control<ArrivalDto>
  setValue: UseFormSetValue<ArrivalDto>
  imageErrorMessage?: string
  disabled?: boolean
}

export const General = ({ control, setValue, disabled = false }: Props) => {
  return (
    <Board>
      <Typography
        variant="h6"
        mb="24px"
      >
        Документ оприходования
      </Typography>
      <Grid
        container
        spacing="24px"
      >
        <Grid
          item
          xs={12}
          mobile={4}
        >
          <FormInput
            name="name"
            control={control}
            label="Название оприходования"
            disabled={disabled}
          />
        </Grid>
        <Grid
          item
          xs={12}
          mobile={4}
        >
          <SupplierSearch control={control} setValue={setValue} disabled={disabled} />
        </Grid>
        <Grid
          item
          xs={12}
          mobile={4}
        >
          <FormInput
            name="contact"
            control={control}
            label="Контакты"
            disabled
          />
        </Grid>
        <Grid
          item
          xs={12}
          mobile={4}
        >
          <FormInput
            name="company_name"
            control={control}
            label="Компания-поставщик"
            disabled
          />
        </Grid>
        <Grid
          item
          xs={12}
          mobile={4}
        >
          <FormInput
            name="address"
            control={control}
            label="Адрес"
            disabled
          />
        </Grid>
        <Grid
          item
          xs={12}
          mobile={4}
        >
          <FormInput
            name="inn"
            control={control}
            label="ИНН"
            disabled
          />
        </Grid>
      </Grid>
    </Board>
  )
}
