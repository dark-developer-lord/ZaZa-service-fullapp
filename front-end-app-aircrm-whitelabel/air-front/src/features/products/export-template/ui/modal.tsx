import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
  CircularProgress,
  TextField,
} from '@mui/material'
import { GridCloseIcon } from '@mui/x-data-grid'
import { useMutation, useQuery } from 'react-query'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'

import { apiExport } from '../api/api-export'
import { ApiKeys, getQuery, getApiPaths } from '@shared/api'

interface Props {
  open: boolean
  onClose: () => void
}

export const ExportModal = ({ open, onClose }: Props) => {
  const [warehouseId, setWarehouseId] = useState<string>('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [itemCount, setItemCount] = useState<number | ''>('')

  // ✅ Get Warehouses
  const { data: warehousesData, isLoading: loadingWarehouses } = useQuery({
    queryKey: [ApiKeys.Warehouses.getWarehouses],
    queryFn: getQuery(getApiPaths().getWarehouses),
    enabled: open,
  })
  const handleClose = () => {
    setWarehouseId('')
    setCategoryId('')
    setItemCount('')
    onClose()
  }

  // ✅ Get Categories
  const { data: categoriesData, isLoading: loadingCategories } = useQuery({
    queryKey: [ApiKeys.Categories.getCategories],
    queryFn: getQuery(getApiPaths().getCategories),
    enabled: open,
  })

  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Products.exportProductExcel],
    mutationFn: apiExport.bind(null),
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message ||
            'Произошла ошибка при экспорте шаблона продуктов',
        )
      }
    },
    onSuccess: () => {
      toast.success('Шаблон успешно экспортирован')
      onClose()
    },
  })

  const handleExport = () => {
    mutate({
      warehouse_id: warehouseId || '',
      category_id: categoryId || '',
      itemCount: itemCount || '',
    })
  }

  return (
    <Dialog open={open} onClose={handleClose}
        maxWidth="xs"
        fullWidth
      >
      <DialogTitle>Получить шаблон импорта</DialogTitle>

      <IconButton
        onClick={onClose}
        sx={{ position: 'absolute', top: 24, right: 24 }}
      >
        <GridCloseIcon />
      </IconButton>

      <DialogContent>
        <Stack spacing={3} sx={{ marginTop: '8px' }}>
          {/* ✅ Warehouse Dropdown */}
          <FormControl fullWidth>
            <InputLabel>Выберите склад (только 1 склад за импорт)</InputLabel>
            <Select
              value={warehouseId}
              label="Выберите склад (только 1 склад за импорт)"
              onChange={(e) => setWarehouseId(e.target.value)}
              disabled={loadingWarehouses}
            >
              {loadingWarehouses ? (
                <MenuItem value="">
                  <CircularProgress size={20} />
                </MenuItem>
              ) : (
                (warehousesData as any)?.data?.map((wh: any) => (
                  <MenuItem key={wh.id} value={wh.id}>
                    {wh.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          {/* ✅ Category Dropdown */}
          <FormControl fullWidth>
            <InputLabel>Выберите категорию товара(только 1 категорию за импорт)</InputLabel>
            <Select
              value={categoryId}
              label="Выберите категорию товара(только 1 категорию за импорт)"
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={loadingCategories}
            >
              {loadingCategories ? (
                <MenuItem value="">
                  <CircularProgress size={20} />
                </MenuItem>
              ) : (
                (categoriesData as any)?.data?.filter((cat: any) => cat.status).map((cat: any) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))
              )}
            </Select>

          </FormControl>
          <FormControl fullWidth>
              <TextField
                label="Внесите количество товаров"
                value={itemCount}
                onChange={(e) => {
                  const value = e.target.value

                  // Allow only digits 1–9999
                  if (/^[1-9][0-9]*$/.test(value) && parseInt(value) <= 9999) {
                    setItemCount(parseInt(value))
                  } else if (value === '') {
                    setItemCount('')
                  }
                }}
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[1-9][0-9]*',
                  style: {
                    MozAppearance: 'textfield', // Firefox
                  },
                }}
                onKeyDown={(e) => {
                  const invalidKeys = ['-', '+', 'e', '.', ',', '*', '/', '(', ')']
                  if (invalidKeys.includes(e.key)) {
                    e.preventDefault()
                  }
                }}
                sx={{
                  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                  },
                }}
                type="text"
                fullWidth
              />
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ py: 3 }}>
        <Button variant="outlined" fullWidth onClick={handleClose}>
          Отмена
        </Button>
        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={handleExport}
          disabled={isLoading}
        >
          Получить шаблон
        </Button>
      </DialogActions>
    </Dialog>
  )
}
