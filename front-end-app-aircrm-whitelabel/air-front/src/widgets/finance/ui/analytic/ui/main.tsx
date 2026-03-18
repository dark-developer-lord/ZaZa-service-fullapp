import { Box, Typography } from '@mui/material'

import { Board, Search } from '@shared/ui'

import { FinanceTable } from '@entities/finance'

import { useStore } from '../model/store'
import { useGetProductProfitability } from '../api/get-products'
import { useGetLoginSource } from '@shared/auth'
import { ExportProfitabilityButton } from '@features/finance/export-profitability'

export const Ui = () => {
    const { data, isFetching, error } = useGetProductProfitability()
    const loginSource = useGetLoginSource()
    const {
        paginationModel,
        setPaginationModel,
        clearState,
        searchValue,
        setSearchValue,
    } = useStore((state) => ({
        paginationModel: state.paginationModel,
        setPaginationModel: state.setPaginationModel,
        searchValue: state.searchValue,
        setSearchValue: state.setSearchValue,
        clearState: state.clear,
    }))
    return (
        <Board>
            <Box
                sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: '24px',
                }}
            >
                <Typography
                    variant='h6'
                    textAlign='center'
                >Анализ прибыльности по товарам</Typography>
            </Box>
            <Box
                sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                mb: '24px',
                }}
            >
                <Box sx={{ minWidth: '280px', flex: '1 1 auto' }}>
                    <Search
                        value={searchValue}
                        onChange={setSearchValue}
                    />
                </Box>
                <ExportProfitabilityButton />
            </Box>
            <FinanceTable
                data={data}
                isFetching={isFetching}
                paginationModel={paginationModel}
                changePaginationModel={setPaginationModel}
                error={error}
            />
        </Board>
    )
}