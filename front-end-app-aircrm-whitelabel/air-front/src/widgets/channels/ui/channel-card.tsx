import { Box, Card, Typography, styled, IconButton } from '@mui/material'
import { Chat } from '@pages/chats/model/store'
import { DeleteButtonConfirmation } from '@shared/ui'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { useState } from 'react'

interface Props {
  channel: Chat
  onClick: () => void
  onDelete?: (channel: Chat) => void
}

// Styled components for the layered card effect
const CardContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '200px',
  height: '200px', // 1:1 ratio
  cursor: 'pointer',
}))

const BackgroundCard = styled(Card)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '200px', // 1:1 ratio
  height: '200px', // 1:1 ratio
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#FEFEFE',
  zIndex: 1,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}))

const GlossyCard = styled(Card)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '200px', // 1:1 ratio
  height: '200px', // 1:1 ratio
  background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)', // More transparent to show background
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.3)',
  borderRadius: theme.shape.borderRadius,
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  cursor: 'pointer',
  transformStyle: 'preserve-3d',
  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  transitionDelay: '0ms',
  transformOrigin: 'bottom right',

  '&:hover': {
    transform: 'rotateZ(15deg)',
    transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    transitionDelay: '50ms'
  }
}))

const PlatformImage = styled('img')(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  opacity: 0.7,
}))

const AvatarImage = styled('img')(() => ({
  width: 48,
  height: 48,
  borderRadius: '50%',
  objectFit: 'cover',
  marginBottom: 8,
}))

const DeleteButtonWrapper = styled(Box)(() => ({
  position: 'absolute',
  top: '8px',
  right: '8px',
  zIndex: 3,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '50%',
  padding: '4px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',

  transition: 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  transitionDelay: '0ms',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    transform: 'none',
    transition: 'background-color 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    transitionDelay: '40ms'
  }
}))

const ProfileLinkButton = styled(IconButton)(() => ({
  position: 'absolute',
  top: '8px',
  left: '8px',
  zIndex: 3,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '50%',
  padding: '6px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  width: '32px',
  height: '32px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    transform: 'scale(1.1)',
  },
  '& svg': {
    fontSize: '18px',
    color: '#005456',
  }
}))

const getPlatformImage = (platform?: string) => {
  switch (platform?.toLowerCase()) {
    case 'instagram':
      return '/icons/instagram.webp'
    case 'whatsapp':
      return '/icons/whatsapp.png'
    case 'messenger':
      return '/icons/messenger.png'
    default:
      return '/icons/instagram.webp'
  }
}

const getChannelId = (channel: Chat) => {
  return channel.account_id || channel.ig_business_id
}

export const ChannelCard = ({ channel, onClick, onDelete }: Props) => {
  const platformImageSrc = getPlatformImage(channel.platform)
  const channelId = getChannelId(channel)
  const ownerProfile = channel.owner_profile
  const [imageError, setImageError] = useState(false)

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleProfileLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (ownerProfile?.link) {
      window.open(ownerProfile.link, '_blank')
    }
  }

  return (
    <CardContainer onClick={onClick}>
      <BackgroundCard>
        <PlatformImage
          src={platformImageSrc}
          alt={`${channel.platform || 'instagram'} logo`}
        />
      </BackgroundCard>

      <GlossyCard>
        {/* Show owner profile if available */}
        {ownerProfile ? (
          <>
            <Box>
              {ownerProfile.profile_pic && !imageError && (
                <AvatarImage
                  src={ownerProfile.profile_pic}
                  alt={ownerProfile.username || ownerProfile.name || 'owner avatar'}
                  onError={() => setImageError(true)}
                />
              )}
              {ownerProfile.name && (
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="text.primary"
                  sx={{ mb: 0.5 }}
                >
                  {ownerProfile.name}
                </Typography>
              )}
              {ownerProfile.username && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: '0.875rem',
                    mb: 0.5
                  }}
                >
                  @{ownerProfile.username}
                </Typography>
              )}
            </Box>
          </>
        ) : (
          <>
            <Box>
              <Typography
                variant="h6"
                fontWeight="bold"
                color="text.primary"
                sx={{ mb: 1 }}
              >
                Канал #{channelId}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  wordBreak: 'break-all',
                  fontSize: '0.75rem'
                }}
              >
                {channel.ig_business_id}
              </Typography>
            </Box>
          </>
        )}
      </GlossyCard>

      {/* Profile link button */}
      {ownerProfile?.link && (
        <ProfileLinkButton onClick={handleProfileLinkClick}>
          <OpenInNewIcon />
        </ProfileLinkButton>
      )}

      {/* Delete button */}
      {onDelete && (
        <DeleteButtonWrapper onClick={handleDeleteClick}>
          <DeleteButtonConfirmation
            onDelete={() => onDelete(channel)}
            dialogTitle={`Удаление канала #${channelId}`}
            dialogContent={`Вы действительно хотите удалить Канал #${channelId}?`}
          />
        </DeleteButtonWrapper>
      )}
    </CardContainer>
  )
}

