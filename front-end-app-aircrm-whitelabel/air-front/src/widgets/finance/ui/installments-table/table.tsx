import { useEffect } from 'react'
import { Box, FormControl, InputLabel, MenuItem, Select, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { Board } from '@shared/ui'
import { TablePagination } from '@shared/ui'

import { columns } from './columns'
import { Actions } from './actions'
import { useGetInstallments } from './api'
import { useInstallmentsStore } from './store'

export const InstallmentsTable = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))
  const [searchParams, setSearchParams] = useSearchParams()

  const { paginationModel, setPaginationModel, clear } = useInstallmentsStore()
  const { data, isFetching, error } = useGetInstallments(paginationModel)

  const installmentType = searchParams.get('installment_type') || 'orders'

  const handleInstallmentTypeChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('installment_type', value)
    setSearchParams(newParams)
  }

  useEffect(() => {
    return clear
  }, [clear])

  return (
    <Board>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="installment-type-select">Тип рассрочки</InputLabel>
          <Select
            label="Тип рассрочки"
            labelId="installment-type-select"
            value={installmentType}
            onChange={(e) => handleInstallmentTypeChange(e.target.value)}
          >
            <MenuItem value="orders">Заказы</MenuItem>
            <MenuItem value="transfer">Перемещение</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <TablePagination
        columns={columns({
          Actions,
          isMobile,
        })}
        rows={data?.data}
        loading={isFetching}
        paginationModel={paginationModel}
        rowCount={data?.meta?.total || 0}
        changePaginationModel={setPaginationModel}
        pageCount={data?.meta.last_page || 0}
        error={error}
        slots={{
          noRowsOverlay: () => (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '100px 0',
              }}
            >
              <Typography>Нет рассрочек</Typography>
            </Box>
          ),
        }}
      />
    </Board>
  )
}
