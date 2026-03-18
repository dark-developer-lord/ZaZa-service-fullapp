import { Api, api } from '@shared/api'

export const apiExport = async (query: string) => {
  const response = await api.get(Api.exportOrdersExcel + `?${query}`, {
    responseType: 'blob',
  })
  const date = new Date()


  const fileURL = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = fileURL
  link.setAttribute(
    'download',
    `data_${date.getFullYear()}-${date.getMonth()}-${date.getDay()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.xlsx`
  )
  link.click()
  window.URL.revokeObjectURL(fileURL)
  link.remove()
}
