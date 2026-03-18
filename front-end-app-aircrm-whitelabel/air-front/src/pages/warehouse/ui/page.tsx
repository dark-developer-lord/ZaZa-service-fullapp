import { Warehouse } from '@widgets/warehouse'
import { LayoutContent } from '@widgets/layout'

import { SystemWarehouseDropdown } from '@features/products/system-warehouse-dropdown'

import { StatisticList } from '@entities/warehouse'
import { useMediaQuery, useTheme } from '@mui/material'
import { CreateProductButton } from '@features/products'
import { useSearchParams } from 'react-router-dom'
import { CreateReportButton } from '@features/warehouse'
import { RouterPaths } from '@shared/lib'

export const Page = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))
  const [searchParams] = useSearchParams()
  const reportType = searchParams.get('report')

  return (
    <LayoutContent
      title={isMobile ? 'Товары' : 'Добавить товар' }
      breadcrumbs={[
        {
          label: 'Склад',
          name: 'warehouse',
        }
      ]}
      rightSlot={
        <>
          {reportType === 'receipt' ? (
            <CreateReportButton path={RouterPaths.createReceipt} text="Создать оприходование" />
          ) : reportType === 'flow' ? null : (
            <CreateProductButton />
          )}
          <SystemWarehouseDropdown />
        </>
      }
    >
      <StatisticList />
      <Warehouse />
    </LayoutContent>
  )
}
