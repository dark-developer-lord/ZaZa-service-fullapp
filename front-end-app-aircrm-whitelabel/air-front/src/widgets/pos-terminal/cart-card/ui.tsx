import { Fragment, useEffect, useState } from 'react'
import { Box, Button, Divider, Typography } from '@mui/material'

import { CartCounter, useCartStore } from '@features/pos-terminal'
import { GlobalDiscount } from '@features/pos-terminal/ui/global-discount'
import { CartFoodCard } from '@entities/cart'
import { CollapsibleCard } from '@shared/ui'

export const CartCard = () => {
  const { clearCart, foods, removeFoodByKey, setCustomPrice, globalDiscount, globalDiscountType } = useCartStore()
  const [expanded, setExpanded] = useState(false)

  const globalDiscountActive = globalDiscount !== null && globalDiscount > 0

  // Auto-expand when items are added to cart
  useEffect(() => {
    if (foods.length > 0) {
      setExpanded(true)
    }
  }, [foods.length])

  return (
    <CollapsibleCard
      title="Корзина"
      defaultExpanded={false}
      expanded={expanded}
      onToggle={setExpanded}
      sx={{ mb: 2, bgcolor: 'white' }}
    >
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            mb: '24px',
          }}
        >
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
    </CollapsibleCard>
  )
}
