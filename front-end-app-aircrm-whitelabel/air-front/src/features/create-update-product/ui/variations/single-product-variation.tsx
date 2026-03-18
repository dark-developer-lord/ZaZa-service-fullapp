import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  Button,
  Stack,
} from '@mui/material'

import { Board } from '@shared/ui'
import { useGetAttributes } from '@entities/attribute'
import { VariationDetail } from '../../model/variation-types'
import { palette } from '@shared/theme/palette'

interface Props {
  details: VariationDetail
  onUpdate: (field: keyof VariationDetail, value: string | number) => void
  errors: {
    attributeId?: string
    attributeValue?: string
    costPrice?: string
    salePrice?: string
    quantity?: string
    barcode?: string
  }
  onProcessProduct: () => void
}

export const SingleProductVariation = ({ details, onUpdate, errors, onProcessProduct }: Props) => {
  // Fetch attributes for dropdown
  const { data: attributesData, isLoading: attributesLoading } = useGetAttributes({
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  return (
    <Board>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb="24px">
        <Typography variant="h6">
          Добавление товара
        </Typography>
        <Button
          variant="contained"
          onClick={onProcessProduct}
          sx={{
            bgcolor: palette.primary.main,
            color: 'white',
            '&:hover': {
              bgcolor: palette.primary.dark,
            },
          }}
        >
          Оприходовать товар
        </Button>
      </Stack>

      <Grid container spacing="16px">
        {/* Top Row: Атрибут, Название атрибута, Штрихкод */}
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth error={Boolean(errors.attributeId)}>
            <InputLabel>Атрибут</InputLabel>
            <Select
              label="Атрибут"
              value={details.attributeId}
              onChange={(e) => {
                const selectedId = e.target.value as number
                onUpdate('attributeId', selectedId)
                // Clear the attribute value when attribute changes
                onUpdate('attributeValue', '')
              }}
              disabled={attributesLoading}
              startAdornment={
                attributesLoading ? (
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                ) : null
              }
            >
              {attributesData?.data.map((attribute) => (
                <MenuItem key={attribute.id} value={attribute.id}>
                  {attribute.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            value={details.attributeValue}
            onChange={(e) => onUpdate('attributeValue', e.target.value)}
            label="Название атрибута"
            fullWidth
            error={Boolean(errors.attributeValue)}
            helperText={errors.attributeValue}
            placeholder="например: Красный"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            value={details.barcode}
            onChange={(e) => onUpdate('barcode', e.target.value)}
            label="Штрихкод"
            fullWidth
            error={Boolean(errors.barcode)}
            helperText={errors.barcode}
          />
        </Grid>

        {/* Bottom Row: Себестоимость, Продажа, Количество */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            value={details.costPrice}
            onChange={(e) => {
              const value = e.target.value.replace(',', '.')
              onUpdate('costPrice', value)
            }}
            label="Себестоимость"
            fullWidth
            error={Boolean(errors.costPrice)}
            helperText={errors.costPrice}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            value={details.salePrice}
            onChange={(e) => {
              const value = e.target.value.replace(',', '.')
              onUpdate('salePrice', value)
            }}
            label="Продажа"
            fullWidth
            error={Boolean(errors.salePrice)}
            helperText={errors.salePrice}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            value={details.quantity}
            onChange={(e) => {
              const value = e.target.value.replace(',', '.')
              onUpdate('quantity', value)
            }}
            label="Количество"
            fullWidth
            error={Boolean(errors.quantity)}
            helperText={errors.quantity}
          />
        </Grid>
      </Grid>
    </Board>
  )
}

