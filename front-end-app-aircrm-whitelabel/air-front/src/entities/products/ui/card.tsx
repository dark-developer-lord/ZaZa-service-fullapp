import { ReactNode } from 'react'
import {
  Card as MuiCard,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from '@mui/material'

import { normalizeNumber } from '@shared/lib'

import { Food, ProductVariation } from '../../finance/model/food'

interface Props {
  food: Food
  ButtonComponent?: ReactNode
}

// Type guard to check if variations are ProductVariation[]
const isProductVariations = (variations: any[]): variations is ProductVariation[] => {
  return variations.length > 0 && 'variation_id' in variations[0]
}

export const Card = ({ food, ButtonComponent }: Props) => {
  // Support both old and new API response structures
  const productName = food.product_name || food.name || ''
  const productImage = food.image || '/placeholder-image.png'
  const productQuantity = typeof food.quantity === 'string' ? parseFloat(food.quantity) : food.quantity

  // Calculate price based on variations
  let productPrice = food.retail_price ?? food.price ?? 0

  // If product has variations, get the minimum price from variations
  if (food.variations && food.variations.length > 0) {
    if (isProductVariations(food.variations)) {
      // New variation structure - get minimum sale_price
      const productVariations = food.variations as ProductVariation[]
      const prices = productVariations.map(v => v.sale_price).filter(p => p > 0)
      if (prices.length > 0) {
        productPrice = Math.min(...prices)
      }
    } else {
      // Old variation structure - get minimum price
      const prices = food.variations.map(v => (v as any).price).filter(p => p > 0)
      if (prices.length > 0) {
        productPrice = Math.min(...prices)
      }
    }
  }

  return (
    <MuiCard>
      <CardMedia
        component="img"
        height="140"
        image={productImage}
        alt={productName}
      />
      <CardContent>
        <Typography
          variant='xs'
          color="text.secondary"
          component="p"
          fontWeight={500}
        >
          {food.variations && food.variations.length > 0 ? (
            <Typography variant="xs"
              color="text.secondary"
              component="p"
              fontWeight={500}>
              {isProductVariations(food.variations)
                ? (food.variations as any[]).map((v: any) => v.variation_type).join(', ')
                : food.variations.map((v) => (v as any).type).join(', ')
              }
            </Typography>
          ) : (
            <Typography
              variant="xs"
              component="p"
              fontWeight={500}
              color="#F5F5F5">Неизв.</Typography>
          )}
        </Typography>
        <Typography
          variant="small"
          fontWeight={600}
          component="h3"
          sx={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
          title={productName}
        >
          {productName}
        </Typography>
        <Typography
          variant="xs"
          color="text.secondary"
          component="p"
          fontWeight={500}
        >
          {normalizeNumber(productPrice)} сомони
        </Typography>
      </CardContent>
      <CardActions>
        { productQuantity > 0 ? ButtonComponent : <Button disabled size='small' fullWidth>Нет в наличии</Button>}
        {/* {ButtonComponent} */}
      </CardActions>
    </MuiCard>
  )
}
