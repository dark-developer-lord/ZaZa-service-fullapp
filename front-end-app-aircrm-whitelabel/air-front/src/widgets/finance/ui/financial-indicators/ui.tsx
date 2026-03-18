import { Link, useLocation } from 'react-router-dom'
import { Box, Stack, Typography, IconButton, useTheme, useMediaQuery } from '@mui/material'
import { Board } from '@shared/ui'
import { StatisticTotal } from '@widgets/statistic-chart/ui/statistic-total'

import { useGetFinanceStatistic } from '../../api/get-finance-statistic'

import { RouterPaths } from '@shared/lib'
import ArrowLink from '@icons/arrow-link.svg?react'

export const Ui = () => {
    const { palette } = useTheme()
    const { data, isFetching } = useGetFinanceStatistic()
    const { pathname } = useLocation()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))
    return (<>
    {!isMobile && (
        <Board>
            <Box
                sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: '24px',
                }}
            >
                <Typography variant='h6'>Основные финансовые показатели</Typography>
                {pathname === RouterPaths.finance && (
                    <Link to={RouterPaths.financeIndicators}>
                        <IconButton>
                            <ArrowLink
                                width={24}
                                height={24}
                                stroke={palette.text.secondary}
                            />
                        </IconButton>
                    </Link>
                )}
            </Box>
                <Stack
                    direction='row'
                    spacing="16px"
                >
                    <StatisticTotal
                        label="Доход за год"
                        value={Number(data?.year_income)}
                        isLoading={isFetching}
                    />
                    <StatisticTotal
                        label="Доход за месяц"
                        value={Number(data?.month_income)}
                        isLoading={isFetching}
                    />
                    <StatisticTotal
                        label="Доход за неделю"
                        value={Number(data?.week_income)}
                        isLoading={isFetching}
                    />
                     <StatisticTotal
                        label="Доход за сегодня"
                        value={Number(data?.today_income)}
                        isLoading={isFetching}
                    />
                </Stack>
        </Board>
    )}
</>)
}