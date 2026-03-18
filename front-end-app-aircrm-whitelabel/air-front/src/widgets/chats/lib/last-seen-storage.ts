const LAST_SEEN_PREFIX = 'lastSeen_'
const LAST_SEEN_UPDATE_EVENT = 'lastSeenUpdated'

export class LastSeenStorage {
    /**
     * Get the last seen message ID for a sender
     * @param senderId - The sender ID
     * @returns The last seen message ID, or 0 if not found
     */
    static getLastSeen(senderId: string): number {
        if (!senderId) return 0
        
        try {
            const key = `${LAST_SEEN_PREFIX}${senderId}`
            const value = localStorage.getItem(key)
            return value ? parseInt(value, 10) : 0
        } catch (error) {
            console.error('Error getting last seen message ID:', error)
            return 0
        }
    }

    /**
     * Set the last seen message ID for a sender
     * @param senderId - The sender ID
     * @param messageId - The message ID to save
     */
    static setLastSeen(senderId: string, messageId: number): void {
        if (!senderId || !messageId) return
        
        try {
            const key = `${LAST_SEEN_PREFIX}${senderId}`
            localStorage.setItem(key, messageId.toString())
            
            // Dispatch custom event to notify components of the update
            window.dispatchEvent(new CustomEvent(LAST_SEEN_UPDATE_EVENT, {
                detail: { senderId, messageId }
            }))
        } catch (error) {
            console.error('Error setting last seen message ID:', error)
        }
    }

    /**
     * Get the event name for last seen updates
     */
    static getUpdateEventName(): string {
        return LAST_SEEN_UPDATE_EVENT
    }

    /**
     * Update last seen to the highest message ID in the chat
     * @param senderId - The sender ID
     * @param messages - Array of messages with id property
     */
    static updateLastSeen(senderId: string, messages: Array<{ id: number }>): void {
        if (!senderId || !Array.isArray(messages) || messages.length === 0) return
        
        // Find the highest message ID
        const highestId = Math.max(...messages.map(m => m.id).filter(id => id > 0))
        
        if (highestId > 0) {
            this.setLastSeen(senderId, highestId)
        }
    }
}

