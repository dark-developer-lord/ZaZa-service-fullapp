import { ReactNode } from 'react'
import { Box, useMediaQuery, useTheme } from '@mui/material'

import { Breadcrumb, LayoutBreadcrumbs } from './breadcrumbs'

interface Props {
  breadcrumbs?: Breadcrumb[]
  header?: ReactNode
  panel?: ReactNode
  breadcrumbsRightSlot?: ReactNode
}

export const Header = ({ breadcrumbs, header, panel, breadcrumbsRightSlot }: Props) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))
  const showBreadcrumbs = Boolean(breadcrumbs) && !isMobile
  const showHeaderTitle = !showBreadcrumbs // Hide title when breadcrumbs visible; keep on mobile/no-breadcrumb pages

  return (
    <>
      {showBreadcrumbs && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '20px' }}>
          <LayoutBreadcrumbs breadcrumbs={breadcrumbs!} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {breadcrumbsRightSlot}
            {panel}
          </Box>
        </Box>
      )}
      {showHeaderTitle && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '32px', gap: 2 }}>
          {header}
          {!showBreadcrumbs && panel}
        </Box>
      )}
    </>
  )
}
