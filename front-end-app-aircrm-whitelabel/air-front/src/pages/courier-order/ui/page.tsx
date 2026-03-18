import { LayoutContent } from "@widgets/layout"
import { DeliveryManOrders } from "@widgets/courier-order"
import { useGetDeliveryManProfile } from "@features/auth"
import { Board, PageLoader } from "@shared/ui"
import { NetworkError } from "@widgets/network-error"


export const Page = () => {
  const {isFetching, error } = useGetDeliveryManProfile()

  if (isFetching) {
    return <PageLoader />
  }

  if (error) {
    return <NetworkError />
  }
  
  return (
    <Board>
      <LayoutContent title="Заказы"
        breadcrumbs={[
          {
            label: 'Заказы',
            name: 'courier-orders',
          },
        ]}
      >
        <DeliveryManOrders />
      </LayoutContent>
    </Board>
  )
}