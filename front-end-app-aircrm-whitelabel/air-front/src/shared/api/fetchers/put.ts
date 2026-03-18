import { AxiosRequestConfig } from 'axios'

import { api } from '../axios-instance'

export const putQuery = <Dto = unknown, Response = unknown>(
  url: string,
  config?: AxiosRequestConfig,
) => {
  return async (dto: Dto) => {
    const response = await api.put<Response>(url, dto, config)
    return response.data
  }
}
