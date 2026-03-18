import { create } from 'zustand'
import { ScheduleTransactionDto } from './dto'

interface State {
  scheduleOpened: boolean
  createCounterpartyOpened: boolean
  cachedFormData: Partial<ScheduleTransactionDto> | null
  openSchedule: () => void
  closeSchedule: () => void
  openCreateCounterparty: (formData: Partial<ScheduleTransactionDto>) => void
  closeCreateCounterparty: () => void
  returnToSchedule: () => void
  clearCache: () => void
}

export const useStore = create<State>((set) => ({
  scheduleOpened: false,
  createCounterpartyOpened: false,
  cachedFormData: null,
  openSchedule: () => set({ scheduleOpened: true }),
  closeSchedule: () => set({ scheduleOpened: false, cachedFormData: null }),
  openCreateCounterparty: (formData) => set({
    scheduleOpened: false,
    createCounterpartyOpened: true,
    cachedFormData: formData
  }),
  closeCreateCounterparty: () => set({ createCounterpartyOpened: false }),
  returnToSchedule: () => set({
    scheduleOpened: true,
    createCounterpartyOpened: false
  }),
  clearCache: () => set({ cachedFormData: null }),
}))

