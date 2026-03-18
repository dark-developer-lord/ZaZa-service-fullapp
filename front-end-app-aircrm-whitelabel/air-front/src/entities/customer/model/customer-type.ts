export interface Customer {
  id: number
  user_number?: string | number
  phone: string
  f_name: string
  l_name: string
}

export interface CustomerItem extends Customer {
  total_order_count: number
  total_order_amount: number
  birth_date: string | null
  source: string | null
  absence_days: number | null
  addresses: CustomerAddress[]
  loyalty_points_percentage?: number
  total_installment?: number
  loyalty_points?: number
  user_address?: string
  call_status?: 'Успешно' | 'Не дозвон' | 'Перезвонить' | 'Не успешно'
  call_result?: string
}

export interface CustomerAddress {
  id: number
  road: string
}
