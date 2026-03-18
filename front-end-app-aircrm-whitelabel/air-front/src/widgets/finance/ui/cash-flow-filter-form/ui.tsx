import { useState } from 'react'
import {
    Stack,
    Typography,
    Grid,
    Button,
    useTheme,
    useMediaQuery,
} from '@mui/material'
import { Board, DateRangePicker } from '@shared/ui'

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

export const Ui = () => {
    const [filter, setFilter] = useState<FilterType>(defaultFilter)
    const filterStore = useCashFlowFilterStore()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))

    const handleChange =
        (name: keyof FilterType) => (value: FilterType[typeof name]) => {
            setFilter(filter => ({
            ...filter,
            [name]: value,
            }))
        }
    const applyFilter = () => {
        filterStore.changeType(filter.type)
        filterStore.changeCategory(filter.category_id)
        filterStore.changeSubCategory(filter.subcategory_id)
        filterStore.changeDate(filter.date)
    }
    const clearFilter = () => {
      setFilter(defaultFilter)
      filterStore.clearFilter()
    }


    return (
        <Board>
            <Typography variant="h6" mb="24px">Фильтр</Typography>
            <Stack
            >
              <Grid container spacing={isMobile ? 2 : 3} >
                  <Grid item xs={12} mobile={4}>
                    <TransactionTypeSelect
                        value={filter.type}
                        changeValue={handleChange("type")}
                    />
                  </Grid>
                  <Grid item xs={12} mobile={4}>
                    <CategorySelect
                        value={filter.category_id}
                        changeValue={handleChange("category_id")}
                    />
                  </Grid>
                  <Grid item xs={12} mobile={4}>
                    <SubCategorySelect
                        value={filter.subcategory_id}
                        changeValue={handleChange("subcategory_id")}
                        categoryId={filter.category_id as number}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <DateRangePicker
                      localeText={{
                        start: "От",
                        end: "До"
                      }}
                      value={filter.date}
                      onChange={handleChange("date")}
                    />
                  </Grid>
              </Grid>
              <Stack
                direction="row"
                justifyContent="flex-end"
                spacing={2}
                mt={3}
                mb={2}
              >
                <Button
                  onClick={applyFilter}
                  size='medium'
                >
                  Применить
                </Button>
                <Button
                  variant="outlined"
                  size='medium'
                  onClick={clearFilter}
                >
                  Очистить
                </Button>
              </Stack>
            </Stack>
        </Board>
    )
}