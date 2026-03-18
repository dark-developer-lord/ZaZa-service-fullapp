import { useState, useEffect, useRef } from 'react'
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'
import { TextField, InputAdornment, IconButton, Box } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import CalendarIcon from '@icons/calendar.svg?react'

interface Props<T extends FieldValues> {
  name: FieldPath<T>
  control: Control<T>
  label: string
  disabled?: boolean
  placeholder?: string
  minDate?: Dayjs
  maxDate?: Dayjs
  readOnly?: boolean
}

// Format input as DD.MM.YYYY with auto-insertion of dots
const formatDateInput = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '')
  
  // Apply formatting based on length
  if (digits.length <= 2) {
    return digits
  } else if (digits.length <= 4) {
    return `${digits.slice(0, 2)}.${digits.slice(2)}`
  } else if (digits.length <= 8) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4, 8)}`
  } else {
    return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4, 8)}`
  }
}

// Convert DD.MM.YYYY string to Dayjs object
const stringToDate = (dateString: string): Dayjs | null => {
  if (!dateString || dateString.length !== 10) return null
  
  const [day, month, year] = dateString.split('.')
  if (!day || !month || !year) return null
  
  const date = dayjs(`${year}-${month}-${day}`)
  return date.isValid() ? date : null
}

// Convert Dayjs object to DD.MM.YYYY string
const dateToString = (date: Dayjs | null): string => {
  if (!date || !date.isValid()) return ''
  return date.format('DD.MM.YYYY')
}

export const FormDateInput = <T extends FieldValues>({
  name,
  control,
  label,
  disabled = false,
  placeholder = 'ДД.ММ.ГГГГ',
  minDate,
  maxDate,
  readOnly = false,
}: Props<T>) => {
  const [showPicker, setShowPicker] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => {
        const [inputValue, setInputValue] = useState(value || '')
        const [dateValue, setDateValue] = useState<Dayjs | null>(stringToDate(value))

        useEffect(() => {
          setInputValue(value || '')
          setDateValue(stringToDate(value))
        }, [value])

        const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const formatted = formatDateInput(event.target.value)
          setInputValue(formatted)
          
          // Update form value if it's a complete date
          if (formatted.length === 10) {
            const date = stringToDate(formatted)
            if (date && date.isValid()) {
              setDateValue(date)
              onChange(formatted)
            } else {
              onChange(formatted) // Still update to show validation error
            }
          } else if (formatted === '') {
            setDateValue(null)
            onChange('')
          } else {
            onChange(formatted) // Update for partial input
          }
        }

        const handleDatePickerChange = (newDate: Dayjs | null) => {
          const dateString = dateToString(newDate)
          setDateValue(newDate)
          setInputValue(dateString)
          onChange(dateString)
          setShowPicker(false)
        }

        const handleInputBlur = () => {
          onBlur()
          // If input is not empty but not a valid complete date, clear it
          if (inputValue && inputValue.length < 10) {
            setInputValue('')
            setDateValue(null)
            onChange('')
          }
        }

        return (
          <Box ref={anchorRef} sx={{ position: 'relative' }}>
            <TextField
              label={label}
              value={inputValue}
              onChange={readOnly ? undefined : handleInputChange}
              onBlur={readOnly ? undefined : handleInputBlur}
              onClick={readOnly ? () => setShowPicker(true) : undefined}
              placeholder={placeholder}
              disabled={disabled}
              error={!!error}
              helperText={error?.message}
              size="small"
              fullWidth
              InputProps={{
                readOnly: readOnly,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPicker(true)}
                      disabled={disabled}
                      edge="end"
                    >
                      <CalendarIcon width={16} height={16} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={readOnly ? { cursor: 'pointer' } : undefined}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
              <DatePicker
                open={showPicker}
                onClose={() => setShowPicker(false)}
                value={dateValue}
                onChange={handleDatePickerChange}
                minDate={minDate}
                maxDate={maxDate}
                slotProps={{
                  textField: {
                    sx: { display: 'none' },
                  },
                  popper: {
                    anchorEl: anchorRef.current,
                    placement: 'bottom-start',
                    modifiers: [
                      {
                        name: 'offset',
                        options: {
                          offset: [0, 8],
                        },
                      },
                    ],
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        )
      }}
    />
  )
}
