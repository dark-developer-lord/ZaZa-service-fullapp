import { Link } from 'react-router-dom'
import { Box, Paper, Typography, useTheme } from '@mui/material'

import LinkArrow from '@icons/arrow-link.svg?react'

interface Props {
  icon: string
  color: string
  title: string
  value: string
  link: string
}

export const Card = ({ link, color, icon, title, value }: Props) => {
  const theme = useTheme()

  return (
    <Paper
      sx={{
        padding: '20px',
        bgcolor: theme.palette.grey[100],
        position: 'relative',
        borderRadius: '20px',
      }}
      elevation={0}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          bgcolor: color,
          mb: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={icon}
          alt=""
          width={20}
          height={20}
        />
      </Box>
      <Typography
        variant="xl"
        component="h3"
      >
        {title}
      </Typography>
      <Typography
        variant="medium"
        color={theme.palette.text.secondary}
        component="p"
      >
        {value}
      </Typography>
      <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
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
