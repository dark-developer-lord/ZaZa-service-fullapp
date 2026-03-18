import { Box, Card, Typography, styled, keyframes } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useProfile } from '@shared/auth'
import axios from 'axios'

interface Props {
  onClick: () => void
}

const liquidGradient = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const StyledAddCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  width: '200px',
  height: '200px', // 1:1 ratio same as other cards
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  
  background: `linear-gradient(-45deg, 
    #E4405F,  /* Instagram pink */
    #F56040,  /* Instagram orange */
    #FCAF45,  /* Instagram yellow */
    #25D366,  /* WhatsApp green */
    #128C7E,  /* WhatsApp dark green */
    #E4405F   /* Back to Instagram pink */
  )`,
  backgroundSize: '400% 400%',
  animation: `${liquidGradient} 8s ease infinite`,
  
  boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  transitionDelay: '0ms',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
    transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    transitionDelay: '60ms'
  }
}))

const ContentOverlay = styled(Box)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(1px)',
  padding: '16px',
}))

const StyledAddIcon = styled(AddIcon)(() => ({
  fontSize: '48px',
  color: 'white',
  marginBottom: '12px',
  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
}))

const AddText = styled(Typography)(() => ({
  color: 'white',
  fontWeight: 'bold',
  textAlign: 'center',
  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  fontSize: '0.875rem',
  lineHeight: 1.2,
}))

export const AddAccountCard = ({ onClick }: Props) => {
  const { profile } = useProfile()

  const handleClick = async () => {
    if (!profile?.id) return

    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/v3/messengers/connect?store_id=${profile.id}&platform=instagram`)

      const { auth_url } = response.data

      if (auth_url) {
        window.open(auth_url, '_blank')
      } else {
        console.error('auth_url not found in response:', response.data)
      }

      onClick()
    } catch (error) {
      console.error('Error fetching Instagram connect URL:', error)
    }
  }

  return (
    <StyledAddCard onClick={handleClick}>
      <ContentOverlay>
        <StyledAddIcon />
        <AddText>
          Подключите Инстаграм
          <br />
          & WhatsApp
        </AddText>
      </ContentOverlay>
    </StyledAddCard>
  )
}
