import { getQuery } from "@shared/api"
import { useQuery, UseQueryOptions, useQueries } from "react-query"
import { useProfile } from "@shared/auth"
import { Chat } from "@pages/chats/model/store"
import { useMemo } from "react"

const platforms = ['instagram', 'whatsapp', 'messenger'];

export const useGetChannels = (options?: UseQueryOptions) => {
    const { profile } = useProfile()
    
    // react-query v3: useQueries accepts an ARRAY of query configs, not an object
    const queries = useQueries(
        platforms.map((platform) => ({
            queryKey: [`/messengers/listChats?store_id=${profile?.id}&platform=${platform}`],
            queryFn: getQuery<Chat[]>(`/messengers/listChats?store_id=${profile?.id}&platform=${platform}`),
            enabled: Boolean(profile?.id) && options?.enabled,
            keepPreviousData: true,
        })),
    )

    const combinedData = useMemo(() => {
        const allChannels: Chat[] = []
        if (Array.isArray(queries)) {
            queries.forEach((query, index) => {
                // Only process if query is successful and data is an array
                if (query?.isSuccess && query?.data && Array.isArray(query.data)) {
                    try {
                        // Add platform to each channel if not already present
                        const channelsWithPlatform = query.data.map(channel => ({
                            ...channel,
                            platform: platforms[index]
                        }))
                        allChannels.push(...channelsWithPlatform)
                    } catch (error) {
                        console.error(`Error processing channels for platform ${platforms[index]}:`, error)
                    }
                }
            })
        }
        return allChannels
    }, [queries])

    const isFetching = Array.isArray(queries) && queries.some(query => query.isFetching)
    const error = Array.isArray(queries) ? queries.find(query => query.error)?.error : undefined

    return {
        data: combinedData,
        isFetching: isFetching || false,
        error,
        isLoading: Array.isArray(queries) && queries.some(query => query.isLoading)
    }
}