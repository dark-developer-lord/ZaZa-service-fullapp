import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'

import { Food, ProductVariation } from '@entities/products'

interface Props {
  food: Food
  selectedVariations: Record<string, string>
  setSelectedVariations: (value: Record<string, string>) => void
}

// Type guard to check if variations are ProductVariation[]
const isProductVariations = (variations: any[]): variations is ProductVariation[] => {
  return variations.length > 0 && 'variation_id' in variations[0]
}

export const FoodOptions = ({
  food,
  selectedVariations,
  setSelectedVariations,
}: Props) => {
  // Check if we have the new variation structure
  if (food.variations && food.variations.length > 0 && isProductVariations(food.variations)) {
    const variations = food.variations as ProductVariation[]
    const variationName = (food as any).variation_name || 'Вариация'

    // Remove duplicates based on variation_id (defensive code for backend issues)
    const uniqueVariations = variations.filter((variation, index, self) =>
      index === self.findIndex((v) => v.variation_id === variation.variation_id)
    )

    return (
      <FormControl fullWidth>
        <FormLabel
          id="product-variations"
          sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}
        >
          {variationName}
        </FormLabel>
        <RadioGroup
          aria-labelledby="product-variations"
          name="product-variations"
          value={selectedVariations['variation_id'] || ''}
          onChange={(e) => {
            setSelectedVariations({
              variation_id: e.target.value,
            })
          }}
        >
          {uniqueVariations.map((variation, index) => {
            const isOutOfStock = variation.quantity <= 0
            return (
              <FormControlLabel
                key={`${variation.variation_id}_${index}`}
                value={variation.variation_id}
                control={<Radio />}
                disabled={isOutOfStock}
                label={
                  <Typography
                    variant="body1"
                    sx={{
                      color: isOutOfStock ? 'text.disabled' : 'text.primary',
                    }}
                  >
                    {variation.variation_type} - {variation.attribute_value} - {variation.sale_price} сомони
                    {isOutOfStock && ' (Нет в наличии)'}
                    {!isOutOfStock && ` (В наличии: ${variation.quantity})`}
                  </Typography>
                }
              />
            )
          })}
        </RadioGroup>
      </FormControl>
    )
  }

  // Handle optional choice_options (old API structure for backward compatibility)
  if (!food.choice_options || food.choice_options.length === 0) {
    return null
  }

  return (
    <>
      {food.choice_options.map((option) => (
        <FormControl
          key={option.name}
          fullWidth
        >
          <FormLabel
            id={option.name}
            sx={{ fontWeight: 600, color: 'text.primary' }}
          >
            {option.title}
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby={option.name}
            name={option.name}
            value={selectedVariations[option.name] || ''}
            defaultValue=""
            onChange={(e) =>
              setSelectedVariations({
                ...selectedVariations,
                [option.name]: e.target.value,
              })
            }
          >
            {option.options.map((value) => (
              <FormControlLabel
                key={value}
                value={value}
                control={<Radio />}
                label={value}
              />
            ))}
          </RadioGroup>
        </FormControl>
      ))}
    </>
  )
}
