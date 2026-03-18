import { Dispatch, SetStateAction } from 'react'
import { Typography, Stack, Button, Divider } from '@mui/material'

import { Board } from '@shared/ui'
import { VariationDetail, VariationType } from '../../model/variation-types'

import { VariationNameInput } from './variation-name-input'
import { VariationTypes } from './variation-types'
import { VariationDetails } from './variation-details'

interface Props {
  variationName: string
  setVariationName: Dispatch<SetStateAction<string>>
  variationTypes: VariationType[]
  setVariationTypes: Dispatch<SetStateAction<VariationType[]>>
  variationDetails: Record<string, VariationDetail>
  setVariationDetails: Dispatch<SetStateAction<Record<string, VariationDetail>>>
  variationErrors: Record<string, string>
  onProcessProduct: () => void
  // New props for existing variations
  initialVariationDetails?: Record<string, VariationDetail>
  hasExistingVariations?: boolean
  isEditMode?: boolean // New prop to distinguish edit vs create mode
}

export const Variations = ({
  variationName,
  setVariationName,
  variationTypes,
  setVariationTypes,
  variationDetails,
  setVariationDetails,
  variationErrors,
  onProcessProduct,
  initialVariationDetails = {},
  hasExistingVariations = false,
  isEditMode = false,
}: Props) => {
  const handleVariationTypesChange = (typeNames: string[]) => {
    // Create unique types with IDs
    const newTypes: VariationType[] = typeNames.map((name, index) => ({
      id: `${name}_${Date.now()}_${index}`, // Unique ID for each type
      name: name
    }))

    setVariationTypes(newTypes)

    // Initialize details for new types and remove details for deleted types
    const newDetails: Record<string, VariationDetail> = {}
    newTypes.forEach((type) => {
      newDetails[type.id] = variationDetails[type.id] || {
        attributeId: '',
        attributeValue: '',
        costPrice: '',
        salePrice: '',
        quantity: '',
        barcode: '',
      }
    })
    setVariationDetails(newDetails)
  }

  return (
    <Board>
      <Typography
        variant="h6"
        mb="24px"
      >
        Добавление товара
      </Typography>

      <VariationNameInput
        value={variationName}
        onChange={setVariationName}
        error={variationErrors.variationName}
        disabled={hasExistingVariations} // Disable if we have existing variations
      />

      <VariationTypes
        value={variationTypes}
        onChange={handleVariationTypesChange}
        variationName={variationName}
        error={variationErrors.variationTypes}
      />

      <VariationDetails
        variationTypes={variationTypes}
        variationDetails={variationDetails}
        setVariationDetails={setVariationDetails}
        errors={variationErrors}
        initialVariationDetails={initialVariationDetails}
        hasExistingVariations={hasExistingVariations}
        isEditMode={isEditMode}
      />

      {/* Action Buttons */}
      {variationName && variationTypes.length > 0 && (
        <Stack direction="row" spacing="16px" justifyContent="flex-end" mt="24px">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setVariationName('')
              setVariationTypes([])
              setVariationDetails({})
            }}
          >
            Отмена
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
            onClick={onProcessProduct}
          >
            Оприходовать товар
          </Button>
        </Stack>
      )}
    </Board>
  )
}
