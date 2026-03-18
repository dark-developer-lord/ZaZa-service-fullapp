import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { LoadingButton } from '@mui/lab'
import { useMediaQuery, useTheme } from '@mui/material'
import { AxiosError } from 'axios'

import { dtoToQueryExport } from '@widgets/orders/api/filter-dto-export'
import { ApiKeys } from '@shared/api'
import DownloadIcon from '@icons/download.svg?react'

import { useOrdersFilterStore } from '../filter-orders'
import { apiExport } from './api/api-export'

export const Ui = () => {
  const { palette } = useTheme()
  const state = useOrdersFilterStore()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))

  const params: { [key: string]: string } = {}
  if (state.searchValue.trim()) {
    params.search = state.searchValue.trim()
  }
  const searchParams = new URLSearchParams(params)
  const filterParams = dtoToQueryExport({
    status: state.statuses,
    date: state.date,
    restaurantId: state.restaurantId,
    duration: state.activeKey,
  })
  let query = ''
  if (searchParams.toString()) {
    query = `${searchParams.toString()}`
  }
  if (filterParams.toString()) {
    query += `${searchParams.toString() === '' ? '' : '&'}${filterParams.toString()}`
  }


  const { isLoading, mutate } = useMutation({
    mutationKey: [ApiKeys.Orders.exportExcel],
    mutationFn: apiExport.bind(null, query),
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message ||
            'Произошла ошибка при экспорте заказов',
        )
      }
    },
  })

  return (
    <>
    {
      !isMobile &&
      <LoadingButton
        color="secondary"
        size="medium"
        startIcon={
          <DownloadIcon
            width={20}
            height={20}
            stroke={palette.text.primary}
          />
        }
        loading={isLoading}
        onClick={() => mutate()}
      >
        Экспорт
      </LoadingButton>
    }
    </>
  )
}
