import { useState } from 'react'
import toast from 'react-hot-toast'
import { useMutation, useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { useGetLoginSource } from '@shared/auth'
import { LoadingButton } from '@mui/lab'
import {
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

import { useCartStore } from '@features/pos-terminal'

import { AvailableDeliveryMan } from '@entities/orders'
import { ApiKeys, getApiPaths, getQuery, postQuery, queryClient } from '@shared/api'
import { formatPhoneNumber, generateArray } from '@shared/lib'
import CloseIcon from '@icons/close.svg?react'

interface Props {
  open: boolean
  onClose: () => void
}

export const Modal = ({ open, onClose }: Props) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))
  const { id: orderId } = useParams()
  const loginSource = useGetLoginSource()
  const [activeCourierId, setActiveCourierId] = useState<number | null>(null)

  const [setDeliveryMan] = useCartStore(state => [state.setDeliveryMan])

  /** Get available courier for this order */
//   const { data } = useQuery({
//     queryKey: [ApiKeys.Orders.availableOrderCouriers + orderId],
//     queryFn: getQuery<{ data: AvailableDeliveryMan[] }>(
//       Api.getAvailableCouriers_ + orderId,
//     ),
//     enabled: open,
//   })

  /** Get all couriers */
  const { data } = useQuery({
    queryKey: [ApiKeys.Couriers.getCouriers],
    queryFn: getQuery<{ data: AvailableDeliveryMan[] }>(getApiPaths().getCouriersList),
    enabled: open,
  })

  /** assign courier */
  const { isLoading: isAssignLoading } = useMutation({
    mutationKey: [ApiKeys.Orders.assignCourier_ + orderId + activeCourierId],
    mutationFn: postQuery(
      getApiPaths().assignCourier_ + orderId + `/${activeCourierId}`,
    ),
    onSuccess: () => {
      toast.success('Курьер успешно назначен')
      onClose()
      queryClient.refetchQueries({
        queryKey: [ApiKeys.Orders.getOrder_ + orderId],
      })
    },
  })

  const selectCourier = (courierId: number) => {
    setActiveCourierId(courierId)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={ loginSource === 'vendor' ? {
        '& .MuiDialog-paper': {
          mx: 2,
          width: '100%',
          minWidth: 0,
          alignItems: 'center'
        }
      } : {}}
      PaperProps={{
        sx: {minWidth: {xs: '328px', mobile: '480px'}}
      }}
    >
      <DialogTitle>Назначить курьера</DialogTitle>
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 24,
          right: 24,
        }}
      >
        <CloseIcon
          width={24}
          height={24}
        />
      </IconButton>
      <DialogContent>
        <CourierList
          list={data?.data}
          activeCourierId={activeCourierId}
          selectCourier={selectCourier}
        />
        {data && data.data.length > 0 && (
          <LoadingButton
            fullWidth
            size={isMobile ? 'medium' : 'large'}
            sx={{ mt: '24px' }}
            loading={isAssignLoading}
            onClick={() => {
              if (activeCourierId) {
                // mutate(null)
                setDeliveryMan(data.data.find(courier => courier.id === activeCourierId) ?? null)
                toast.success('Курьер успешно назначен')
                onClose()
              } else {
                toast('Выберите курьера')
              }
            }}
          >
            Назначить
          </LoadingButton>
        )}
      </DialogContent>
    </Dialog>
  )
}

interface CourierListProps {
  list?: AvailableDeliveryMan[]
  activeCourierId: number | null
  selectCourier: (courierId: number) => void
}

const CourierList = ({
  list,
  activeCourierId,
  selectCourier,
}: CourierListProps) => {
  if (!list) {
    return (
      <List disablePadding>
        {generateArray(5).map((key) => (
          <ListItem key={key}>
            <ListItemAvatar>
              <Skeleton
                variant="circular"
                width={44}
                height={44}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Skeleton
                  width="80%"
                  variant="text"
                />
              }
              secondary={
                <Skeleton
                  width="80%"
                  variant="text"
                />
              }
            />
          </ListItem>
        ))}
      </List>
    )
  }

  if (list.length === 0) {
    return (
      <Typography
        variant="large"
        component="p"
        sx={{ py: '24px', textAlign: 'center' }}
      >
        Нет доступных курьеров
      </Typography>
    )
  }

  return (
    <List disablePadding>
      {list.map((courier) => (
        <ListItem key={courier.id}>
          <ListItemButton
            sx={{
              bgcolor:
                activeCourierId === courier.id ? '#FEECDC' : 'transparent',
              '&:hover': {
                bgcolor: activeCourierId === courier.id ? '#FEECDC' : '#F9F9F9',
              },
            }}
            onClick={() => selectCourier(courier.id)}
          >
            <ListItemAvatar>
              <Avatar
                src={courier.avatar ?? undefined}
                alt={courier.f_name || courier.l_name || ''}
                sx={{ width: 44, height: 44 }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={`${courier.f_name || ''} ${courier.l_name || ''}`}
              secondary={formatPhoneNumber(courier.phone)}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}
