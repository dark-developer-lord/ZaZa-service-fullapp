import { Control, Controller } from 'react-hook-form'
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'

import {
  CampaignRuleType,
  RuleType,
  ruleTypeLabels,
} from '@entities/campaign-rule'

import { CreateDto } from '../model/dto'

interface Props {
  control: Control<CreateDto>
}

export const SelectRuleType = ({ control }: Props) => {
  return (
    <Controller
      name="rule_type"
      control={control}
      render={({ field, fieldState }) => (
        <FormControl fullWidth>
          <InputLabel>Тип акции</InputLabel>
          <Select
            {...field}
            value={field.value || ''}
            label="Тип акции"
            onChange={(e) => field.onChange(e.target.value)}
            error={Boolean(fieldState.error)}
          >
            {Object.keys(CampaignRuleType).map((key) => (
              <MenuItem
                key={key}
                value={key}
              >
                {ruleTypeLabels[key as RuleType]}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText error>{fieldState.error?.message}</FormHelperText>
        </FormControl>
      )}
    />
  )
}
