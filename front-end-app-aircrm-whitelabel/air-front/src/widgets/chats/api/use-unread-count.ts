import { useMemo, useState, useEffect } from 'react'
import { useGetChatBySender } from './get-chat-by-sender'
import { LastSeenStorage } from '../lib/last-seen-storage'

/**
 * Hook to calculate unread message count for a sender
 * @param senderId - The sender ID
 * @param platform - The platform (instagram, whatsapp, messenger)
 * @returns The unread message count
 */
export const useUnreadCount = (senderId: string | null, platform: string = 'instagram') => {
    const { data } = useGetChatBySender(senderId, platform)
    const [lastSeenUpdate, setLastSeenUpdate] = useState(0)

    // Listen for last seen updates to trigger recalculation
    useEffect(() => {
        const handleLastSeenUpdate = (event: Event) => {
            const customEvent = event as CustomEvent<{ senderId: string; messageId: number }>
            // Only update if it's for this sender
            if (customEvent.detail?.senderId === senderId) {
                setLastSeenUpdate(prev => prev + 1)
            }
        }

        const eventName = LastSeenStorage.getUpdateEventName()
        window.addEventListener(eventName, handleLastSeenUpdate)

        return () => {
            window.removeEventListener(eventName, handleLastSeenUpdate)
        }
    }, [senderId])

    const unreadCount = useMemo(() => {
        if (!senderId || !data?.messages || !Array.isArray(data.messages)) {
            return 0
        }

        // Get the last seen message ID for this sender
        const lastSeenId = LastSeenStorage.getLastSeen(senderId)

        // Count incoming messages with id > lastSeenId
        const unreadMessages = data.messages.filter(
            (message) => message.direction === 'in' && message.id > lastSeenId && message.id > 0
        )

        return unreadMessages.length
    }, [senderId, data?.messages, lastSeenUpdate]) // Add lastSeenUpdate as dependency

    return unreadCount
}

