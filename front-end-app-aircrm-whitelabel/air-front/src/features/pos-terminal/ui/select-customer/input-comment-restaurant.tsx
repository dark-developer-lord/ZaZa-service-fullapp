import { FormControl, TextField } from '@mui/material'

import { useCartStore } from '../../model/cart-store'

export const InputCommentRestaurant = () => {
  const [commentForRestaurant, setCommentForRestaurant] = useCartStore(
    (state) => [state.commentForRestaurant, state.setCommentForRestaurant],
  )

  return (
    <FormControl
      fullWidth
    >
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        label="Коментария к ресторану"
        value={commentForRestaurant}
        onChange={(event) => {
          setCommentForRestaurant(event.target.value)
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: 'white',
            borderRadius: '16px',
          },
        }}
      />
    </FormControl>
  )
}
