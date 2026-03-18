import { Link } from 'react-router-dom'
import { Breadcrumbs, Link as MuiLink, useMediaQuery, useTheme } from '@mui/material'

import NavigateNextIcon from '@icons/chevron-right.svg?react'
import HomeIcon from '@icons/home.svg?react'

export interface Breadcrumb {
  path?: string
  name: string
  label: string
}

interface Props {
  breadcrumbs: Breadcrumb[]
}

export const LayoutBreadcrumbs = ({ breadcrumbs }: Props) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))
  return ( <>
    {
    !isMobile &&
    <Breadcrumbs
      separator={<NavigateNextIcon />}
      aria-label="breadcrumb"
    >
      <MuiLink
        sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}
        color="inherit"
        to="/onboarding"
        component={Link}
      >
        <HomeIcon
          style={{ marginRight: 4 }}
          width={20}
          height={20}
        />
        Главная
      </MuiLink>
      {breadcrumbs.map((item, idx) => (
        <Breadcrumb
          key={item.name}
          item={item}
          isLast={idx === breadcrumbs.length - 1}
        />
      ))}
    </Breadcrumbs>
    }
    </>
  )
}

const Breadcrumb = ({ item, isLast }: { item: Breadcrumb; isLast?: boolean }) => {
  const commonSx = { fontWeight: isLast ? 700 : 400 } as const
  const color = isLast ? 'text.primary' : 'text.secondary'

  if (item.path) {
    return (
      <MuiLink
        color={color as any}
        component={Link}
        to={item.path}
        sx={commonSx}
      >
        {item.label}
      </MuiLink>
    )
  }

  return (
    <MuiLink component="span" color={color as any} sx={commonSx}>
      {item.label}
    </MuiLink>
  )
}
