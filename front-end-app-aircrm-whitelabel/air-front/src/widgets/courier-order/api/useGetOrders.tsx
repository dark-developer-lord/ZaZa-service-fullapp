import { DeliveryManApi, getQuery } from "@shared/api"
import { getToken } from "@shared/auth"
import { useQuery } from "react-query"

export const useGetOrders = () => {
    // const params: { [key: string]: string } = {
    //     page: (paginationModel.page + 1).toString(),
    //     per_page: paginationModel.pageSize.toString(),
    // }
  const url = `${import.meta.env.VITE_APP_API_URL}/v1${DeliveryManApi.getOrders}?token=${getToken()}`

  return useQuery({
    queryFn: getQuery(url),
    queryKey: DeliveryManApi.getOrders,
    keepPreviousData: true,
  })
}