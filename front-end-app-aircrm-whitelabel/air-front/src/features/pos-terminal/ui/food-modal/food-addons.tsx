import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Typography,
} from '@mui/material'

import { Food } from '@entities/products'

interface Props {
  food: Food
  selectedAddons: number[]
  setSelectedAddons: (value: number[]) => void
}

export const FoodAddons = ({
  food,
  selectedAddons,
  setSelectedAddons,
}: Props) => {
  return (
    <FormGroup sx={{ mt: 2 }}>
      <FormLabel sx={{ fontWeight: 600, color: 'text.primary' }}>
        Дополнения
      </FormLabel>
      {food.add_ons?.map((addOn) => (
        <FormControlLabel
          key={addOn.id}
          control={
            <Checkbox
              checked={selectedAddons.includes(addOn.id)}
              value={addOn.id}
              onChange={() => {
                if (!selectedAddons.includes(addOn.id)) {
                  setSelectedAddons([...selectedAddons, addOn.id])
                } else {
                  setSelectedAddons(
                    selectedAddons.filter((id) => id !== addOn.id),
                  )
                }
              }}
            />
          }
          label={
            <>
              {addOn.name}{' '}
              {selectedAddons.includes(addOn.id) && (
                <Typography
                  color="text.tertiary"
                  component="span"
                  variant="medium"
                >
                  (+{addOn.price} сомони)
                </Typography>
              )}
            </>
          }
        />
      ))}
    </FormGroup>
  )
}
