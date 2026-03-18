import { Box, Paper, Typography, useTheme, alpha } from '@mui/material'

interface Props {
  icon: string
  color: string
  title: string
  active: boolean
  onClick: () => void
}

export const Card = ({ icon, color, title, active, onClick }: Props) => {
  const theme = useTheme()

  return (
    <Paper
      onClick={onClick}
      sx={{
        padding: '20px',
        backgroundColor: active ? alpha(color, 0.1) : theme.palette.common.white,
        position: 'relative',
        borderRadius: '20px',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        height: '140px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        justifyContent: 'center',
        // '&:hover': {
        //   transform: 'translateY(-2px)',
        //   boxShadow: "0px 5px 10px 2px rgba(0, 0, 0, 0.2)",
        // },
      }}
      elevation={0}
    >
      <Box
        sx={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          bgcolor: color,
          mb: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
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
        variant="medium"
        component="h3"
        sx={{
          textAlign: 'left',
          lineHeight: 1.3,
          fontWeight: 600,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'left',
          px: 1,
        }}
      >
        {title}
      </Typography>
    </Paper>
  )
}
