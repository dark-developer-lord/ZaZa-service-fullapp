import { AxiosRequestConfig } from 'axios'

import { api } from '../axios-instance'

export const getQuery = <Response = unknown>(
  url: string,
  config?: AxiosRequestConfig,
) => {
  return async () => {
    const response = await api.get<Response>(url, config)
    return response.data
  }
}
