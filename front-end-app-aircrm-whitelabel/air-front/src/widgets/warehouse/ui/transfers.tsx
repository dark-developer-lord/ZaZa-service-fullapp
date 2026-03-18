import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Button } from '@mui/material'

import { TransferActions } from '@features/transfer'
import { TransferStatusDropdown } from '@features/warehouse/transfer-status-dropdown'
import { TransfersTable } from '@entities/warehouse'
import { Board, Search } from '@shared/ui'
import { RouterPaths } from '@shared/lib'

import AddIcon from '@icons/add-fill.svg?react'

import { useGetTransfers } from '../api/get-transfers'
import { useTransferStore } from '../model/transfers-store'

export const Ui = () => {
  const navigate = useNavigate()
  const { data, isFetching, error } = useGetTransfers()
  const {
    paginationModel,
    setPaginationModel,
    clear,
    setSearchValue,
    searchValue,
  } = useTransferStore()

  useEffect(() => {
    return clear
  }, [clear])

  return (
    <Board>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          mb: '24px',
        }}
      >
        <Typography component="h4"
            fontSize="20px"
            fontWeight="600"
            lineHeight="24px"
        >Перемещения</Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Search
            value={searchValue}
            onChange={setSearchValue}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={
              <AddIcon
                width={20}
                height={20}
                fill="white"
              />
            }
            sx={{
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: '#004547',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 8px rgba(0, 84, 86, 0.3)',
              },
              transition: 'all 0.2s ease-in-out',
              borderRadius: 1,
              whiteSpace: 'nowrap',
            }}
            onClick={() => navigate(RouterPaths.createTransfer)}
          >
            Создать
          </Button>
        </Box>
      </Box>
      <TransfersTable
        data={data}
        isFetching={isFetching}
        paginationModel={paginationModel}
        changePaginationModel={setPaginationModel}
        Actions={TransferActions}
        StatusDropdown={TransferStatusDropdown}
        error={error}
        slots={{
          noRowsOverlay: () => (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '100px 0',
              }}
            >
              <Typography>Нет перемещений</Typography>
            </Box>
          ),
        }}
      />
    </Board>
  )
}

