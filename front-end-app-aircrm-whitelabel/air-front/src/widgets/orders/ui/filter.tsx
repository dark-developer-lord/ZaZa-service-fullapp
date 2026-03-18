import { useState } from 'react'
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material'


import {
  OrdersStatuses,
  RestaurantOrdersSelect,
  useOrdersFilterStore,
} from '@features/orders'
import { OrderStatus } from '@shared/lib'
import { useGetLoginSource } from '@shared/auth'
import { DateRangePicker } from '@shared/ui'
import CloseIcon from '@icons/close.svg?react'

import { FilterDto } from '../api/filter-dto'

const defaultChecked: string[] = Object.keys(OrderStatus)

const defaultFilter: FilterDto = {
  restaurantId: null,
  warehouseId: null,
  status: defaultChecked,
  date: [null, null],
  duration: 'none',
  hasInstallment: null,
}

export const Filter = () => {
  const [filter, setFilter] = useState<FilterDto>(defaultFilter)
  const state = useOrdersFilterStore()
  const loginSource = useGetLoginSource()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))

  // useEffect(() => {
    //   setFilter({
      //     restaurantId: state.restaurantId,
      //     warehouseId: state.warehouseId,
      //     status: state.statuses.length === 0 ? defaultChecked : state.statuses,
      //     date: state.date,
      //     duration: state.activeKey,
      //   })
      //   // eslint-disable-next-line react-hooks/exhaustive-deps
      // }, [state.filterOpened])

      const handleChange =
      (name: keyof FilterDto) => (value: FilterDto[typeof name]) => {
        setFilter(filter => ({
          ...filter,
          [name]: value,
        }))
      }

      const isAllChecked =
    Object.keys(defaultChecked).length === Object.keys(filter.status).length

  const checkCheckboxParent = () => {
    if (isAllChecked) {
      setFilter({
        ...filter,
        status: [],
      })
    } else {
      setFilter({
        ...filter,
        status: defaultChecked,
      })
    }
  }

  const handleCheckboxChange = (key: string) => () => {
    const list = filter.status
    if (list.includes(key)) {
      setFilter({
        ...filter,
        status: list.filter((item) => item !== key),
      })
    } else {
      setFilter({
        ...filter,
        status: [...list, key],
      })
    }
  }

  const clearFilter = () => {
    setFilter({
      restaurantId: null,
      warehouseId: null,
      status: defaultChecked,
      date: [null, null],
      duration: 'none',
      hasInstallment: null,
    })
    state.clearFilter()
    state.closeFilter()
  }

  const applyFilter = () => {
    state.changeSource(filter.restaurantId, filter.warehouseId)
    state.changeStatuses(filter.status)
    state.changeDate(filter.date)
    state.changeInstallment(filter.hasInstallment)
    state.closeFilter()
    state.clearDuration()
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
      >
        { loginSource === 'admin' && (
          <RestaurantOrdersSelect
            value={filter.restaurantId || filter.warehouseId}
            sourceType={filter.restaurantId ? 'store' : 'warehouse'}
            changeStore={handleChange('restaurantId')}
            changeWarehouse={handleChange('warehouseId')}
          />
        )}

        <DateRangePicker
          localeText={{
            start: 'От',
            end: 'До',
          }}
          value={filter.date}
          onChange={handleChange('date')}
        />
        <OrdersStatuses
          isAllChecked={isAllChecked}
          checked={filter.status}
          checkParent={checkCheckboxParent}
          handleChange={handleCheckboxChange}
        />

        <FormControl component="fieldset">
          <FormLabel component="legend">Рассрочка</FormLabel>
          <RadioGroup
            value={filter.hasInstallment === null ? 'all' : filter.hasInstallment.toString()}
            onChange={(e) => {
              const value = e.target.value
              if (value === 'all') {
                handleChange('hasInstallment')(null)
              } else {
                handleChange('hasInstallment')(value === 'true')
              }
            }}
          >
            <FormControlLabel
              value="all"
              control={<Radio />}
              label="Все заказы"
            />
            <FormControlLabel
              value="true"
              control={<Radio />}
              label="С рассрочкой"
            />
            <FormControlLabel
              value="false"
              control={<Radio />}
              label="Без рассрочки"
            />
          </RadioGroup>
        </FormControl>
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
        mb: {xs: '32px', mobile: '64px'}
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
        padding: '28px 0',
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
