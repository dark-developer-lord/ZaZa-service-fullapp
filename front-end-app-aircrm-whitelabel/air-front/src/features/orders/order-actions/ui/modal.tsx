import { useQuery } from 'react-query'
import { Api, ApiKeys, getApiPaths, getQuery } from '@shared/api'

import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Stack,
    Paper
} from '@mui/material'

import { InfoItem } from '@shared/ui'
import CloseIcon from '@icons/close.svg?react'
import { LoadingButton } from '@mui/lab'

interface Props {
    open: boolean
    onClose: () => void,
    orderId: number
}

interface OrderReceiptItem {
    id: number,
    price: number,
    variation: [],
    quantity: number,
    name: string
}

interface OrderReceipt {
    source: string,
    source_logo: null,
    order_id: number,
    source_phone: string,
    created_at: string,
    total_product_price: string,
    delivery_charge: number,
    details: OrderReceiptItem[],
    total_price: number
}

export const Modal = ({ open, onClose, orderId }: Props) => {
    const { data } = useQuery({
        queryKey: [ApiKeys.Orders.getOrderReceipt_],
        queryFn: getQuery<{ data: OrderReceipt }>(getApiPaths().getOrderReceipt_ + orderId),
        enabled: open,
    })

    return (
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
            sx: {minWidth: {xs: '328px', mobile: '480px'}}
        }}
      >
        <DialogTitle
            sx={{
                fontSize: 20,
                lineHeight: 1.2,
                fontWeight: 600
            }}
        >Печать чека</DialogTitle>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
          }}
        >
          <CloseIcon
            width={24}
            height={24}
          />
        </IconButton>
        <DialogContent>
            { data && data.data && (
                <>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing="12px"
                >
                    <Box>
                        <Typography variant='h6' fontWeight={600}>{ data.data.source }</Typography>
                        <Stack spacing="4px">
                            <div>Заказ № { data.data.order_id}</div>
                            <div>Телефон: { data.data.source_phone}</div>
                            <div>Дата { data.data.created_at}</div>
                        </Stack>
                    </Box>
                    {/* <Box>
                        <img src={data.data.source_logo || ''} width='150' height='144'/>
                    </Box> */}
                </Stack>
                <TableContainer>
                    <Table sx={{
                        my: '24px',
                        maxHeight: "268px",
                        '& .MuiTableCell-root':  {
                            borderBottom: 'none'
                        }
                    }} aria-label="">
                        <TableHead>
                            <TableRow>
                                <TableCell>Название</TableCell>
                                <TableCell>Кол-во</TableCell>
                                <TableCell>Цена</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {data.data.details.map((product) => (
                            <TableRow
                                key={product.id}
                            >
                                <TableCell component="th" scope="row">{product.name}</TableCell>
                                <TableCell>{product.quantity}</TableCell>
                                <TableCell>{product.price}с</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </TableContainer>
                <Divider sx={{ mb: '12px' }} />
                <Stack>
                    <InfoItem
                        label="Цена товара:"
                        total={ Number(data.data.total_product_price) }
                    />
                    <InfoItem
                        label="Дополнения"
                        total={0}
                    />
                    <InfoItem
                        label="Оплата за  доставку"
                        total={ data.data.delivery_charge }
                    />
                    <InfoItem
                        label="Общий итог:"
                        total={ data.data.total_price }
                    />
                </Stack>
                <Divider sx={{ mt: '12px', mb: '24px' }} />
                <Button fullWidth>Распечатать чек</Button>
                </>
            )}
        </DialogContent>
      </Dialog>
    )
  }