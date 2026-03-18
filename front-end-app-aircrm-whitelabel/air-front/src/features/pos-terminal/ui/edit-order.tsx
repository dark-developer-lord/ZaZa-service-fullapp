import toast from 'react-hot-toast'
import { Link, useParams } from 'react-router-dom'
import { LoadingButton } from '@mui/lab'
import { Button, Grid, useMediaQuery, useTheme } from '@mui/material'

import { RouterPaths } from '@shared/lib'

import { useEditOrder } from '../api/submit-edit-order'
import { useCartStore } from '../model/cart-store'

export const EditOrder = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))
  const { id } = useParams()
  const { submitOrder, isLoading } = useEditOrder()
  const [existFoods, isNotAvailableFoods] = useCartStore((state) => [
    state.foods.length > 0,
    state.foods.some((food) => food.isNotAvailable),
  ])

  return (
    <Grid
      container
      spacing="24px"
      mt="24px"
    >
      <Grid
        item
        xs={6}
      >
        <Button
          fullWidth
          variant="outlined"
          size={isMobile ? 'medium' : 'large'}
          component={Link}
          to={RouterPaths.orders_ + id}
        >
          Отмена
        </Button>
      </Grid>
      <Grid
        item
        xs={6}
      >
        <LoadingButton
          fullWidth
          variant="contained"
          size={isMobile ? 'medium' : 'large'}
          onClick={() => {
            if (!existFoods) {
              toast.error('Добавьте товар в корзину')
            }
            if (isNotAvailableFoods) {
              toast.error('Удалите недоступные товары из корзины')
            }
            if (existFoods && !isNotAvailableFoods) {
              submitOrder()
            }
          }}
          loading={isLoading}
        >
          Сохранить
        </LoadingButton>
      </Grid>
    </Grid>
  )
}
