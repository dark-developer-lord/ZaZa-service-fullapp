import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

import { useGetWarehouses } from '@entities/warehouses'
import { useProductsStore } from '@widgets/warehouse/model/products-store'

export const Ui = () => {
  const { data, isFetching } = useGetWarehouses()
  const { warehouseId, setWarehouseId } = useProductsStore()

  return (
    <FormControl sx={{ minWidth: 200 }}>
      <InputLabel id="warehouse-filter-label">Склад</InputLabel>
      <Select
        labelId="warehouse-filter-label"
        label="Склад"
        value={warehouseId || ''}
        onChange={(e) => setWarehouseId(e.target.value ? Number(e.target.value) : null)}
        disabled={isFetching || !data}
        size="medium"
      >
        <MenuItem value="">
          <em>Все склады</em>
        </MenuItem>
        {data?.data.map((warehouse) => (
          <MenuItem key={warehouse.id} value={warehouse.id}>
            {warehouse.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

