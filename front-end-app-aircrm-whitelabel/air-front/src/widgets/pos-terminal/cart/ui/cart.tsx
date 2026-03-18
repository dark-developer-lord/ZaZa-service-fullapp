import { Fragment } from 'react'
import { Box, Button, Divider, Typography } from '@mui/material'

import { CartCounter, useCartStore } from '@features/pos-terminal'
import { GlobalDiscount } from '@features/pos-terminal/ui/global-discount'
import { CartFoodCard } from '@entities/cart'

export const Cart = () => {
  const { clearCart, foods, removeFoodByKey, setCustomPrice, globalDiscount, globalDiscountType } = useCartStore()

  // Check if global discount is active
  const globalDiscountActive = globalDiscount !== null && globalDiscount > 0

  return (
    <Box sx={{ mb: '48px' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: '24px',
        }}
      >
        <Typography variant="h6">Корзина</Typography>
        {foods.length > 0 && (
          <Button
            size="small"
            onClick={clearCart}
            color="secondary"
          >
            Очистить
          </Button>
        )}
      </Box>
      <Divider sx={{ mb: '24px' }} />

      {/* Global Discount Component */}
      <GlobalDiscount />

      {foods.length === 0 && (
        <Typography
          variant="body1"
          align="center"
          sx={{ py: '48px' }}
        >
          Корзина пуста
        </Typography>
      )}
      {foods.map((food, index) => {
        return (
          <Fragment key={food.foodKey}>
            <CartFoodCard
              food={food}
              removeFood={() => removeFoodByKey(food.foodKey)}
              Counter={CartCounter as any}
              setCustomPrice={setCustomPrice}
              globalDiscountActive={globalDiscountActive}
              globalDiscountType={globalDiscountType}
            />
            {index < foods.length - 1 && <Divider sx={{ my: '24px' }} />}
          </Fragment>
        )
      })}
    </Box>
  )
}
