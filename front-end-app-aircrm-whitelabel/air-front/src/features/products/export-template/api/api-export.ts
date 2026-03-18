import { VendorApi, api } from '@shared/api'

export const apiExport = async (params?: {
    warehouse_id?: string
    category_id?: string
    itemCount?: number | string
  }) => {
  const response = await api.get(VendorApi.exportProductsTemplate, {
    responseType: 'blob',
    params: params,  
  })

  const fileURL = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = fileURL
  link.setAttribute('download', 'products-template.xlsx')
  link.click()
  window.URL.revokeObjectURL(fileURL)
  link.remove()
}
