import { Control, Controller, UseFormSetValue } from 'react-hook-form'
import {
  Box,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
} from '@mui/material'

import { useGetAttributes } from '@entities/attribute'

import { Dto } from '../../model/dto'

interface Props {
  control: Control<Dto>
  selectAttributes: (names: string[]) => void
  setValue: UseFormSetValue<Dto>
}

export const AttributeSelect = ({
  control,
  selectAttributes,
  setValue,
}: Props) => {
  const { data: attributes, isFetching } = useGetAttributes({
    refetchOnMount: false,
  })
  const selectChoiceOptions = (values: number[]) => {
    const selected =
      attributes?.data.filter((attribute) =>
        values!.find((id) => attribute.id === id),
      ) || []
    selectAttributes(selected.map(({ id }) => `choice_${id}`))
  }

  if (isFetching) {
    return (
      <Skeleton
        variant="rectangular"
        height={56}
        sx={{ borderRadius: '56px' }}
      />
    )
  }

  return (
    <Controller
      name="attribute_id"
      control={control}
      render={({ field, fieldState }) => (
        <FormControl
          fullWidth
          sx={{ mb: '24px' }}
        >
          <InputLabel>Атрибут</InputLabel>
          <Select
            label="Атрибут"
            fullWidth
            error={Boolean(fieldState.error)}
            disabled={isFetching}
            multiple
            {...field}
            onChange={(event) => {
              field.onChange(event)
              selectChoiceOptions(event.target.value as number[])
            }}
            renderValue={(selected) => {
              const selectedAttributes =
                attributes?.data.filter((attribute) =>
                  selected?.includes(attribute.id),
                ) || []
              return (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selectedAttributes.map(({ id, name }) => (
                    <Chip
                      key={id}
                      label={name}
                      onMouseDown={(event) => {
                        event.stopPropagation()
                      }}
                      onDelete={() => {
                        const newSelected = selectedAttributes.filter(
                          (attribute) => attribute.id !== id,
                        )
                        selectAttributes(
                          newSelected.map(({ id }) => `choice_${id}`),
                        )
                        setValue(
                          'attribute_id',
                          newSelected.map(({ id }) => id),
                        )
                      }}
                    />
                  ))}
                </Box>
              )
            }}
          >
            {attributes?.data.map(({ id, name }) => (
              <MenuItem
                key={id}
                value={id}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText error>{fieldState.error?.message}</FormHelperText>
        </FormControl>
      )}
    />
  )
}
