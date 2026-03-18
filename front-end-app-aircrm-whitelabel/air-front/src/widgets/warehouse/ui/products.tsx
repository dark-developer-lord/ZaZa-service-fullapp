import { useEffect } from 'react'
import { Box, Stack, useTheme, useMediaQuery } from '@mui/material'

import { ExportProducts, ProductActions, ProductStatusToggle, WarehouseFilter } from '@features/products'
import { ProductsTable, UpdateImageModal, useUpdateImageStore } from '@entities/warehouse'
import { Board, Search } from '@shared/ui'

import { useGetProducts } from '../api/get-producs'
import { useProductsStore } from '../model/products-store'

export const Ui = () => {
  const { data, isFetching, error } = useGetProducts()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("mobile"))
  const {
    paginationModel,
    setPaginationModel,
    clear,
    setSearchValue,
    searchValue,
  } = useProductsStore()
  const { isOpen, productId, closeModal } = useUpdateImageStore()

  useEffect(() => {
    return clear
  }, [clear])

  return (
    <Board>
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
        <Stack
          flexDirection="row"
          gap={2}
          sx={{ flexWrap: 'wrap' }}
        >
          <WarehouseFilter />
          <ExportProducts />
        </Stack>
      </Box>
        <ProductsTable
            data={data}
            isFetching={isFetching}
            paginationModel={paginationModel}
            changePaginationModel={setPaginationModel}
            Actions={ProductActions}
            StatusToggle={ProductStatusToggle}
            error={error}
        />
        <UpdateImageModal
          open={isOpen}
          productId={productId}
          onClose={closeModal}
        />
    </Board>
  )
}
