import { getQuery } from "@shared/api"
import { useProfile } from "@shared/auth"
import { getEcho } from "@shared/lib/echo"
import { useQuery, useQueryClient } from "react-query"
import { useEffect } from "react"

type MessageType = {
    id: number,
    text: string,
    direction: "in" | "out",
    sent_at: string,
    is_seen?: boolean,
    media_type?: string | null,
    media_url?: string | null,
    media_id?: string | null
}

interface IChat {
    account_id: number
    messages: MessageType[]
    profile: {
        username: string | null
        profile_pic: string | null
        link: string | null
    }
}

export const useGetChatBySender = (id: string | null, platform: string = 'instagram', isActive: boolean = false) => {
    const { profile } = useProfile()
    const queryClient = useQueryClient()
    const queryKey = [`/messengers/getChatBySender/${id}?store_id=${profile?.id}&platform=${platform}`]
    
    const initialQuery = useQuery({
        queryFn: getQuery<IChat>(`/messengers/getChatBySender/${id}?store_id=${profile?.id}&platform=${platform}`),
        queryKey,
        enabled: Boolean(profile?.id) && Boolean(id),
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    })

    // Polling query - используем стабильный ключ, lastMessageId получаем динамически внутри queryFn
    const pollQueryKey = [`/messengers/getChatBySender/${id}?store_id=${profile?.id}&platform=${platform}&poll`]
    
    const pollQuery = useQuery({
        queryFn: () => {
            const currentData = queryClient.getQueryData<IChat>(queryKey)
            if (!currentData?.messages || currentData.messages.length === 0) {
                // If no cached data, do a full fetch instead of polling
                return getQuery<IChat>(
                    `/messengers/getChatBySender/${id}?store_id=${profile?.id}&platform=${platform}`
                )()
            }
            
            // Фильтруем только реальные сообщения (не временные с отрицательными ID)
            // Временные сообщения имеют отрицательные ID, реальные от сервера - положительные
            const realMessages = currentData.messages.filter(m => m.id > 0)
            
            if (realMessages.length === 0) {
                // If no real messages, do a full fetch
                return getQuery<IChat>(
                    `/messengers/getChatBySender/${id}?store_id=${profile?.id}&platform=${platform}`
                )()
            }
            
            const currentLastId = [...realMessages].sort((a, b) => b.id - a.id)[0].id
            
            return getQuery<IChat>(
                `/messengers/getChatBySender/${id}?store_id=${profile?.id}&platform=${platform}&last_message_id=${currentLastId}`
            )()
        },
        queryKey: pollQueryKey,
        // Enable polling for all chats, but use faster interval for active chat
        enabled: Boolean(profile?.id) && Boolean(id),
        refetchInterval: isActive ? 2000 : 5000, // Faster polling (2s) for active chat, slower (5s) for others
        refetchIntervalInBackground: true,
        keepPreviousData: true,
    })

    // Объединяем новые сообщения из опроса с основными данными
    useEffect(() => {
        if (pollQuery.data) {
            const cachedData = queryClient.getQueryData<IChat>(queryKey)
            
            // If no cached data, just set the poll data
            if (!cachedData) {
                queryClient.setQueryData<IChat>(queryKey, pollQuery.data)
                return
            }
            
            // If poll returned messages, merge them
            if (pollQuery.data.messages && pollQuery.data.messages.length > 0) {
                const existingMessageIds = new Set(cachedData.messages.map(m => m.id))
                const newMessages = pollQuery.data.messages.filter(m => !existingMessageIds.has(m.id))
                
                if (newMessages.length > 0) {
                    const updater = (old: IChat | undefined): IChat | undefined => {
                        if (!old) return pollQuery.data
                        
                        const allMessages = [...old.messages, ...newMessages]
                        const uniqueMessages = Array.from(
                            new Map(allMessages.map(m => [m.id, m])).values()
                        )
                        uniqueMessages.sort((a, b) => a.id - b.id)
                        
                        return {
                            ...old,
                            messages: uniqueMessages,
                            // Update profile if available
                            profile: pollQuery.data.profile || old.profile
                        }
                    }
                    queryClient.setQueryData<IChat>(queryKey, updater as any)
                } else if (pollQuery.data.messages.length === 0 && cachedData.messages.length === 0) {
                    // If both are empty, update with poll data to ensure we have the structure
                    queryClient.setQueryData<IChat>(queryKey, pollQuery.data)
                }
            }
        }
    }, [pollQuery.data, queryKey, queryClient])

    // Также периодически обновляем основной запрос для синхронизации
    useEffect(() => {
        if (!id || !profile?.id) return
        
        const interval = setInterval(() => {
            queryClient.invalidateQueries(queryKey)
        }, 10000) // Полное обновление каждые 10 секунд
        
        return () => clearInterval(interval)
    }, [id, profile?.id, queryKey, queryClient])

    // Real-time: subscribe to WebSocket channel — instantly triggers a poll when
    // a new message arrives for this sender (or any sender in this store).
    // Falls back gracefully to pure polling if WebSocket server is not running.
    useEffect(() => {
        if (!profile?.id || !id) return

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let channel: any = null

        try {
            const echo = getEcho()
            channel = echo.private(`messenger.store.${profile.id}`)

            channel.listen('.NewMessengerMessage', (event: { sender_id: string }) => {
                // Trigger immediate poll refetch for the active chat
                if (event.sender_id === id) {
                    queryClient.invalidateQueries(pollQueryKey)
                }
                // Always refresh list of chats for unread count badge
                queryClient.invalidateQueries([`/messengers/listChats`])
            })
        } catch {
            // WebSocket unavailable — polling continues as normal
        }

        return () => {
            try {
                channel?.stopListening('.NewMessengerMessage')
            } catch {
                // ignore
            }
        }
    }, [profile?.id, id, queryClient, pollQueryKey])

    const mergedData = queryClient.getQueryData<IChat>(queryKey) || initialQuery.data

    return {
        ...initialQuery,
        data: mergedData,
        isFetching: initialQuery.isFetching && !initialQuery.data
    }
}
