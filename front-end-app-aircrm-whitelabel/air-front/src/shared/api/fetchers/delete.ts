import { AxiosRequestConfig } from 'axios'

import { api } from '../axios-instance'

export const deleteQuery = <Response = unknown>(
  url: string,
  config?: AxiosRequestConfig,
) => {
  return async () => {
    const response = await api.delete<Response>(url, config)
    return response.data
  }
}
