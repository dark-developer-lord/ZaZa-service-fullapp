import { FieldErrors, UseFormSetValue } from 'react-hook-form'
import { FormControl, FormHelperText } from '@mui/material'
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro'
import dayjs, { Dayjs } from 'dayjs'

import { formatDateForAPI } from '@shared/lib'
import { CreateDto } from '../model/dto'

interface Props {
  startDateTime: Dayjs | null
  endDateTime: Dayjs | null
  setValue: UseFormSetValue<CreateDto>
  errors: FieldErrors<CreateDto>
}

export const DateRangePicker = ({
  startDateTime,
  endDateTime,
  setValue,
  errors,
}: Props) => {
  return (
    <FormControl>
      <DateTimeRangePicker
        localeText={{
          start: 'От',
          end: 'До',
        }}
        slotProps={{
          textField: {
            error: Boolean(errors.start_date || errors.end_date),
          },
          desktopPaper: {
            sx: {
              '& .MuiDateRangeCalendar-root > div:first-child': {
                display: 'none',
              },
            },
          },
        }}
        format="DD.MM.YYYY HH:mm"
        value={[startDateTime, endDateTime]}
        onChange={(value) => {
          if (value[0]) {
            setValue('start_date', formatDateForAPI(dayjs(value[0])))
            setValue('start_time', dayjs(value[0]).format('HH:mm'))
          }
          if (value[1]) {
            setValue('end_date', formatDateForAPI(dayjs(value[1])))
            setValue('end_time', dayjs(value[1]).format('HH:mm'))
          }
        }}
      />
      <FormHelperText error={Boolean(errors.start_date)}>
        {errors.start_date?.message}
      </FormHelperText>
      <FormHelperText error={Boolean(errors.end_date)}>
        {errors.end_date?.message}
      </FormHelperText>
    </FormControl>
  )
}
