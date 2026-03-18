import { AxiosRequestConfig } from 'axios'

import { api } from '../axios-instance'

export const postQuery = <Dto = unknown, Response = unknown>(
  url: string,
  config?: AxiosRequestConfig,
) => {
  return async (dto: Dto) => {
    const response = await api.post<Response>(url, dto, config)
    return response.data
  }
}
