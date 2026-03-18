import { FormHelperText, Typography } from '@mui/material'
import { MultiInputTimeRangeField } from '@mui/x-date-pickers-pro'

import { Board } from '@shared/ui'

interface Props {
  availableTimeStarts: string | null
  availableTimeEnds: string | null
  setAvailableTimeStarts: (value: string) => void
  setAvailableTimeEnds: (value: string) => void
  errors?: boolean
}

export const AvailableTime = ({
  setAvailableTimeStarts,
  setAvailableTimeEnds,
  errors,
}: Props) => {
  return (
    <Board>
      <Typography
        variant="h6"
        mb="24px"
      >
        Время
      </Typography>
      <MultiInputTimeRangeField
        format="HH:mm"
        slotProps={{
          textField: ({ position }) => ({
            label: position === 'start' ? 'Начинается' : 'Заканчивается',
          }),
        }}
        onChange={(value) => {
          const [start, end] = value
          if (start) {
            setAvailableTimeStarts(start.format('HH:mm:ss'))
          }
          if (end) {
            setAvailableTimeEnds(end.format('HH:mm:ss'))
          }
        }}
      />
      <FormHelperText error>
        {errors && 'Введите время начала и окончания доступности продукта'}
      </FormHelperText>
    </Board>
  )
}
