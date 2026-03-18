import { Checkbox, FormControlLabel, Stack } from '@mui/material'

import { OrderStatus, orderStatusLabels, OrderStatusType } from '@shared/lib'

interface Props {
  checked: string[]
  checkParent: () => void
  handleChange: (key: string) => () => void
  isAllChecked: boolean
}

export const OrdersStatuses = ({
  checked,
  checkParent,
  handleChange,
  isAllChecked,
}: Props) => {
  return (
    <Stack>
      <FormControlLabel
        label="Все"
        control={
          <Checkbox
            checked={isAllChecked}
            indeterminate={!isAllChecked && checked.length > 0}
            onChange={checkParent}
          />
        }
      />
      {Object.entries(OrderStatus).map(([key]) => (
        <FormControlLabel
          key={key}
          label={orderStatusLabels[key as OrderStatusType].label}
          control={
            <Checkbox
              checked={checked.includes(key)}
              onChange={handleChange(key)}
            />
          }
        />
      ))}
    </Stack>
  )
}
