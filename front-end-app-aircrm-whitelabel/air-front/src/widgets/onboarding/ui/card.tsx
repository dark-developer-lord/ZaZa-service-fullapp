import { Box, Paper, Typography, useMediaQuery, useTheme } from "@mui/material"
import { Link } from "react-router-dom"
import LinkArrow from '@icons/arrow-link.svg?react'

interface Props {
    title: string,
    link: string
}

export const Card = ({title, link}: Props) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))

    return (
        <Paper
        sx={{
          padding: {xs: '20px 11px', mobile: '20px'},
          height: '100%',
          backgroundColor: '#F5F7FA',
          position: 'relative',
          borderRadius: '20px',
        }}
        elevation={0}
      >
        <Box
          sx={{
            width: {xs: '34px', mobile: '44px'} ,
            height: {xs: '34px', mobile: '44px'},
            borderRadius: '50%',
            bgcolor: '#9061F9',
            mb: {xs: '10px', mobile: '16px'},
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src='/icons/db.svg'
            alt=""
            width={isMobile ? 15 : 20}
            height={isMobile ? 15 : 20}
          />
        </Box>
        <Typography
          variant={isMobile ? 'xs' : 'xl'}
          component={isMobile ? 'p' : 'h4'}
        >
          {title}
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