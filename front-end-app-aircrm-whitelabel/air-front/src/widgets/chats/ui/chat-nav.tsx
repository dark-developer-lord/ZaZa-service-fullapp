import { Avatar, List, ListItem, ListItemAvatar, ListItemButton, Typography } from "@mui/material"
import { useChannelStore } from "@widgets/channels"

const chatNav = [
    {
        label: 'Все',
        path: 'all' as const
    },
    {
        img: '/icons/instagram.webp',
        label: 'Instagram',
        path: 'instagram' as const,
    },
    {
        img: '/icons/whatsapp.png',
        label: 'WhatsApp',
        path: 'whatsapp' as const,
    },
    {
        img: '/icons/facebook.png',
        label: 'Facebook',
        path: 'facebook' as const,
    }
]

export const ChatNav = () => {
    const platformFilter = useChannelStore(state => state.platformFilter)
    const setPlatformFilter = useChannelStore(state => state.setPlatformFilter)

    const handleFilterClick = (path: 'all' | 'instagram' | 'whatsapp' | 'facebook') => {
        setPlatformFilter(path)
    }

    return (
        <List
            disablePadding
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                border: '1px solid #FFFFFF',
                borderRadius: '10px',
                bgcolor: '#FFFFFF',
                mr: '10px',
                margin: 'auto',
                mb: {xs: '10px', mobile: 0}
            }}
            >
                {
                    chatNav?.map((child)=> {
                        const isActive = platformFilter === child.path
                        return (
                            <ListItem
                                key={child.path}
                                disablePadding
                                sx={{
                                    width: 'auto',
                                    padding: '1px',
                                }}
                            >
                                <ListItemButton
                                    onClick={() => handleFilterClick(child.path)}
                                    sx={{
                                        bgcolor: isActive ? 'rgba(0, 84, 86, 0.1)' : 'transparent',
                                        borderRadius: '8px',
                                        '&:hover': {
                                            bgcolor: isActive ? 'rgba(0, 84, 86, 0.15)' : 'rgba(0, 0, 0, 0.04)',
                                        }
                                    }}
                                >
                                    {
                                        child.img ?
                                            <ListItemAvatar
                                                sx={{
                                                    minWidth: 0,
                                                    mr: '1px'
                                                }}
                                            >
                                                    <Avatar
                                                        sx={{
                                                            width: '25px',
                                                            height: '25px',
                                                        }}
                                                        src={child.img}
                                                        alt="?"
                                                    />
                                            </ListItemAvatar>
                                        : undefined
                                    }
                                        <Typography
                                            title={child.label}
                                            sx={{
                                                fontSize: {xs: '9px', mobile: '13px'},
                                                fontWeight: isActive ? 600 : 400,
                                                color: isActive ? '#005456' : 'inherit'
                                            }}
                                        >
                                            {child.label}
                                        </Typography>
                                </ListItemButton>
                            </ListItem>
                        )
                    })
                }
       </List>
    )
}