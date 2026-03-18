import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
} from '@mui/material'
import { useDebounceCallback } from 'usehooks-ts'

import { useCartStore } from '../model/cart-store'
import { useGetCategories } from '@widgets/categories/api/get-categories'

export const CategoriesSelect = () => {
  const [selected, setSelected] = useState<number[]>([])
  const [restaurantId, zoneId, categories, setCategories] = useCartStore(
    (state) => [
      state.restaurantId,
      state.zoneId,
      state.categories,
      state.setCategories,
    ],
  )

  // re - do this categories
  // const { data, isFetching } = useGetWarehouseCategories(restaurantId)
  const { data, isFetching } = useGetCategories()

  const debounced = useDebounceCallback(setCategories, 500)

  useEffect(() => {
    if (selected.length > categories.length) {
      setSelected(categories)
    }
  }, [categories])

  if (isFetching) {
    return (
      <Skeleton
        width="100%"
        height={52}
        variant="rounded"
        sx={{
          borderRadius: '44px',
        }}
      />
    )
  }

  return (
    <FormControl fullWidth>
      <InputLabel id="categories-select">Категория</InputLabel>
      <Select
        label="Категории"
        labelId="categories-select"
        value={selected}
        onChange={(event) => {
          setSelected(event.target.value as number[])
          debounced(event.target.value as number[])
        }}
        size="medium"
        disabled={restaurantId === null}
        multiple
        onClick={() => {
          if (restaurantId === null) {
            toast('Сначала выберите склад')
          }
        }}
      >
        {data?.data.filter(item => item.status).map((item) => (
          <MenuItem
            key={item.id}
            value={item.id}
          >
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
