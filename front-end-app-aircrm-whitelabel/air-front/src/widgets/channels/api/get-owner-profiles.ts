import { useProfile } from '@shared/auth'
import { useQueries } from 'react-query'
import { getQuery } from '@shared/api'
import { useMemo } from 'react'

const platforms = ['instagram', 'whatsapp', 'messenger']

type OwnerProfile = {
    name?: string
    username?: string
    profile_pic?: string
    link?: string
}

type ConnectedAccount = {
    account_id?: number
    ig_business_id?: string
    profile?: OwnerProfile
}

type StatusResponse = {
    connected_accounts?: ConnectedAccount[]
}

export const useGetOwnerProfiles = () => {
    const { profile } = useProfile()

    const queriesConfig = useMemo(() => {
        if (!Array.isArray(platforms)) return []
        return platforms.map(platform => ({
            queryFn: getQuery<StatusResponse>(`/messengers/checkConnectionStatus?store_id=${profile?.id}&platform=${platform}`),
            queryKey: [`/messengers/checkConnectionStatus?store_id=${profile?.id}&platform=${platform}`],
            enabled: Boolean(profile?.id),
        }))
    }, [profile?.id])

    const queries = useQueries(queriesConfig)

    const ownerProfilesMap = useMemo(() => {
        const map = new Map<string, OwnerProfile>()
        
        if (Array.isArray(queries)) {
            queries.forEach((query) => {
                if (query?.isSuccess && query?.data?.connected_accounts) {
                    const accounts = query.data.connected_accounts
                    accounts.forEach((account: ConnectedAccount) => {
                        // Create keys for both ig_business_id and account_id to match channels
                        if (account.profile) {
                            if (account.ig_business_id) {
                                map.set(account.ig_business_id, account.profile)
                            }
                            if (account.account_id) {
                                map.set(account.account_id.toString(), account.profile)
                            }
                        }
                    })
                }
            })
        }
        
        return map
    }, [queries])

    return ownerProfilesMap
}

