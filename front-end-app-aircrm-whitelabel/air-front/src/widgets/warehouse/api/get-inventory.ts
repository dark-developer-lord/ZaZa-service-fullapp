import { useQuery } from 'react-query'
import { ApiKeys, getApiPaths, getQuery, DataPagination } from '@shared/api'
import { InventoryItem } from '@entities/warehouse'
import { useInventoryStore } from '../model/inventory-store'

export const useGetInventory = () => {
  const { paginationModel, searchValue } = useInventoryStore()
  const params: { [key: string]: string } = {
    page: (paginationModel.page + 1).toString(),
    per_page: paginationModel.pageSize.toString(),
  }
  if (searchValue.trim()) {
    params.search = searchValue
  }
  const searchParams = new URLSearchParams(params)

  const url = `${getApiPaths().getInventory}?${searchParams.toString()}`

  return useQuery({
      queryKey: [ApiKeys.WarehouseReports.getInventory, url],
      queryFn: getQuery<DataPagination<InventoryItem>>(url),
      keepPreviousData: false,
  })
}

