import { create } from 'zustand'

export type ChatType = {
    fetch_url: string
    last_message_preview: string
    profile: {
        username: string | null
        profile_pic: string | null
        link: string | null
    }
    sender_id: string
    sent_at: string
}

export type Chat = {
    account_id: number
    contacts: ChatType[]
    ig_business_id: string
    page_id: string
    platform?: string
    owner_profile?: {
        name?: string
        username?: string
        profile_pic?: string
        link?: string
    }
}

interface State {
    chats: Chat[]
}

interface Action {
    setChats: (chats: Chat[]) => void
}

export const useStore = create<State & Action>((set) => ({
    chats: [],
    setChats: (chats) => set({ chats })
}))