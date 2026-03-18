import { useSearchParams } from 'react-router-dom'

import { OrderStatus } from '@shared/lib'

export const useGetStatus = () => {
  const [searchParams] = useSearchParams()
  const status = searchParams.get('status')
  if (status && status in OrderStatus) {
    return status as OrderStatus
  }
  return null
}
