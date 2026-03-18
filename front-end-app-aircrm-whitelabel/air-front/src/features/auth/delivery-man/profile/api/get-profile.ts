import { useQuery } from "react-query"
import { getLSLoginSource, getToken, useProfile } from "@shared/auth"
import { DeliveryManApi, getQuery } from "@shared/api"
import { useEffect } from "react"

export const useGetProfile = () => {
    const url = `${import.meta.env.VITE_APP_API_URL}/v1${DeliveryManApi.profile}?token=${getToken()}`
    const query = useQuery('/profile', {
        queryFn: getQuery(url),
        enabled: Boolean(getToken())
    })

    const setProfile = useProfile(profile => profile.setProfile)

    useEffect(() => {
        if (query.isSuccess) {
            setProfile(query.data as any, getLSLoginSource() as any)
        }
    }, [query])

    return {
        ...query,
    }
}