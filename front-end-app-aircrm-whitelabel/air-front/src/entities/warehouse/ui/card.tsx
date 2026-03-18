import { Link } from 'react-router-dom'
import { Box, Paper, Typography, useTheme, alpha, useMediaQuery, Badge } from '@mui/material'

import LinkArrow from '@icons/arrow-link.svg?react'

interface Props {
  icon: string
  color: string,
  title: string
  value?: string
  link: string,
  active?: boolean
  backgroundColor?: string
  badgeCount?: number
}

export const Card = ({ link, icon, color, title, value, active, backgroundColor, badgeCount }: Props) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("mobile"))
  const showBadge = badgeCount !== undefined && badgeCount > 0
  
  return (
    <Paper
      sx={{
        padding: {xs: '20px 11px', mobile: '20px'},
        backgroundColor: active
          ? backgroundColor || alpha(color, 0.1)
          : theme.palette.common.white,
        position: 'relative',
        borderRadius: '20px',
      }}
      elevation={0}
    >
      <Badge
        badgeContent={showBadge ? badgeCount : undefined}
        color="error"
        max={99}
        sx={{
          mb: {xs: '10px', mobile: '16px'},
          '& .MuiBadge-badge': {
            right: -4,
            top: -4,
            minWidth: '18px',
            height: '18px',
            fontSize: '0.7rem',
            fontWeight: 'bold',
          }
        }}
      >
        <Box
          sx={{
            width: {xs: '34px', mobile: '44px'} ,
            height: {xs: '34px', mobile: '44px'},
            borderRadius: '50%',
            bgcolor: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={icon}
            alt=""
            width={isMobile ? 15 : 20}
            height={isMobile ? 15 : 20}
          />
        </Box>
      </Badge>
      <Typography
        variant={isMobile ? 'xs' : 'xl'}
        component={isMobile ? 'p' : 'h3'}
      >
        {title}
      </Typography>
      { value && (
        <Typography
          variant="medium"
          color={theme.palette.text.secondary}
          component="p"
        >
          {value}
        </Typography>
      )}
      <Box sx={{ position: 'absolute', top: 20, right: 20, display: { xs: 'none', mobile: 'block' } }}>
        <LinkArrow
          width={24}
          height={24}
          stroke={theme.palette.text.secondary}
        />
      </Box>
      <Link
        to={link}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          opacity: 0,
        }}
      />
    </Paper>
  )
}
