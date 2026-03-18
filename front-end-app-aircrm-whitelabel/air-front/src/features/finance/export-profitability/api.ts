import toast from 'react-hot-toast'
import { AxiosError } from 'axios'

import { api } from '@shared/api'

export const exportProductProfitability = async (type: 'excel' | 'csv') => {
  try {
    const response = await api.get(`/vendor/finance/product-profitability/export/${type}`, {
      responseType: 'blob',
    })
    const extension = type === 'excel' ? 'xlsx' : 'csv'

    const fileURL = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = fileURL
    link.setAttribute('download', `product-profitability.${extension}`)
    link.click()
    window.URL.revokeObjectURL(fileURL)
    link.remove()
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message || 'Произошла ошибка при экспорте')
    }
  }
}
