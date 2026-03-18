import { Fragment } from 'react'
import {
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    useTheme
} from '@mui/material'


import { normalizeNumber } from '@shared/lib'

export const MarginalityList = () => {

    const { palette } = useTheme()
    const data = [
        {
            id: 1,
            product: 'Кроссовки Nike',
            param: {
                name: 'Топ по количеству продаж',
                value: 2314,
                unit: 'шт'
            },
            add: 'доходность 90000с',
            color: palette.info.main,
        },
        {
            id: 2,
            product: 'Духи La Coster',
            param: {
                name: 'Топ по прибыльности',
                value: 2500,
                unit: 'с'
            },
            add: 'количество: 10шт',
            color: palette.success.main,
        },
        {
            id: 3,
            product: 'Брюки Adios',
            param: {
                name: 'Топ по нерентабельности',
                value: 100,
                unit: 'шт'
            },
            add: '425 дней на складе',
            color: palette.error.main,
        }
    ]
  return (
    <List>
      {data.map((indicator, index) => (
        <Fragment key={indicator.id}>
          <ListItem sx={{ paddingX: 0 }}>
            <ListItemAvatar>
                <Avatar
                    src='/icons/db.svg'
                    // alt={order.customer.name}
                    sx={{
                        bgcolor: indicator.color,
                        width: 44,
                        height: 44,
                        mr: '12px',
                        '& > img': {
                            width: 20,
                            height: 20
                        }
                    }}
                />
            </ListItemAvatar>
            <ListItemText
                primary={indicator.product}
                secondary={indicator.param.name}
            />
            <ListItemText
                primary={`${normalizeNumber(indicator.param.value)} ${indicator.param.unit}.`}
                secondary={indicator.add}
                primaryTypographyProps={{
                    variant: 'medium',
                    color: 'success.main',
                }}
                sx={{
                    textAlign: 'right',
                }}
            />
            {/* <LastOrderCard order={order} /> */}
          </ListItem>
          {index !== data!.length - 1 && <Divider component="li" />}
        </Fragment>
      ))}
    </List>
  )
}
