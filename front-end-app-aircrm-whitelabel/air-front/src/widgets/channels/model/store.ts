import { Chat } from "@pages/chats/model/store";
import { create } from "zustand";

type PlatformFilter = 'all' | 'instagram' | 'whatsapp' | 'facebook' | 'messenger';

interface State {
    activeChannel: Chat | null
    platformFilter: PlatformFilter
}

interface Action {
    setActiveChannel: (channel: Chat) => void
    setPlatformFilter: (platform: PlatformFilter) => void
}

export const useStore = create<State & Action>((set) =>({
    activeChannel: null,
    platformFilter: 'all',
    setActiveChannel: (channel) => set({ activeChannel: channel}),
    setPlatformFilter: (platform) => set({ platformFilter: platform })
}))