import { Admin } from '@entities/admin'
import { OrderStatus } from '@shared/lib'

export interface OrderAccepted {
  id: number
  order_status: OrderStatus
  created_at: string
  updated_at: string
  admin: AdminAcceptedOrder
  role: {
    name: string
  }
  vendor: {
    id: number
    f_name: string
    l_name: string
    image: string
    phone: string
  }
}

type AdminAcceptedOrder = Omit<Admin, 'email' | 'role' | 'created_at'>
