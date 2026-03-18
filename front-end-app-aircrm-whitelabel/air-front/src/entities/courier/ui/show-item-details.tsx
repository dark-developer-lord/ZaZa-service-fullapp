import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
  Typography,
  Box,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Divider,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone'
import { useState, useEffect } from 'react'
import { useMutation } from 'react-query'
import { OrderStatus, orderStatusLabels } from '@shared/lib'
import { postQuery, getApiPaths, ApiKeys, DeliveryManApi } from '@shared/api'
import toast from 'react-hot-toast'
type Props = {
  open: boolean
  onClose: () => void
  order?: {
    customer: {
      id: number
      f_name: string
      phone: string
    }
    comment?: string
    products?: {
      id: number
      name: string
      image: string
      quantity: number
      price: number
      details: {
        name: string
        image: string
      }
    }[]
  }
}

type EditableProduct = {
  id: number
  quantity: number
  maxQuantity: number
  status: OrderStatus
}

export const ShowItemDetails = ({ open, onClose, order  }: Props) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))

  const [editedProducts, setEditedProducts] = useState<EditableProduct[]>([])
if (!order || !order.customer) return null
  const { mutate, isLoading } = useMutation({
      mutationKey: [ApiKeys.Orders.changeStatus],
      mutationFn: postQuery(
        import.meta.env.VITE_APP_API_URL + '/v1' + DeliveryManApi.changeIndividualOrderStatus
      ),
      onSuccess: () => {
        toast.success('Заказ успешно обновлён');
        window.location.reload() // Refetch the order data after mutation is successful
        onClose();
      },
      onError: () => {
        toast.error('Ошибка при изменении заказа');
      },
    });

  useEffect(() => {
    if (order.products) {
      const initialState = order.products.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        maxQuantity: item.quantity,
        status: ((item as any).status ?? OrderStatus.picked_up) as OrderStatus,
      }))
      setEditedProducts(initialState)
    }
  }, [order.products, open])

  const updateProduct = (id: number, changes: Partial<EditableProduct>) => {
    setEditedProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...changes } : p))
    )
  }

  const handleSubmitChanges = () => {
    const payload = {
        id: (order as any).id,
        products: editedProducts.map(({ id, quantity, status }) => ({
            product_id: id,
            quantity,
            status,
        })),
        individual: true,
    }

    mutate(payload as any)
    }


  return (
    <Dialog open={open} onClose={onClose} fullScreen={isMobile} maxWidth="sm" fullWidth>
      <DialogTitle
        fontWeight="bold"
        fontSize={isMobile ? '1.1rem' : '1.3rem'}
        sx={{ px: isMobile ? 2 : 3, pt: isMobile ? 2 : 3 }}
      >
        Информация о покупки
      </DialogTitle>

      <DialogContent dividers sx={{ px: isMobile ? 2 : 3, py: isMobile ? 1 : 2 }}>
        {/* 🟩 Product List Section */}
        <Box mt={1}>
      <Box display="flex" flexDirection="column" gap={2}>
        {order.products?.map((item) => {
          const local = editedProducts.find((p) => p.id === item.id);
          if (!local) return null;

          return (
            <Box
              key={item.id}
              sx={{
                width: '100%',
                border: '1px solid #EEEEEE',
                borderRadius: 1.5,
                display: 'flex',
                overflow: 'hidden',
              }}
            >
              {/* Image */}
              <Box
                component="img"
                src={item.details.image || '/placeholder.png'}
                alt={item.name}
                sx={{
                  width: 120,
                  height: '100%',
                  objectFit: 'cover',
                  p: 2,
                  borderRadius: 2.5,
                }}
              />

              {/* Info + Controls */}
              <Box
                sx={{
                  flex: 1,
                  padding: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography fontWeight={500} fontSize={14}>
                    {item.details.name}
                  </Typography>
                  <Typography fontWeight={500} fontSize={18}>
                    {item.price * local.quantity} с.
                  </Typography>
                  <Typography fontSize={13}>
                    Макс. кол-во: {item.quantity} шт.
                  </Typography>
                </Box>

                {/* Counter + Status */}
                <Box mt={1} display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                  {/* Counter */}
                  <Box display="flex" alignItems="center" border="1px solid #ccc" borderRadius={1}>
                    <IconButton
                      size="small"
                      onClick={() =>
                        updateProduct(item.id, { quantity: Math.max(1, local.quantity - 1) })
                      }
                    >
                      <RemoveIcon />
                    </IconButton>
                    <TextField
                      type="number"
                      size="small"
                      value={local.quantity}
                      onChange={(e) => {
                        const val = Math.max(1, Math.min(item.quantity, parseInt(e.target.value) || 1));
                        updateProduct(item.id, { quantity: val });
                      }}
                      inputProps={{
                        style: { textAlign: 'center', width: 40 },
                        min: 1,
                        max: item.quantity,
                      }}
                      variant="standard"
                    />
                    <IconButton
                      size="small"
                      onClick={() =>
                        updateProduct(item.id, { quantity: Math.min(item.quantity, local.quantity + 1) })
                      }
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>

                  {/* Status Dropdown */}
                  <Select
                    size="small"
                    value={local.status} // Bind status to local status
                    onChange={(e) => updateProduct(item.id, { status: e.target.value as OrderStatus })}
                    sx={{
                      borderRadius: '12px',
                      backgroundColor: orderStatusLabels[local.status].color + '.main', // Update this to local status
                      color: orderStatusLabels[local.status].color ? 'white' : 'black',
                      fontSize: { xs: '9px', mobile: '13px' },
                      minWidth: 120,
                    }}
                  >
                    <MenuItem value={OrderStatus.picked_up}>
                      {orderStatusLabels[OrderStatus.picked_up].label}
                    </MenuItem>
                    <MenuItem value={OrderStatus.delivered}>
                      {orderStatusLabels[OrderStatus.delivered].label}
                    </MenuItem>
                    <MenuItem value={OrderStatus.postponed}>
                      {orderStatusLabels[OrderStatus.postponed].label}
                    </MenuItem>
                    <MenuItem value={OrderStatus.canceled}>
                      {orderStatusLabels[OrderStatus.canceled].label}
                    </MenuItem>
                  </Select>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>

        {/* 🟦 order Info */}
        <Box mt={2}>
          <Divider sx={{ mb: 2 }} />
          <Typography fontSize={18} mb={2}>
            <strong>Клиент</strong>
          </Typography>
          <Typography><strong>Имя:</strong> {order.customer.f_name}</Typography>
          <Typography><strong>Телефон:</strong> {order.customer.phone}</Typography>
        </Box>

        {/* 🟧 Comment Section */}
        <Divider sx={{ mt: 2 }} />
        <Box mt={2}>
          <Typography fontSize={18} mb={2}><strong>Комментарий клиента</strong></Typography>
          <TextField value={order.comment || 'Нет комментариев'} disabled fullWidth />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: isMobile ? 2 : 3, pb: isMobile ? 2 : 3 }}>
        <Button onClick={onClose} variant="outlined" fullWidth={isMobile}>
          Закрыть
        </Button>
        <Button onClick={handleSubmitChanges} color="warning" fullWidth={isMobile}>
          Изменить заказ
        </Button>
        <a href={`tel:${order.customer.phone}`} style={{ textDecoration: 'none' }}>
          <Button fullWidth={isMobile} color="success">
            <LocalPhoneIcon />
            <span style={{ marginLeft: 8 }}>Позвонить</span>
          </Button>
        </a>
      </DialogActions>
    </Dialog>
  )
}
