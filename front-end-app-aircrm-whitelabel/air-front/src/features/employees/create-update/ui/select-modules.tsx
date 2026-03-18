import { Control, Controller } from 'react-hook-form'
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Checkbox,
  Box,
  CircularProgress,
  Grid,
} from '@mui/material'

import { useGetAvailableModules } from '../../api/get-available-modules'

interface Props {
  control: Control<any>
}

export const SelectModules = ({ control }: Props) => {
  const { data: modules, isLoading } = useGetAvailableModules()

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={2}>
        <CircularProgress size={24} />
      </Box>
    )
  }

  return (
    <Controller
      name="modules"
      control={control}
      render={({ field, fieldState }) => {
        const currentValue = field.value || []
        const allModuleKeys = modules?.map(m => m.key) || []
        const isAllSelected = allModuleKeys.length > 0 && allModuleKeys.every(key => currentValue.includes(key))
        const isIndeterminate = currentValue.length > 0 && currentValue.length < allModuleKeys.length

        const handleSelectAll = (checked: boolean) => {
          if (checked) {
            field.onChange(allModuleKeys)
          } else {
            field.onChange([])
          }
        }

        return (
          <FormControl error={Boolean(fieldState.error)} component="fieldset" fullWidth>
            <FormLabel component="legend">Модули доступа</FormLabel>

            {/* Select All checkbox - full width */}
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                }
                label="Все"
                sx={{
                  fontWeight: 'bold',
                  borderBottom: '1px solid #e0e0e0',
                  paddingBottom: 1,
                  width: '100%'
                }}
              />
            </Box>

            {/* Individual module checkboxes in responsive grid */}
            <Grid container spacing={1}>
              {modules?.map((module) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={module.key}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={currentValue.includes(module.key)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            field.onChange([...currentValue, module.key])
                          } else {
                            field.onChange(
                              currentValue.filter((item: string) => item !== module.key)
                            )
                          }
                        }}
                      />
                    }
                    label={module.name}
                    sx={{
                      width: '100%',
                      margin: 0,
                      '& .MuiFormControlLabel-label': {
                        fontSize: '0.875rem'
                      }
                    }}
                  />
                </Grid>
              ))}
            </Grid>

            <FormHelperText sx={{ mt: 1 }}>{fieldState.error?.message}</FormHelperText>
          </FormControl>
        )
      }}
    />
  )
}
