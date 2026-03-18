import { Control, Controller } from 'react-hook-form'
import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'

import { useGetAllCategories } from '@entities/category'
import { useGetSubCategories } from '@entities/sub-category'

import { Dto } from '../model/dto'

interface Props {
  control: Control<Dto>
  categoryId?: number
}

export const CategorySelect = ({ categoryId, control }: Props) => {
  const { data: categories, isFetching: isFetchingCategories } =
    useGetAllCategories()
  const { data: subCategories, isFetching: isFetchingSubCategories } =
    useGetSubCategories(categoryId)
  return (
    <>
      <Grid
        item
        xs={4}
      >
        <Controller
          name="category_id"
          control={control}
          render={({ field, fieldState }) => (
            <FormControl fullWidth>
              <InputLabel id="category-select">Категории</InputLabel>
              <Select
                label="Категории"
                labelId="category-select"
                size="medium"
                error={Boolean(fieldState.error)}
                disabled={isFetchingCategories || !categories}
                {...field}
              >
                {categories?.data.map((item) => (
                  <MenuItem
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error>{fieldState.error?.message}</FormHelperText>
            </FormControl>
          )}
        />
      </Grid>
      <Grid
        item
        xs={4}
      >
        <Controller
          name="sub_category_id"
          control={control}
          render={({ field, fieldState }) => (
            <FormControl fullWidth>
              <InputLabel id="sub-category-select">Подкатегории</InputLabel>
              <Select
                label="Подкатегории"
                labelId="sub-category-select"
                size="medium"
                error={Boolean(fieldState.error)}
                disabled={isFetchingSubCategories || !subCategories}
                {...field}
              >
                {subCategories?.data.map((item) => (
                  <MenuItem
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error>{fieldState.error?.message}</FormHelperText>
            </FormControl>
          )}
        />
      </Grid>
    </>
  )
}
