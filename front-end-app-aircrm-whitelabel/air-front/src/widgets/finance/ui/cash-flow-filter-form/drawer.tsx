import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

import { DateRangePicker } from '@shared/ui'
import CloseIcon from '@icons/close.svg?react'

import { TransactionTypeSelect } from './transaction-type-select'
import { CategorySelect } from './category-select'
import { SubCategorySelect } from './sub-category-select'

import { useCashFlowFilterStore } from '@features/analytic/cash-flow/filter-orders'
import { DateRange } from '@mui/x-date-pickers-pro'
import { Dayjs } from 'dayjs'

interface FilterType {
  type: "income" | "expense" | null
  category_id: number | null
  subcategory_id: number | null
  date: DateRange<Dayjs>
}

const defaultFilter: FilterType = {
  type: null,
  category_id: null,
  subcategory_id: null,
  date: [null, null]
}

export const FilterDrawer = () => {
  const [filter, setFilter] = useState<FilterType>(defaultFilter)
  const state = useCashFlowFilterStore()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))

  useEffect(() => {
    if (state.filterOpened) {
      setFilter({
        type: state.type,
        category_id: state.category_id,
        subcategory_id: state.subcategory_id,
        date: state.date,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.filterOpened])

  const handleChange =
    (name: keyof FilterType) => (value: FilterType[typeof name]) => {
      setFilter(filter => ({
        ...filter,
        [name]: value,
      }))
    }

  const clearFilter = () => {
    const clearedFilter = {
      type: null,
      category_id: null,
      subcategory_id: null,
      date: [null, null] as DateRange<Dayjs>
    }
    setFilter(clearedFilter)
    state.clearFilter()
    state.closeFilter()
  }

  const applyFilter = () => {
    state.changeType(filter.type)
    state.changeCategory(filter.category_id)
    state.changeSubCategory(filter.subcategory_id)
    state.changeDate(filter.date)
    state.closeFilter()
  }

  return (
    <Drawer
      sx={{
        '.MuiDrawer-paperAnchorBottom': {
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px'
        },
      }}
      PaperProps={{
        sx: {
          minWidth: '0px'
        }
      }}
      open={state.filterOpened}
      onClose={() => {
        state.closeFilter()
        setFilter(defaultFilter)
      }}
      anchor={!isMobile ? 'right' : 'bottom'}
    >
      <Header close={state.closeFilter} />
      <Stack
        width={!isMobile ? 450 : '100%'}
        spacing={!isMobile ? '32px' : '16px'}
        sx={{ p: 3 }}
      >
        <TransactionTypeSelect
          value={filter.type}
          changeValue={handleChange("type")}
        />
        <CategorySelect
          value={filter.category_id}
          changeValue={handleChange("category_id")}
        />
        <SubCategorySelect
          value={filter.subcategory_id}
          changeValue={handleChange("subcategory_id")}
          categoryId={filter.category_id as number}
        />
        <DateRangePicker
          localeText={{
            start: "От",
            end: "До"
          }}
          value={filter.date}
          onChange={handleChange("date")}
        />
      </Stack>
      <Footer
        clear={clearFilter}
        apply={applyFilter}
      />
    </Drawer>
  )
}

const Header = ({ close }: { close: () => void }) => {
  const { palette } = useTheme()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: { xs: '32px', mobile: '64px' },
        p: 3,
        pb: 0,
      }}
    >
      <Typography variant={isMobile ? 'h4' : 'h3'}>Фильтр</Typography>
      <IconButton onClick={close}>
        <CloseIcon
          width={24}
          height={24}
          stroke={palette.text.secondary}
        />
      </IconButton>
    </Box>
  )
}

export const Footer = ({
  clear,
  apply,
}: {
  clear: () => void
  apply: () => void
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        mt: '32px',
        padding: '28px 24px',
        width: '100%',
      }}
    >
      <Stack
        direction="row"
        spacing="16px"
        width="100%"
      >
        <Button
          variant="outlined"
          fullWidth
          size={isMobile ? 'medium' : 'large'}
          onClick={clear}
        >
          Очистить
        </Button>
        <Button
          variant="contained"
          fullWidth
          size={isMobile ? 'medium' : 'large'}
          onClick={apply}
        >
          Применить
        </Button>
      </Stack>
    </Box>
  )
}
