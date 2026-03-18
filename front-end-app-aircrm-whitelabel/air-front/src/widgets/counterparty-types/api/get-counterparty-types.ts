import { useQuery } from 'react-query'
import { GridPaginationModel } from '@mui/x-data-grid'

import { ApiKeys, getQuery, VendorApi } from '@shared/api'
import { useStore } from '../model/store'

export interface CounterpartyTypeItem {
  id?: number
  value: string
  label: string
  is_custom: boolean
}

interface CounterpartyTypesResponse {
  types: Array<{
    id?: number
    value: string
    label: string
    is_custom: boolean
  }>
}

export const useGetCounterpartyTypes = () => {
  const { paginationModel, searchValue } = useStore()
  
  return useQuery({
    queryKey: [ApiKeys.Counterparties.getCounterpartyTypes, paginationModel, searchValue],
    queryFn: getQuery<CounterpartyTypesResponse>(VendorApi.getCounterpartyTypes),
    refetchOnMount: false,
    select: (data) => {
      // Transform the API response to match the expected format
      // Keep the actual id field from API for custom types (for API calls)
      // Use value as unique identifier for DataGrid rows
      const allTypes = data.types.map((type) => ({
        id: type.id, // Keep actual ID from API for custom types, undefined for system types
        value: type.value,
        label: type.label,
        is_custom: type.is_custom,
      }))
      
      // Apply search filter if needed
      let filteredTypes = allTypes
      if (searchValue.trim()) {
        const searchLower = searchValue.toLowerCase()
        filteredTypes = allTypes.filter(
          (type) =>
            type.label.toLowerCase().includes(searchLower) ||
            type.value.toLowerCase().includes(searchLower)
        )
      }
      
      // Apply pagination
      const startIndex = paginationModel.page * paginationModel.pageSize
      const endIndex = startIndex + paginationModel.pageSize
      const paginatedTypes = filteredTypes.slice(startIndex, endIndex)
      
      return {
        data: paginatedTypes,
        meta: {
          total: filteredTypes.length,
          per_page: paginationModel.pageSize,
          current_page: paginationModel.page + 1,
          last_page: Math.ceil(filteredTypes.length / paginationModel.pageSize) || 1,
        },
      }
    },
  })
}

