import {
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Stack,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material'
import { Board } from "@shared/ui";

import dayjs from 'dayjs';
import { useGetMonthlyFinanceStatistic } from "../api/get-monthly-statistic";

dayjs.locale('ru-RU')

function MonthlyFinanceStatistic() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))
    const { data } = useGetMonthlyFinanceStatistic()
    if (!data) {
        return null
    }
    return (
        <Stack direction={isMobile ? 'column' : 'row'} spacing="16px">
                {
                    [{ name: 'income', label: 'Доходы' }, { name: 'expense' , label: 'Расходы' }, { name: 'income', label: 'Доходность' }].map(type => (
                        <Board sx={{ flexGrow: 1 }} key={type.label}>
                            <Typography variant="h6">{type.label}</Typography>
                            <List>
                                {
                                    (data as any)[type.name].map((item: any) => {
                                        let date = dayjs(item.month_key)
                                        const month = date.format("MMMM")
                                        const year = date.year()
                                        return (
                                            <ListItem
                                                key={item.month_key}
                                                sx={{ paddingX: 0 }}
                                            >
                                                <ListItemButton
                                                    sx={{
                                                        bgcolor: 'grey.100',
                                                        padding: '16px',
                                                        cursor: 'auto',
                                                    }}
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar sx={{ width: 44, height: 44, mr: '12px' }}/>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={`${month}, ${year}`}
                                                        secondary={
                                                            type.label === "Доходы"
                                                            ? "Общие доходы"
                                                            : type.label === "Расходы"
                                                            ? "Общие расходы" : "Общая доходность"
                                                        }
                                                        primaryTypographyProps={{
                                                            sx: { m: 0, textTransform: 'capitalize'}
                                                        }}
                                                        secondaryTypographyProps={{
                                                            sx: {
                                                                m: 0,
                                                                textOverflow: 'ellipsis',
                                                                overflow: 'hidden',
                                                                whiteSpace: 'nowrap',
                                                                minWidth: 'auto',
                                                            },
                                                        }}
                                                        sx={{ m: 0, mr: 2 }}
                                                    />
                                                    <ListItemText
                                                        primary={(type.label === 'Доходность' ? item.profitability : item.total) || 0 }
                                                        secondary={type.label === 'Доходность' ? `${item.percentage || 0} %` : 'Сомони'}
                                                        primaryTypographyProps={{
                                                            variant: 'medium',
                                                            color: 'primary.main',
                                                        }}
                                                        secondaryTypographyProps={{
                                                            sx: { textOverflow: 'revert !important' },
                                                        }}
                                                        sx={{
                                                            textAlign: 'right',
                                                            minWidth: 'auto',
                                                            m: 0,
                                                        }}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                    )})
                                }
                            </List>
                        </Board>

                    ))
                }
        </Stack>
    )
}

export { MonthlyFinanceStatistic }