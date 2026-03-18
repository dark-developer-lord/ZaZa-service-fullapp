import {
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material'

import { useGetAttributes } from '@entities/attribute'
import { VariationDetail, VariationErrors } from '../../model/variation-types'

interface Props {
  type: string
  typeId: string
  details: VariationDetail
  onUpdate: (typeId: string, field: keyof VariationDetail, value: string | number, isExisting?: boolean) => void
  errors: VariationErrors
  readOnly?: boolean
  isExisting?: boolean
}

export const VariationDetailRow = ({ type, typeId, details, onUpdate, errors, readOnly = false, isExisting = false }: Props) => {
  const { palette } = useTheme()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))

  // Fetch attributes for dropdown
  const { data: attributesData, isLoading: attributesLoading } = useGetAttributes({
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  return (
    <Grid
      container
      spacing="16px"
      alignItems="center"
      sx={{
        bgcolor: isExisting ? 'grey.100' : 'background.paper',
        p: 1,
        borderRadius: 1,
        border: isExisting ? '1px solid' : 'none',
        borderColor: isExisting ? 'grey.300' : 'transparent'
      }}
    >
      {/* Type Label */}
      <Grid item xs={12} sm={2}>
        <Typography
          sx={{
            bgcolor: 'white',
            height: 56,
            display: 'flex',
            alignItems: 'center',
            padding: '16px',
            borderRadius: '56px',
            fontWeight: 500,
            border: `1px solid ${palette.grey[200]}`,
            textAlign: 'center',
            justifyContent: 'center',
          }}
          variant="small"
        >
          {type} {isExisting && <span style={{ fontSize: '0.75rem', color: '#666' }}>(существующий)</span>}
        </Typography>
      </Grid>

      {/* Attribute Selector */}
      <Grid item xs={12} sm={2}>
        <FormControl fullWidth size="small" error={Boolean(errors.attributeId)}>
          <InputLabel>Атрибут</InputLabel>
          <Select
            label="Атрибут"
            value={details.attributeId}
            onChange={(e) => {
              if (!readOnly) {
                const selectedId = e.target.value as number
                onUpdate(typeId, 'attributeId', selectedId, isExisting)

                // Clear the attribute value when attribute changes
                onUpdate(typeId, 'attributeValue', '', isExisting)
              }
            }}
            disabled={readOnly || attributesLoading}
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

      {/* Attribute Value */}
      <Grid item xs={12} sm={2}>
        <TextField
          value={details.attributeValue}
          onChange={(e) => !readOnly && onUpdate(typeId, 'attributeValue', e.target.value, isExisting)}
          label="Введите значение атрибута"
          size="small"
          fullWidth
          error={Boolean(errors.attributeValue)}
          helperText={errors.attributeValue}
          placeholder="например: Красный"
          disabled={readOnly}
        />
      </Grid>

      {/* Cost Price */}
      <Grid item xs={6} sm={1.5}>
        <TextField
          value={details.costPrice}
          onChange={(e) => {
            if (!readOnly) {
              const value = e.target.value.replace(',', '.')
              onUpdate(typeId, 'costPrice', value, isExisting)
            }
          }}
          label="Себест."
          size="small"
          fullWidth
          error={Boolean(errors.costPrice)}
          helperText={errors.costPrice}
          disabled={readOnly}
        />
      </Grid>

      {/* Sale Price */}
      <Grid item xs={6} sm={1.5}>
        <TextField
          value={details.salePrice}
          onChange={(e) => {
            if (!readOnly) {
              const value = e.target.value.replace(',', '.')
              onUpdate(typeId, 'salePrice', value, isExisting)
            }
          }}
          label="Продажа"
          size="small"
          fullWidth
          error={Boolean(errors.salePrice)}
          helperText={errors.salePrice}
          disabled={readOnly}
        />
      </Grid>

      {/* Quantity */}
      <Grid item xs={6} sm={1.5}>
        <TextField
          value={details.quantity}
          onChange={(e) => {
            if (!readOnly) {
              const value = e.target.value.replace(',', '.')
              onUpdate(typeId, 'quantity', value, isExisting)
            }
          }}
          label="Кол-во"
          size="small"
          fullWidth
          error={Boolean(errors.quantity)}
          helperText={errors.quantity}
          disabled={readOnly}
        />
      </Grid>

      {/* Barcode */}
      <Grid item xs={6} sm={1.5}>
        <TextField
          value={details.barcode}
          onChange={(e) => !readOnly && onUpdate(typeId, 'barcode', e.target.value, isExisting)}
          label="Штрихкод"
          size="small"
          fullWidth
          error={Boolean(errors.barcode)}
          helperText={errors.barcode}
          disabled={readOnly}
        />
      </Grid>
    </Grid>
  )
}
