import { Box } from "@mui/material"
import { Board } from "@shared/ui"
import { useGetOrders } from "../api/useGetOrders"
import { OrdersTable } from "@entities/orders"
import { useOrdersFilterStore } from "@features/orders"
// import { SelectOrderStatus } from '@features/orders/change-status/ui/select-order-status'
import { CourierActions } from '@features/couriers'
import { CourierOrderStatusSelect } from '@features/orders/change-status/ui/courier-order-status'

export const Main = () => {
    const {data, isFetching, error} = useGetOrders()
      const {
        paginationModel,
        changePaginationModel,
        changeStatuses,
        clearFilter,
      } = useOrdersFilterStore(
        ({
          paginationModel,
          changePaginationModel,
          changeStatuses,
          clearFilter,
        }) => ({
          paginationModel,
          changePaginationModel,
          changeStatuses,
          clearFilter,
        }),
      )
    return (
        <Board>
            <Box>
                <OrdersTable
                    data={{
                        data: data as any, 
                        meta: {
                            total: 0,
                            current_page: 1,
                            per_page: 25,
                        }
                    }}
                    isFetching={isFetching}
                    paginationModel={paginationModel}
                    changePaginationModel={changePaginationModel}
                    ChangeStatus={CourierOrderStatusSelect}
                    Actions={CourierActions as any}
                    error={error}
                />
            </Box>
        </Board>
    )
}