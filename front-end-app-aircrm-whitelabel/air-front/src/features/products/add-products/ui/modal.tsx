import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Grid,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import GridCloseIcon from '@icons/close.svg?react'

import { addProductsSchema, AddProductsDto } from '../model/dto'
import { useAddProducts } from '../api'

interface Props {
  open: boolean
  onClose: () => void
  productId: string | number
}

export const AddProductsModal = ({ open, onClose, productId }: Props) => {
  const { mutate, isLoading } = useAddProducts(productId)
  
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddProductsDto>({
    defaultValues: {
      product_count: 0,
      purchase_price: 0,
    },
    resolver: yupResolver(addProductsSchema),
  })

  const onSubmit = (data: AddProductsDto) => {
    const formattedData = {
      product_count: Number(data.product_count),
      purchase_price: Number(data.purchase_price),
    }

    mutate(formattedData, {
      onSuccess: () => {
        reset()
        onClose()
      },
    })
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    handleSubmit(onSubmit)(e)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: { xs: 'calc(100vw - 32px)', sm: 480 },
          maxWidth: { xs: 'calc(100vw - 32px)', sm: 520 },
          m: { xs: 2, sm: 'auto' },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        Добавить товар
        <IconButton onClick={handleClose} size="small">
          <GridCloseIcon width={24} height={24} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Stack
          component="form"
          onSubmit={handleFormSubmit}
          spacing={3}
          sx={{ marginTop:'6px'}}
        >
          <Stack spacing={2.5}>
            <Controller
              name="product_count"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Количество"
                  type="text"
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  fullWidth
                  size="medium"
                  onChange={(e) => {
                    const value = e.target.value.replace(',', '.')
                    if (/^\d*\.?\d{0,2}$/.test(value)) {
                      field.onChange(value)
                    }
                  }}
                  onKeyDown={(e) => {
                    const invalidKeys = ['ArrowUp', 'ArrowDown', 'e', 'E', '+', '-']
                    if (invalidKeys.includes(e.key)) {
                      e.preventDefault()
                    }
                  }}
                  inputProps={{
                    inputMode: 'decimal',
                    pattern: '[0-9]*[.,]?[0-9]*',
                    style: {
                      MozAppearance: 'textfield',
                    },
                  }}
                  sx={{
                    '& input[type=number]::-webkit-outer-spin-button': {
                      WebkitAppearance: 'none',
                      margin: 0,
                    },
                    '& input[type=number]::-webkit-inner-spin-button': {
                      WebkitAppearance: 'none',
                      margin: 0,
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    },
                  }}
                />
              )}
            />

            <Controller
              name="purchase_price"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Цена закупки"
                  type="text"
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  fullWidth
                  size="medium"
                  onChange={(e) => {
                    const value = e.target.value.replace(',', '.')
                    field.onChange(value)
                  }}
                  inputProps={{
                    inputMode: 'decimal',
                    pattern: '[0-9]*[.,]?[0-9]*',
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    },
                  }}
                />
              )}
            />
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            sx={{
              pt: 1,
              '& .MuiButton-root': {
                height: 48,
                borderRadius: 1,
                fontSize: '16px',
                fontWeight: 500,
              }
            }}
          >
            <Button
              variant="outlined"
              fullWidth
              onClick={handleClose}
              disabled={isLoading}
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: 'primary.50',
                },
              }}
            >
              Отмена
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              fullWidth
              loading={isLoading}
              sx={{
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              Добавить
            </LoadingButton>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
