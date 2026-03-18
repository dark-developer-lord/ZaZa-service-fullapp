import { Link } from 'react-router-dom'
import { Stack } from '@mui/material'
import { useMutation } from 'react-query'
import { Order } from '@entities/orders'
import { RouterPaths } from '@shared/lib'
import { EditButton } from '@shared/ui'
import {useState} from 'react'
import { ReceiptButton } from './ui/receipt-button'
import { ShowItemDetails } from '@entities/courier/ui/show-item-details'
import { ShowButton } from '@shared/ui'
import { getApiPaths, ApiKeys, deleteQuery, queryClient } from '@shared/api'
interface Props {
  row: Order
}


export const Ui = ({ row }: Props) => {
  const [openModal, setOpenModal] = useState(false)
  
  const { mutateAsync } = useMutation({
      mutationKey: [ApiKeys.Couriers.getCouriers],
      mutationFn: deleteQuery(getApiPaths().deleteCourier_ + row.id),
      onSuccess: () => {
        queryClient.refetchQueries(ApiKeys.Couriers.getCouriers)
      },
    })
    
  return (
    <Stack
      direction="row"
      spacing="12px"
      sx={{ height: '100%', alignItems: 'center' }}
    >
      <EditButton
        component={Link}
        to={RouterPaths.orders_ + row.id}
        size="small"
      />
        {row.status === "picked_up" && (
          <ShowButton onClick={() => setOpenModal(true)} />
        )}
        <ShowItemDetails
        open={openModal}
        onClose={() => setOpenModal(false)}
        order={row}
      />
      <ReceiptButton orderId={row.id}/>
    </Stack>
  )
}
