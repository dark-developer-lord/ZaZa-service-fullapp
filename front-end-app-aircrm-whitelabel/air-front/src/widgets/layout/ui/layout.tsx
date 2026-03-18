import { PropsWithChildren, ReactNode } from 'react'
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'

import { UserDropdown } from '@features/user-dropdown'
import { Breadcrumb, Header, UserPanel } from '@shared/layout'


interface Props extends PropsWithChildren {
  title?: ReactNode
  subtitle?: ReactNode
  rightSlot?: ReactNode
  breadcrumbs?: Breadcrumb[]
  breadcrumbsRightSlot?: ReactNode
}

export const LayoutContent = ({
  title,
  breadcrumbs,
  children,
  subtitle,
  rightSlot,
  breadcrumbsRightSlot,
}: Props) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))
  return (
    <div>
      <Header
        header={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexGrow: 1,
            }}
          >
            <Box>
              {title && (
                <Typography
                  variant={isMobile ? 'h4' : 'h3'}
                  component='h1'
                  sx={{ mb: subtitle ? '4px' : 0 }}
                >
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography
                  variant={isMobile ? 'small' : 'medium'}
                  component="p"
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
            {rightSlot}
          </Box>
        }
        panel={<UserPanel userSlot={<UserDropdown />} />}
        breadcrumbs={breadcrumbs}
        breadcrumbsRightSlot={<>
          {breadcrumbsRightSlot}
          {rightSlot}
        </>}
      />
      {children}
    </div>
  )
}
