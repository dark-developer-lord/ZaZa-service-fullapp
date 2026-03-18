import { create } from 'zustand'
import { TransactionApproval } from '@pages/financial-overview/api/get-transaction-approvals'

interface State {
  approveOpened: boolean
  selectedTransaction: TransactionApproval | null
  openApprove: (transaction: TransactionApproval) => void
  closeApprove: () => void
  updateSelectedTransaction: (transaction: TransactionApproval) => void
}

export const useStore = create<State>((set) => ({
  approveOpened: false,
  selectedTransaction: null,
  openApprove: (transaction) => set({ approveOpened: true, selectedTransaction: transaction }),
  closeApprove: () => set({ approveOpened: false, selectedTransaction: null }),
  updateSelectedTransaction: (transaction) => set({ selectedTransaction: transaction }),
}))

