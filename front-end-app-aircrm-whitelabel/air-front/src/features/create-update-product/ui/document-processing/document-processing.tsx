import { useState } from 'react'
import { Typography, Grid, TextField, Divider, Stack } from '@mui/material'
import { Control, UseFormWatch, UseFormSetValue } from 'react-hook-form'

import { Board } from '@shared/ui'
import { CreateProductDto } from '../../model/dto'
import { VariationDetail, VariationType } from '../../model/variation-types'

import { SupplierSearch } from './supplier-search'
import { ProductsToReceive } from './products-to-receive'

interface Supplier {
  id: number
  counterparty: string
  name: string
  address: string
  requisite: string
  phone: string
  type: string
  type_label: string
  balance: string
  status: string
  status_label: string
  photo: string | null
}

interface Props {
  onClose?: () => void
  control?: Control<CreateProductDto>
  watch?: UseFormWatch<CreateProductDto>
  setValue?: UseFormSetValue<CreateProductDto>
  variationTypes?: VariationType[]
  variationDetails?: Record<string, VariationDetail>
  setVariationDetails?: React.Dispatch<React.SetStateAction<Record<string, VariationDetail>>>
  variationErrors?: Record<string, string>
  initialVariationDetails?: Record<string, VariationDetail>
  isSingleProduct?: boolean
}

export const DocumentProcessing = ({
  onClose: _onClose,
  control,
  watch,
  setValue,
  variationTypes = [],
  variationDetails = {},
  setVariationDetails,
  variationErrors = {},
  initialVariationDetails = {},
  isSingleProduct = false
}: Props) => {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)

  // Get product name from the General form
  const productName = watch?.('name') || ''

  // Update form when supplier is selected
  const handleSupplierChange = (supplier: Supplier | null) => {
    setSelectedSupplier(supplier)
    if (setValue) {
      setValue('counterparty_id', supplier?.id || null)
    }
  }

  return (
    <Board>
      <Typography variant="h6" mb="24px">
        Документ оприходования
      </Typography>
      
      <Grid container spacing="24px">
        {/* First Row - Supplier Search */}
        <Grid item xs={12}>
          <SupplierSearch
            value={selectedSupplier as any}
            onChange={handleSupplierChange as any}
          />
        </Grid>
        
        {/* Auto-filled fields when supplier is selected - All in one row */}
        {selectedSupplier && (
          <>
            <Grid item xs={12} sm={2.4}>
              <TextField
                label="Контактное лицо"
                value={selectedSupplier.name || ''}
                disabled
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={2.4}>
              <TextField
                label="Номер телефона"
                value={selectedSupplier.phone || ''}
                disabled
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={2.4}>
              <TextField
                label="Адрес"
                value={selectedSupplier.address || ''}
                disabled
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={2.4}>
              <TextField
                label="ИНН"
                value={selectedSupplier.requisite || ''}
                disabled
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={2.4}>
              <TextField
                label="Заметки"
                value=""
                disabled
                fullWidth
                size="small"
                placeholder="Пусто"
              />
            </Grid>
          </>
        )}

        {/* Products to Receive Section */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <ProductsToReceive
            productName={productName}
            variationTypes={variationTypes}
            variationDetails={variationDetails}
            setVariationDetails={setVariationDetails!}
            variationErrors={variationErrors}
            initialVariationDetails={initialVariationDetails}
            isSingleProduct={isSingleProduct}
          />
        </Grid>
      </Grid>
    </Board>
  )
}
