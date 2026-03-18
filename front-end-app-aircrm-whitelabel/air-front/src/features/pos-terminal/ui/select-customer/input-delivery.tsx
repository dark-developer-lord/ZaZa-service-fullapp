import { FormControl, TextField } from '@mui/material'

import { useCartStore } from '../../model/cart-store'

export const InputDelivery = () => {
  const [delivery, setDelivery] = useCartStore((state) => [
    state.delivery,
    state.setDelivery,
  ])
  
  
  return (
    <FormControl
      fullWidth
    >
      <TextField
        fullWidth
        variant="outlined"
        label="Сумма доставки"
        value={delivery ?? 0}
        onChange={(event) => {
          setDelivery(Number(event.target.value) as unknown as number)
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: 'white',
            borderRadius: '12px',
          },
        }}
      />
    </FormControl>
  )
}
