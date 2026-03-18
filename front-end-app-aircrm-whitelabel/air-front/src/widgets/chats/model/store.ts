import { create } from "zustand";

interface State {
    sender: string | null
}

interface Action {
    setSender: (sender: string) => void
}

export const useStore = create<State & Action>((set) => ({
    sender: null,
    setSender: (sender) => set({ sender })
}))