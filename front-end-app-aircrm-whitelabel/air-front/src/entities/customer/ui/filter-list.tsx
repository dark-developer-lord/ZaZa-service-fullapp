import { useSearchParams } from 'react-router-dom'
import { Grid } from '@mui/material'
import { purple } from '@mui/material/colors'

import { palette } from '@shared/theme/palette'
import { useAIAdvisorStore } from '@features/ai-advisor'
import { Card } from './filter-card'

export type CustomerFilterKeys = 'birthday' | 'new' | 'repeat' | 'absent' | 'call_results'

interface FilterOption {
  key: CustomerFilterKeys
  title: string
  icon: string
  color: string
  param: string
}

const filterOptions: FilterOption[] = [
  {
    key: 'birthday',
    title: 'День рождения',
    icon: '/icons/db.svg',
    color: purple[500],
    param: 'birthday=monthly'
  },
  {
    key: 'new',
    title: 'Новые клиенты',
    icon: '/icons/db.svg',
    color: palette.info.main,
    param: 'type=new'
  },
  {
    key: 'repeat',
    title: 'Повторные продажи',
    icon: '/icons/db.svg',
    color: '#0E9F6E',
    param: 'type=repeat'
  },
  {
    key: 'absent',
    title: 'Отсутствие',
    icon: '/icons/db.svg',
    color: '#F05252',
    param: 'type=absent'
  },
  {
    key: 'call_results',
    title: 'Результаты звонков',
    icon: '/icons/db.svg',
    color: '#7C3AED',
    param: 'type=call_results'
  }
]

export const CustomerFilterList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const setActiveActionUrl = useAIAdvisorStore((state) => state.setActiveActionUrl)

  const activeFilter = searchParams.get('filter')

  const handleFilterClick = (option: FilterOption) => {
    // Clear action URL when clicking any filter card
    setActiveActionUrl(null)

    const newParams = new URLSearchParams(searchParams)

    if (activeFilter === option.key) {
      // If clicking the same filter, remove it
      newParams.delete('filter')
      newParams.delete('birthday')
      newParams.delete('type')
    } else {
      // Set new filter
      newParams.set('filter', option.key)

      // Remove previous filter params
      newParams.delete('birthday')
      newParams.delete('type')

      // Add new filter param
      if (option.key === 'birthday') {
        newParams.set('birthday', 'monthly')
      } else if (option.key === 'call_results') {
        newParams.set('type', 'call_results')
      } else {
        newParams.set('type', option.key === 'new' ? 'new' : option.key === 'repeat' ? 'repeat' : 'absent')
      }
    }

    setSearchParams(newParams)
  }

  return (
    <Grid
      container
      spacing={2}
      mb={3}
      sx={{
        '& .MuiGrid-item': {
          display: 'flex',
        }
      }}
    >
      {filterOptions.map((option) => (
        <Grid
          key={option.key}
          item
          xs={12}
          sm={12}
          md={2.4}
          lg={2.4}
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
