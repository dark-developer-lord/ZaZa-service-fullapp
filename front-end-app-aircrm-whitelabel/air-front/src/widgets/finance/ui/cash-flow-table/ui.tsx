import { Box, Typography, Chip, Skeleton, Stack, Button, Dialog, DialogContent, DialogTitle, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { Board, Search } from "@shared/ui";

import { Table as TransactionTable } from "./table";
import { TransactionActions } from "@features/analytic/cash-flow/actions";
import { FilterToggleButton } from "@features/analytic/cash-flow/filter-orders";
import { FilterDrawer } from "../cash-flow-filter-form/drawer";
import CloseIcon from '@icons/close.svg?react'
import { CreateCashFlowForm } from "@features/finance";

import { useGetTransactions } from "../../api/get-transactions";
import { useGetTransactionsTotal } from "../../api/get-transactions-total";
import { useCashFlowFilterStore } from "@features/analytic/cash-flow/filter-orders";
import { useState } from "react";

export function Transactions() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))
  const [createOpened, setCreateOpened] = useState(false)
  const { data, isFetching, error } = useGetTransactions()
  const { data: totalsData, isFetching: isFetchingTotals } = useGetTransactionsTotal()
  const { searchValue, setSearchValue, paginationModel, changePaginationModel } = useCashFlowFilterStore()
  return (
    <Board
    >
      <Typography 
        variant="h6" 
        component="h3"
        mb="24px"
        textAlign="center"
      >Транзакции</Typography>
      
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: '24px',
          gap: '16px',
        }}
      >
        <Box sx={{ minWidth: '280px', flex: '1 1 auto' }}>
          <Search
            value={searchValue}
            onChange={setSearchValue}
          />
        </Box>
        {/* Display totals on right side of search bar */}
        {(totalsData || isFetchingTotals) && (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap', gap: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" fontWeight="medium">
                Доход:
              </Typography>
              {isFetchingTotals ? (
                <Skeleton width={100} height={24} variant="rounded" />
              ) : (
                <Chip
                  label={`${(totalsData?.total_income || 0).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} с.`}
                  size="small"
                  sx={{
                    bgcolor: 'success.main',
                    color: 'success.contrastText',
                    fontWeight: 'bold'
                  }}
                />
              )}
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" fontWeight="medium">
                Расход:
              </Typography>
              {isFetchingTotals ? (
                <Skeleton width={100} height={24} variant="rounded" />
              ) : (
                <Chip
                  label={`${(totalsData?.total_expense || 0).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} с.`}
                  size="small"
                  sx={{
                    bgcolor: 'error.main',
                    color: 'error.contrastText',
                    fontWeight: 'bold'
                  }}
                />
              )}
            </Stack>
          </Stack>
        )}
        <Stack
          columnGap="12px"
          direction="row"
          sx={{
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <FilterToggleButton />
          {isMobile && (
            <Button
              variant="contained"
              onClick={() => setCreateOpened(true)}
            >
              Добавить
            </Button>
          )}
        </Stack>
      </Box>
      <FilterDrawer />

      {/* Mobile: create transaction as modal to reduce vertical scroll */}
      <Dialog
        open={createOpened}
        onClose={() => setCreateOpened(false)}
        PaperProps={{
          sx: {
            minWidth: { xs: '360px', mobile: '480px' },
            maxHeight: { xs: '80vh', sm: '85vh' },
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography variant="h6" component="span">Записать транзакцию</Typography>
          <IconButton onClick={() => setCreateOpened(false)}>
            <CloseIcon width={22} height={22} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 2, overflowY: 'auto' }}>
          <CreateCashFlowForm
            embedded
            onSuccess={() => setCreateOpened(false)}
          />
        </DialogContent>
      </Dialog>

      <TransactionTable
        data={data}
        isFetching={isFetching}
        paginationModel={paginationModel}
        changePaginationModel={changePaginationModel}
        Actions={TransactionActions}
        error={error}
      />
    </Board>
  )
}