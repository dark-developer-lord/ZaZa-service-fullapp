import { ChipOwnProps } from '@mui/material'

export enum OrderStatus {
  // pending = 'pending',
  // confirmed = 'confirmed',
  accepted = 'accepted',
  picked_up = 'picked_up',
  delivered = 'delivered',
  postponed = 'postponed',
  canceled = 'canceled',
  installment = 'installment',
  successful = 'successful',
  // processing = 'processing',
  // handover = 'handover',
  // failed = 'failed',
  refunded = 'refunded',
}

export type OrderStatusType = keyof typeof OrderStatus

export type OrderStatusLabels = {
  [key in OrderStatusType]: {
    label: string
    color?: ChipOwnProps['color']
  }
}
export const orderStatusLabels: OrderStatusLabels = {
  // [OrderStatus.pending]: {
  //   label: 'В ожидании',
  // },
  // [OrderStatus.confirmed]: {
  //   label: 'Подтверждено',
  // },
  [OrderStatus.accepted]: {
    label: 'Принято',
  },
  [OrderStatus.picked_up]: {
    label: 'На доставке',
    color: 'info'
  },
  [OrderStatus.delivered]: {
    label: 'Доставлено',
    color: 'success'
  },
  [OrderStatus.postponed]: {
    label: 'Перенесено'
  },
  [OrderStatus.canceled]: {
    label: 'Отменено',
    color: 'error',
  },
  [OrderStatus.installment]: {
    label: 'В рассрочку',
    color: 'warning'
  },
  [OrderStatus.successful]: {
    label: 'Успешно',
  },
  // [OrderStatus.failed]: {
  //   label: 'Платеж не прошел',
  //   color: 'error',
  // },
  [OrderStatus.refunded]: {
    label: 'Возврат',
  },
}
