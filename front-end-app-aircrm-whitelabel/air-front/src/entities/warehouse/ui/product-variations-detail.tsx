import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { ProductVariation } from '../model/warehouse'

interface Props {
  variations: ProductVariation[]
}

export const ProductVariationsDetail = ({ variations }: Props) => {
  if (!variations || variations.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          У этого продукта нет вариаций
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 2, bgcolor: 'background.default' }}>
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
        Вариации продукта
      </Typography>
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'secondary.main' }}>
              <TableCell sx={{ fontWeight: 600 }}>Тип вариации</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Значение атрибута</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Себестоимость</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Цена продажи</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Количество</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Штрихкод</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {variations.map((variation, index) => (
              <TableRow
                key={variation.variation_id || index}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <TableCell>{variation.variation_type}</TableCell>
                <TableCell>{variation.attribute_value}</TableCell>
                <TableCell>{variation.cost_price} с.</TableCell>
                <TableCell>{variation.sale_price} с.</TableCell>
                <TableCell>{variation.quantity}</TableCell>
                <TableCell>{variation.barcode || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

