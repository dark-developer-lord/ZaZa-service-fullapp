import { Control, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import AddIcon from '@icons/add-fill.svg?react'

import { useGetCategories } from '@widgets/categories/api/get-categories'
import { useGetSubCategories } from '@entities/sub-category'
import { RouterPaths } from '@shared/lib'

import { CreateDto, UpdateDto} from '../model/dto'

interface Props {
  control: Control<CreateDto> | Control<UpdateDto>
  categoryId?: number,
  isCreatePage: boolean
}

export const CategorySelect = ({ categoryId, control, isCreatePage = true }: Props) => {
  const { data: categories, isFetching: isFetchingCategories } = useGetCategories(100)
  const { data: subCategories, isFetching: isFetchingSubCategories } = useGetSubCategories(categoryId)
  const navigate = useNavigate()

  return (
    <>
      <Grid
        item
        xs={12}
        mobile={isCreatePage ? 3 : 4}
      >
        <Controller
          name={'category_id' as any}
          control={control as any}
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
                onChange={(e) => {
                  if (e.target.value === 'create_new') {
                    navigate(RouterPaths.categories)
                  } else {
                    field.onChange(e)
                  }
                }}
              >
                {categories?.data.filter(category => category.status).map((item) => (
                  <MenuItem
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem value="create_new" sx={{ color: 'primary.main' }}>
                  <ListItemIcon>
                    <AddIcon width={20} height={20} fill="currentColor" />
                  </ListItemIcon>
                  <ListItemText primary="Создать категорию" />
                </MenuItem>
              </Select>
              <FormHelperText error>{fieldState.error?.message}</FormHelperText>
            </FormControl>
          )}
        />
      </Grid>
      <Grid
        item
        xs={12}
        mobile={isCreatePage ? 3 : 4}
      >
        <Controller
          name={'sub_category_id' as any}
          control={control as any}
          render={({ field, fieldState }) => (
            <FormControl fullWidth>
              <InputLabel id="sub-category-select">
                {isFetchingCategories || (categoryId && !subCategories?.data.length) ? "Нет подкатегорий" : "Подкатегории"}
              </InputLabel>
              <Select
                label="Подкатегории"
                labelId="sub-category-select"
                size="medium"
                error={Boolean(fieldState.error)}
                disabled={isFetchingSubCategories || !subCategories || !subCategories?.data.length}
                {...field}
                onChange={(e) => {
                  if (e.target.value === 'create_new') {
                    navigate(RouterPaths.subCategories)
                  } else {
                    field.onChange(e)
                  }
                }}
              >
                {subCategories?.data.map((item) => (
                  <MenuItem
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem value="create_new" sx={{ color: 'primary.main' }}>
                  <ListItemIcon>
                    <AddIcon width={20} height={20} fill="currentColor" />
                  </ListItemIcon>
                  <ListItemText primary="Создать подкатегорию" />
                </MenuItem>
              </Select>
              <FormHelperText error>{fieldState.error?.message}</FormHelperText>
            </FormControl>
          )}
        />
      </Grid>
    </>
  )
}
