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

import CloseIcon from '@icons/close.svg?react'

import { useCustomerFilterStore } from '../model/store'

interface FilterDto {
  orderType: 'general' | 'imported'
}

const defaultFilter: FilterDto = {
  orderType: 'general',
}

export const FilterDrawer = () => {
  const [filter, setFilter] = useState<FilterDto>(defaultFilter)
  const state = useCustomerFilterStore()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))

  const handleChange = (name: keyof FilterDto) => (value: FilterDto[typeof name]) => {
    setFilter(filter => ({
      ...filter,
      [name]: value,
    }))
  }

  const clearFilter = () => {
    setFilter(defaultFilter)
    state.clearFilter()
    state.closeFilter()
  }

  const applyFilter = () => {
    state.changeOrderType(filter.orderType)
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
        <FormControl component="fieldset">
          <FormLabel component="legend">Тип заказов</FormLabel>
          <RadioGroup
            value={filter.orderType}
            onChange={(e) => handleChange('orderType')(e.target.value as 'general' | 'imported')}
          >
            <FormControlLabel
              value="general"
              control={<Radio />}
              label="Общие сведения"
            />
            <FormControlLabel
              value="imported"
              control={<Radio />}
              label="Импортированные заказы"
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

const Footer = ({
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
