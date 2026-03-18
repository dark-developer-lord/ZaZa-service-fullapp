import { useMediaQuery, useTheme } from '@mui/material'
import { Box } from '@mui/material'
import { Content } from './content'
import { NavGroupType, Navigation } from './navigation'
import Navbar from './navbar'

interface Props {
  navigation: NavGroupType[]
}

export const Layout = ({ navigation }: Props) => {
  const theme = useTheme()
  // noSsr:true prevents the flash of desktop nav on first mobile render
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'), { noSsr: true })

  return (
    <Box
      display="flex"
      gap={4}
      height="100vh"
      sx={{mb:{xs: '60px', mobile: 'auto'}}}
    >
      {(!isMobile) && (
        <Navigation items={navigation} />
      )}
      <Content/>
      {isMobile && <Navbar/>}
    </Box>
  )
}
