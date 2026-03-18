import { useSearchParams } from 'react-router-dom'
import { Grid } from '@mui/material'

import { palette } from '@shared/theme/palette'
import { Card } from '@entities/customer/ui/filter-card'

export type InstallmentFilterKeys = 'unpaid' | 'paid' | 'expired'

interface FilterOption {
  key: InstallmentFilterKeys
  title: string
  icon: string
  color: string
  param: string
}

const filterOptions: FilterOption[] = [
  {
    key: 'unpaid',
    title: 'Список рассрочек',
    icon: '/icons/db.svg',
    color: palette.info.main,
    param: 'is_paid=0'
  },
  {
    key: 'paid',
    title: 'Оплаченные рассрочки',
    icon: '/icons/db.svg',
    color: '#0E9F6E',
    param: 'is_paid=1'
  },
  {
    key: 'expired',
    title: 'Просроченные рассрочки',
    icon: '/icons/db.svg',
    color: '#F05252',
    param: 'is_expired=1'
  }
]

export const InstallmentFilterList = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const activeFilter = searchParams.get('filter') || 'unpaid' // Default to unpaid

  const handleFilterClick = (option: FilterOption) => {
    const newParams = new URLSearchParams(searchParams)

    if (activeFilter === option.key) {
      newParams.delete('filter')
      newParams.delete('is_paid')
      newParams.delete('is_expired')
      newParams.delete('due_date')
    } else {
      newParams.set('filter', option.key)

      // reset conflicting params
      newParams.delete('is_paid')
      newParams.delete('is_expired')
      newParams.delete('due_date')

      if (option.key === 'unpaid') {
        newParams.set('is_paid', '0')
      } else if (option.key === 'paid') {
        newParams.set('is_paid', '1')
      } else if (option.key === 'expired') {
        newParams.set('is_expired', '1')
      }
    }

    setSearchParams(newParams)
  }

  return (
  <Grid
      container
      mb={3}
      sx={{
        mx: 0,
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      {filterOptions.map((option) => (
        <Grid
          key={option.key}
          item
          xs={3.9}
          sx={{ display: 'flex' }}
        >
          <Card
            icon={option.icon}
            color={option.color}
            title={option.title}
            active={activeFilter === option.key}
            onClick={() => handleFilterClick(option)}
          />
        </Grid>
      ))}
    </Grid>
  )
}
