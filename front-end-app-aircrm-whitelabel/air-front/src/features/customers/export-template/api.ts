import toast from 'react-hot-toast'
import { AxiosError } from 'axios'

import { api, VendorApi } from '@shared/api'

export const downloadCustomerTemplate = async () => {
  try {
    const response = await api.get(VendorApi.customerTemplate, {
      responseType: 'blob',
    })

    const fileURL = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = fileURL
    link.setAttribute('download', 'customer-import-template.xlsx')
    link.click()
    window.URL.revokeObjectURL(fileURL)
    link.remove()

    toast.success('Шаблон успешно загружен')
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message || 'Произошла ошибка при загрузке шаблона')
    }
  }
}
