import { useSearchParams } from 'react-router-dom'
import { Grid, useMediaQuery, useTheme } from '@mui/material'

import { icons, Keys, texts, colors, backgrounds } from '../lib/keys'
import { Card } from './card'
import { useGetIncomingTransfersCount } from '@widgets/warehouse/api/get-incoming-transfers-count'

export const List = () => {
  const [searchParams] = useSearchParams()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("mobile"))
  const { data: incomingCount } = useGetIncomingTransfersCount()

  return (
    <Grid
      container
      spacing={isMobile ? 1 : 2}
      mb={2}
    >
      {/* to - do => 'write-off' */}
      {/* inventory card commented out - feature not completed yet */}
      {( ['goods', 'receipt', 'sales', 'flow', 'incoming' /* , 'inventory' */] as Keys[]).map((reportType) => (
        <Grid
          key={reportType}
          item
          xs={6}
          mobile={6}
          sm={4}
          md={3}
          lg={2.4}
        >
          <Card
            icon={icons[reportType]}
            color={colors[reportType]}
            backgroundColor={backgrounds[reportType]}
            link={reportType === 'goods' ? '/warehouse' : `/warehouse?report=${reportType}`}
            title={texts[reportType]}
            active={reportType === searchParams.get('report') || searchParams.get('report') === null && reportType === 'goods'}
            badgeCount={reportType === 'incoming' ? incomingCount : undefined}
          />
        </Grid>
      ))}
    </Grid>
  )
}