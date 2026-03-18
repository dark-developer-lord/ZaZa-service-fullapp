import { Dispatch, SetStateAction } from 'react'
import { Control, UseFormSetValue } from 'react-hook-form'
import { Typography } from '@mui/material'

import { Board } from '@shared/ui'

import { generateOptionsPrice } from '../../../edit-product'
import { CreateDto, UpdateDto } from '../../model/dto'
import { AttributeOptions } from './attribute-options'
import { AttributeSelect } from './attribute-select'
import { AttributesPrices } from './attributes-prices'

interface Props {
  control: Control<CreateDto> | Control<UpdateDto>
  selectedAttributes: number[]
  attributesOptions: Record<string, string[]>
  setAttributesOptions: Dispatch<SetStateAction<Record<string, string[]>>>
  optionsPrice: Record<string, number | ''>
  setOptionsPrice: Dispatch<SetStateAction<Record<string, number | ''>>>
  setValue: UseFormSetValue<CreateDto> | UseFormSetValue<UpdateDto>
  attributesErrors: Record<string, string>
  priceErrors: Record<string, string>
}

export const Attributes = ({
  control,
  selectedAttributes,
  attributesOptions,
  optionsPrice,
  setAttributesOptions,
  setOptionsPrice,
  setValue,
  attributesErrors,
  priceErrors,
}: Props) => {
  const selectAttributes = (names: string[]) => {
    const newAttributesOptions: Record<string, string[]> = {}
    names.forEach((name) => {
      newAttributesOptions[name] = []
    })
    setAttributesOptions(newAttributesOptions)
  }

  const addOptions = (name: string, values: string[]) => {
    const newAttributesOptions = { ...attributesOptions }
    newAttributesOptions[name] = values
    setAttributesOptions(newAttributesOptions)
    setOptionsPrice(generateOptionsPrice(newAttributesOptions))
  }

  return (
    <Board>
      <Typography
        variant="h6"
        mb="24px"
      >
        Атрибуты
      </Typography>
      <AttributeSelect
        control={control}
        selectAttributes={selectAttributes}
        setValue={setValue}
      />
      <AttributeOptions
        selectedAttributes={selectedAttributes}
        attributesOptions={attributesOptions}
        addOptions={addOptions}
        errors={attributesErrors}
      />
      <AttributesPrices
        attributesOptions={attributesOptions}
        optionsPrice={optionsPrice}
        setOptionsPrice={setOptionsPrice}
        errors={priceErrors}
      />
    </Board>
  )
}
