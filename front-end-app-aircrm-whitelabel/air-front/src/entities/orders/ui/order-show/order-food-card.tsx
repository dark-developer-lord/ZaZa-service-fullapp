import { Box, Stack, styled, Tooltip, Typography } from '@mui/material'

import { OrderFood } from '../../model/order-show-types'

interface Props {
  food: OrderFood
}

export const OrderFoodCard = ({ food }: Props) => {
  // Helper function to render variation
  const renderVariation = () => {
    if (!food.variation) return null

    // New variation structure (object with variation_type)
    if (typeof food.variation === 'object' && !Array.isArray(food.variation)) {
      return (
        <Typography
          variant="small"
          color="text.secondary"
        >
          Вариация: {food.variation.variation_type}
        </Typography>
      )
    }

    // Old variation structure (string array)
    if (Array.isArray(food.variation) && food.variation.length > 0) {
      return (
        <Typography
          variant="small"
          color="text.secondary"
        >
          Вариация: {food.variation.join(', ')}
        </Typography>
      )
    }

    return null
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Image
        src={food.details.image}
        alt={food.details.name}
        width={112}
        height={112}
      />
      <Stack spacing="4px">
        <Typography
          variant="medium"
          fontWeight={600}
        >
          {food.details.name}
        </Typography>
        <Typography
          variant="small"
          color="text.secondary"
        >
          {food.price * food.quantity + food.total_add_on_price} сомони
        </Typography>
        {renderVariation()}
        <Typography sx={{ ml: 'auto', fontWeight: 500 }}>
          Заказал: {food.audit_log?.original_quantity ?? food.quantity}
        </Typography>
        <Typography sx={{ ml: 'auto', fontWeight: 500 }}>
          Купил: {food.audit_log?.new_quantity ?? food.quantity}
        </Typography>
        {/* {food.add_ons.length > 0 && (
          <Tooltip
            title={food.add_ons.map((addOn) => addOn.name).join(', ')}
            sx={{ fontSize: '13px' }}
          >
            <Typography
              variant="small"
              sx={{ color: 'primary.main', cursor: 'pointer', mb: '8px' }}
            >
              Есть дополнения
            </Typography>
          </Tooltip>
        )} */}
      </Stack>
      <Typography sx={{ ml: 'auto', fontWeight: 500 }}>
        {food.quantity} x {food.price + food.total_add_on_price} сомони
      </Typography>
    </Box>
  )
}

const Image = styled('img')`
  width: 112px;
  height: 112px;
  object-fit: cover;
  border-radius: 12px;
  display: block;
  overflow: hidden;
  margin-right: 12px;
  flex-shrink: 0;
`
