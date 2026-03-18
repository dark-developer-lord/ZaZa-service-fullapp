import toast from 'react-hot-toast'
import { AxiosError } from 'axios'

import { Api, api } from '@shared/api'

export const exportCustomers = async (type: 'excel' | 'csv') => {
  const extension = type === 'excel' ? 'xlsx' : 'csv'

  try {
    const response = await api.get(Api.exportCustomers_ + extension, {
      responseType: 'blob',
    })

    const fileURL = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = fileURL
    link.setAttribute('download', `customers.${extension}`)
    link.click()
    window.URL.revokeObjectURL(fileURL)
    link.remove()
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message || 'Произошла ошибка')
    }
  }
}
