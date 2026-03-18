import { useMutation } from 'react-query'
import { useProfile } from '@shared/auth'
import { postQuery } from '@shared/api'

/**
 * Hook to mark messages as seen
 * @param senderId - The sender ID
 * @param platform - The platform (instagram, whatsapp, messenger)
 */
export const useMarkMessagesSeen = (senderId: string | null, platform: string = 'instagram') => {
    const { profile } = useProfile()

    return useMutation({
        mutationFn: async (upToMessageId: number) => {
            if (!senderId || !profile?.id || !upToMessageId) {
                return
            }

            const url = `/messengers/markMessagesAsSeen/${senderId}?store_id=${profile.id}&platform=${platform}&up_to_message_id=${upToMessageId}`
            
            const mutationFn = postQuery(url)
            return await mutationFn({})
        },
        onError: (error) => {
            console.error('Error marking messages as seen:', error)
        },
    })
}

