import { useState, Dispatch, SetStateAction } from 'react'
import {
  Typography,
  Grid,
  TextField,
  Stack,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material'

import { VariationDetail, VariationType } from '../../model/variation-types'
import { VariationDetailRow } from '../variations/variation-detail-row'

interface Props {
  productName: string
  variationTypes: VariationType[]
  variationDetails: Record<string, VariationDetail>
  setVariationDetails: Dispatch<SetStateAction<Record<string, VariationDetail>>>
  variationErrors: Record<string, string>
  initialVariationDetails?: Record<string, VariationDetail> // From selected existing product
  isSingleProduct?: boolean
}

export const ProductsToReceive = ({
  productName,
  variationTypes,
  variationDetails,
  setVariationDetails,
  variationErrors,
  initialVariationDetails = {},
  isSingleProduct = false
}: Props) => {
  const { palette } = useTheme()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))
  
  // Calculate total initial quantity from existing product variations
  const calculateInitialQuantity = () => {
    return Object.values(initialVariationDetails).reduce((sum, detail) => {
      return sum + (typeof detail.quantity === 'number' ? detail.quantity : parseFloat(detail.quantity.toString()) || 0)
    }, 0)
  }

  // Calculate total final quantity (initial + new variations)
  const calculateFinalQuantity = () => {
    const initialTotal = calculateInitialQuantity()
    const newVariationsTotal = Object.values(variationDetails).reduce((sum, detail) => {
      // Only count variations that are not in the initial set (newly added)
      const variationId = Object.keys(variationDetails).find(key => variationDetails[key] === detail)
      if (variationId && !initialVariationDetails[variationId]) {
        return sum + (typeof detail.quantity === 'number' ? detail.quantity : parseFloat(detail.quantity.toString()) || 0)
      }
      return sum
    }, 0)
    return initialTotal + newVariationsTotal
  }

  const initialQuantity = calculateInitialQuantity().toString()
  const finalQuantity = calculateFinalQuantity().toString()

  // Function to update variation details (same as in Добавление товара)
  const updateVariationDetail = (
    typeId: string,
    field: keyof VariationDetail,
    value: string | number
  ) => {
    setVariationDetails(prev => ({
      ...prev,
      [typeId]: {
        ...prev[typeId],
        [field]: value,
      },
    }))
  }

  return (
    <Stack spacing="24px">
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Товары к оприходованию
      </Typography>
      
      {/* Product Info Row */}
      <Grid container spacing="16px" alignItems="center">
        {/* Product Name (mirrors from General form) */}
        <Grid item xs={12} sm={4}>
          <TextField
            label="Название товара"
            value={productName}
            disabled
            fullWidth
            size="small"
            placeholder="Заполнится автоматически из формы"
            sx={{
              '& .MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: palette.text.primary,
                opacity: 0.8,
              },
            }}
          />
        </Grid>
        
        {/* Initial Quantity */}
        <Grid item xs={12} sm={4}>
          <TextField
            label="Начальное количество"
            value={initialQuantity}
            disabled
            fullWidth
            size="small"
            placeholder="0"
            type="number"
            InputProps={{
              readOnly: true,
            }}
            sx={{
              '& .MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: palette.text.primary,
                opacity: 0.8,
              },
            }}
          />
        </Grid>

        {/* Final Quantity */}
        <Grid item xs={12} sm={4}>
          <TextField
            label="Конечное количество"
            value={finalQuantity}
            disabled
            fullWidth
            size="small"
            placeholder="0"
            type="number"
            InputProps={{
              readOnly: true,
            }}
            sx={{
              '& .MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: palette.text.primary,
                opacity: 0.8,
              },
            }}
          />
        </Grid>
      </Grid>
      
      {/* Variation Details Section - For Multiple Variations */}
      {!isSingleProduct && variationTypes.length > 0 && (
        <Box
          sx={{
            bgcolor: 'grey.50',
            borderRadius: 1,
            p: 3,
            border: `1px solid ${palette.grey[200]}`,
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 600 }}>
            Подтверждение атрибутов
          </Typography>

          <Stack spacing="24px">
            {variationTypes.map((type) => (
              <VariationDetailRow
                key={type.id}
                type={type.name}
                typeId={type.id}
                details={variationDetails[type.id]}
                onUpdate={updateVariationDetail}
                errors={{
                  attributeId: variationErrors[`${type.id}_attributeId`],
                  attributeValue: variationErrors[`${type.id}_attributeValue`],
                  costPrice: variationErrors[`${type.id}_costPrice`],
                  salePrice: variationErrors[`${type.id}_salePrice`],
                  quantity: variationErrors[`${type.id}_quantity`],
                  barcode: variationErrors[`${type.id}_barcode`],
                }}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Single Product Detail Section */}
      {isSingleProduct && variationDetails['single'] && (
        <Box
          sx={{
            bgcolor: 'grey.50',
            borderRadius: 1,
            p: 3,
            border: `1px solid ${palette.grey[200]}`,
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 600 }}>
            Подтверждение атрибутов
          </Typography>

          <VariationDetailRow
            type="Товар"
            typeId="single"
            details={variationDetails['single']}
            onUpdate={updateVariationDetail}
            errors={{
              attributeId: variationErrors['attributeId'],
              attributeValue: variationErrors['attributeValue'],
              costPrice: variationErrors['costPrice'],
              salePrice: variationErrors['salePrice'],
              quantity: variationErrors['quantity'],
              barcode: variationErrors['barcode'],
            }}
          />
        </Box>
      )}

      {/* Show message when no variations are configured */}
      {!isSingleProduct && variationTypes.length === 0 && (
        <Box
          sx={{
            p: 3,
            bgcolor: 'grey.50',
            borderRadius: 1,
            textAlign: 'center',
            border: `1px dashed ${palette.grey[300]}`,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Атрибуты будут отображены после настройки вариаций в разделе "Добавление товара"
          </Typography>
        </Box>
      )}
    </Stack>
  )
}
