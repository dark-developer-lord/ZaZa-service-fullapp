import { Dispatch, SetStateAction } from 'react'
import { Stack } from '@mui/material'

import { Board } from '@shared/ui'
import { VariationDetail, VariationType } from '../../model/variation-types'

import { VariationDetailRow } from './variation-detail-row'

interface Props {
  variationTypes: VariationType[]
  variationDetails: Record<string, VariationDetail>
  setVariationDetails: Dispatch<SetStateAction<Record<string, VariationDetail>>>
  errors: Record<string, string>
  initialVariationDetails?: Record<string, VariationDetail>
  hasExistingVariations?: boolean
  isEditMode?: boolean // New prop to distinguish edit vs create mode
}

export const VariationDetails = ({
  variationTypes,
  variationDetails,
  setVariationDetails,
  errors,
  initialVariationDetails = {},
  hasExistingVariations = false,
  isEditMode = false
}: Props) => {
  // In EDIT mode: all variations (existing + new) are editable
  // In CREATE mode: existing variations are read-only, new variations are editable

  const existingVariationTypes = hasExistingVariations && !isEditMode
    ? Object.keys(initialVariationDetails).map(key => {
        const detail = initialVariationDetails[key]
        return {
          id: key,
          name: detail.attributeValue,
          isExisting: true
        }
      })
    : []

  // In edit mode, variationTypes contains ALL variations (existing + new)
  // In create mode, variationTypes contains only NEW variations
  const newVariationTypes = variationTypes.map(type => ({
    ...type,
    isExisting: false
  }))

  if (existingVariationTypes.length === 0 && newVariationTypes.length === 0) {
    return null
  }

  const updateVariationDetail = (
    typeId: string,
    field: keyof VariationDetail,
    value: string | number,
    isExisting: boolean = false
  ) => {
    // In EDIT mode: allow updates for all variations
    // In CREATE mode: only allow updates for new variations, not existing ones
    if (isEditMode || !isExisting) {
      setVariationDetails(prev => ({
        ...prev,
        [typeId]: {
          ...prev[typeId],
          [field]: value,
        },
      }))
    }
  }

  return (
    <Board sx={{ bgcolor: 'grey.50' }}>
      <Stack spacing="24px">
        {/* In CREATE mode: Show existing variations as read-only */}
        {!isEditMode && existingVariationTypes.map((type) => (
          <VariationDetailRow
            key={`existing-${type.id}`}
            type={type.name}
            typeId={type.id}
            details={initialVariationDetails[type.id]}
            onUpdate={updateVariationDetail}
            errors={{
              attributeId: errors[`${type.id}_attributeId`],
              attributeValue: errors[`${type.id}_attributeValue`],
              costPrice: errors[`${type.id}_costPrice`],
              salePrice: errors[`${type.id}_salePrice`],
              quantity: errors[`${type.id}_quantity`],
              barcode: errors[`${type.id}_barcode`],
            }}
            readOnly={true}
            isExisting={true}
          />
        ))}

        {/* Show all variations as editable (in EDIT mode) or only new variations (in CREATE mode) */}
        {newVariationTypes.map((type) => (
          <VariationDetailRow
            key={`new-${type.id}`}
            type={type.name}
            typeId={type.id}
            details={variationDetails[type.id] || {
              attributeId: 0,
              attributeValue: '',
              costPrice: 0,
              salePrice: 0,
              quantity: 0,
              barcode: '',
            }}
            onUpdate={updateVariationDetail}
            errors={{
              attributeId: errors[`${type.id}_attributeId`],
              attributeValue: errors[`${type.id}_attributeValue`],
              costPrice: errors[`${type.id}_costPrice`],
              salePrice: errors[`${type.id}_salePrice`],
              quantity: errors[`${type.id}_quantity`],
              barcode: errors[`${type.id}_barcode`],
            }}
            readOnly={false}
            isExisting={false}
          />
        ))}
      </Stack>
    </Board>
  )
}
