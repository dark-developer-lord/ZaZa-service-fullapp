import { useQuery } from 'react-query'
import { GridPaginationModel } from '@mui/x-data-grid'
import { useSearchParams } from 'react-router-dom'

import { getQuery, getApiPaths, ApiKeys, DataPagination } from '@shared/api'

import { Installment } from './columns'

export const useGetInstallments = (paginationModel: GridPaginationModel) => {
  const [searchParams] = useSearchParams()

  const params = new URLSearchParams({
    page: (paginationModel.page + 1).toString(),
    per_page: paginationModel.pageSize.toString(),
  })

  // Add filter parameters from URL
  const isPaid = searchParams.get('is_paid')
  const isExpired = searchParams.get('is_expired')
  const dueDate = searchParams.get('due_date')
  const installmentType = searchParams.get('installment_type') || 'orders'

  // If expired filter is present, use it; otherwise default to is_paid
  if (isExpired !== null) {
    params.set('is_expired', isExpired)
  } else {
    if (isPaid) {
      params.set('is_paid', isPaid)
    } else {
      params.set('is_paid', '0')
    }
  }

  if (dueDate) {
    params.set('due_date', dueDate)
  }

  params.set('installment_type', installmentType)

  return useQuery<DataPagination<Installment>>({
    queryKey: [ApiKeys.Installments.getInstallments, paginationModel, isPaid, isExpired, dueDate, installmentType],
    queryFn: getQuery(`${getApiPaths().getInstallments}?${params.toString()}`),
    keepPreviousData: true,
  })
}
