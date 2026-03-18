import { useEffect, useState } from 'react'
import { Box, Typography, FormControl, Select, MenuItem, SelectChangeEvent } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import toast from 'react-hot-toast'

import { TransfersTable } from '@entities/warehouse'
import { Board, Search } from '@shared/ui'
import { useGetWarehouses } from '@entities/warehouses'

import { useGetIncomingTransfers } from '../api/get-incoming-transfers'
import { useAcceptIncomingTransfer } from '../api/accept-incoming-transfer'
import { useIncomingTransferStore } from '../model/incoming-transfers-store'

export const Ui = () => {
  const { data, isFetching, error } = useGetIncomingTransfers()
  const { data: warehousesData } = useGetWarehouses()
  const {
    paginationModel,
    setPaginationModel,
    clear,
    setSearchValue,
    searchValue,
  } = useIncomingTransferStore()

  // Track warehouse selection per transfer row
  const [warehouseSelections, setWarehouseSelections] = useState<Record<number, number | ''>>({})
  const [acceptingTransferId, setAcceptingTransferId] = useState<number | null>(null)

  const { mutate: acceptTransfer, isLoading: isAccepting } = useAcceptIncomingTransfer()

  useEffect(() => {
    return clear
  }, [clear])

  const handleWarehouseChange = (transferId: number, warehouseId: number | '') => {
    setWarehouseSelections((prev) => ({
      ...prev,
      [transferId]: warehouseId,
    }))
  }

  const handleAccept = (transferId: number) => {
    const selectedWarehouse = warehouseSelections[transferId]

    if (!selectedWarehouse) {
      toast.error('Выберите склад для оприходования')
      return
    }

    setAcceptingTransferId(transferId)
    acceptTransfer(
      {
        transferId,
        data: { to_warehouse_id: selectedWarehouse as number },
      },
      {
        onSuccess: () => {
          // Clear selection for this transfer
          setWarehouseSelections((prev) => {
            const newSelections = { ...prev }
            delete newSelections[transferId]
            return newSelections
          })
          setAcceptingTransferId(null)
        },
        onError: () => {
          setAcceptingTransferId(null)
        },
      }
    )
  }

  // Warehouse Selector Component (replaces Status column)
  const WarehouseSelector = ({ row }: { row: any }) => {
    const selectedWarehouse = warehouseSelections[row.id] || ''

    return (
      <FormControl fullWidth size="small">
        <Select
          displayEmpty
          value={selectedWarehouse as any}
          onChange={(e: SelectChangeEvent) => {
            handleWarehouseChange(row.id, e.target.value as unknown as number)
          }}
          size="small"
          disabled={isAccepting && acceptingTransferId === row.id}
          renderValue={(selected) => {
            if (!selected) {
              return <span style={{ color: '#9e9e9e', fontSize: 14 }}>Выберите склад</span>
            }
            const warehouse = warehousesData?.data.find((item) => item.id === Number(selected))
            return warehouse?.name ?? ''
          }}
        >
          {warehousesData?.data.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )
  }

  // Accept Button Component
  const AcceptActions = ({ row }: { row: any }) => {
    const selectedWarehouse = warehouseSelections[row.id]
    const isCurrentlyAccepting = isAccepting && acceptingTransferId === row.id

    return (
      <LoadingButton
        variant="contained"
        size="small"
        loading={isCurrentlyAccepting}
        onClick={() => handleAccept(row.id)}
        disabled={!selectedWarehouse}
        sx={{ minWidth: 100 }}
      >
        Принять
      </LoadingButton>
    )
  }

  // Custom empty state message
  const NoRowsOverlay = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '100px 0',
      }}
    >
      <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>
        Входящие перемещения будут отображаться здесь для принятия
      </Typography>
    </Box>
  )

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
        <Typography component="h4" fontSize="20px" fontWeight="600" lineHeight="24px">
          Полученные товары
        </Typography>
        <Search value={searchValue} onChange={setSearchValue} />
      </Box>
      <TransfersTable
        data={data}
        isFetching={isFetching}
        paginationModel={paginationModel}
        changePaginationModel={setPaginationModel}
        Actions={AcceptActions}
        StatusDropdown={WarehouseSelector}
        statusHeaderName="Склад"
        error={error}
        slots={{
          noRowsOverlay: NoRowsOverlay,
        }}
      />
    </Board>
  )
}

