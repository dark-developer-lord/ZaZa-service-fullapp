import {
  DateRangePicker as DatePicker,
  DateRangePickerProps,
} from '@mui/x-date-pickers-pro'
import { Dayjs } from 'dayjs'

export const DateRangePicker = ({
  slotProps,
  ...props
}: DateRangePickerProps<Dayjs>) => {
  return (
    <DatePicker
      {...props}
      label="От"
      slotProps={{
        ...slotProps,
        desktopPaper: {
          ...slotProps?.desktopPaper,
          sx: {
            '& .MuiDateRangeCalendar-root > div:first-child': {
              display: 'none',
            },
          },
        },
      }}
    />
  )
}
