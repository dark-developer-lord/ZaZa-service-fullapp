import { create } from 'zustand'

export interface ActionLink {
  title: string
  description: string
  type: string
  url: string
  count?: number
  filters?: Record<string, any>
}

export interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  excelExport?: {
    file_name: string
    download_url: string
    total_customers?: number
    min_absence_days?: number
  }
  actionLinks?: ActionLink[]
}

interface AIAdvisorState {
  isOpen: boolean
  messages: AIMessage[]
  isLoading: boolean
  currentPage: 'customers' | 'financial-overview' | null
  activeActionUrl: string | null

  openAdvisor: (page: 'customers' | 'financial-overview') => void
  closeAdvisor: () => void
  addMessage: (message: Omit<AIMessage, 'id' | 'timestamp'>) => void
  setLoading: (loading: boolean) => void
  clearMessages: () => void
  setActiveActionUrl: (url: string | null) => void
}

export const useAIAdvisorStore = create<AIAdvisorState>((set) => ({
  isOpen: false,
  messages: [],
  isLoading: false,
  currentPage: null,
  activeActionUrl: null,

  openAdvisor: (page) => set({
    isOpen: true,
    currentPage: page,
    messages: [{
      id: Date.now().toString(),
      role: 'assistant',
      content: page === 'customers'
        ? 'Здравствуйте! Я AirAI, ваш помощник по анализу клиентов. Я проанализировал ваши данные и готов дать рекомендации.'
        : 'Здравствуйте! Я AirAI, ваш финансовый помощник. Я проанализировал ваши финансовые данные и готов дать рекомендации.',
      timestamp: new Date()
    }]
  }),

  closeAdvisor: () => set({ isOpen: false }),

  addMessage: (message) => set((state) => ({
    messages: [
      ...state.messages,
      {
        ...message,
        id: Date.now().toString(),
        timestamp: new Date()
      }
    ]
  })),

  setLoading: (loading) => set({ isLoading: loading }),

  clearMessages: () => set({ messages: [] }),

  setActiveActionUrl: (url) => set({ activeActionUrl: url })
}))

