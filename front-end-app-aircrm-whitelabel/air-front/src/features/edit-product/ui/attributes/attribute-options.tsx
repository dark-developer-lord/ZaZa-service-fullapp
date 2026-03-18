import { Stack } from '@mui/material'

import { useGetAttributes } from '@entities/attribute'

import { AttributeOption } from './attribute-option'

interface Props {
  selectedAttributes: number[]
  attributesOptions: Record<string, string[]>
  addOptions: (name: string, values: string[]) => void
  errors: Record<string, string>
}

export const AttributeOptions = ({
  selectedAttributes,
  attributesOptions,
  addOptions,
  errors,
}: Props) => {
  const { data: attributes } = useGetAttributes({
    refetchOnMount: false,
  })

  const selected =
    attributes?.data.filter(({ id }) => selectedAttributes.includes(id)) || []

  return (
    <Stack
      spacing="24px"
      mb="24px"
    >
      {selected.map(({ id, name }) => (
        <AttributeOption
          key={id}
          id={id}
          name={name}
          options={attributesOptions[`choice_${id}`]}
          addOptions={addOptions}
          error={errors[`choice_${id}`]}
        />
      ))}
    </Stack>
  )
}
