import { FormControl, TextField } from '@mui/material'

import { useCartStore } from '../../model/cart-store'

export const  InputComment = () => {
  const [comment, setComment] = useCartStore((state) => [
    state.comment,
    state.setComment,
  ])
  return (
    <FormControl fullWidth>
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        label="Комментарий"
        value={comment || ''}
        onChange={(event) => {
          setComment(event.target.value)
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
