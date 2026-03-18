import { create } from 'zustand'

type CalendarMode = 'financial' | 'scheduled'

interface CalendarModeState {
  mode: CalendarMode
  setMode: (mode: CalendarMode) => void
  toggleMode: () => void
}

export const useCalendarModeStore = create<CalendarModeState>((set) => ({
  mode: 'financial',
  setMode: (mode) => set({ mode }),
  toggleMode: () => set((state) => ({ 
    mode: state.mode === 'financial' ? 'scheduled' : 'financial' 
  })),
}))

