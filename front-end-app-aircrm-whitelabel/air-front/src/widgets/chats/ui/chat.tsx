import { Avatar, Badge, Box, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material"
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import dayjs from "dayjs";
import { useState } from "react";
import { ChatType } from "@pages/chats/model/store"
import type { Chat as ChatRecord } from "@pages/chats/model/store"

import { useStore } from "../model/store";
import { useChannelStore, useGetChannels } from "@widgets/channels";
import { useUnreadCount } from "../api/use-unread-count";
import { LastSeenStorage } from "../lib/last-seen-storage";
import { queryClient } from "@shared/api";
import { useProfile } from "@shared/auth";

interface Props {
    chat: ChatType & { channelPlatform?: string; channelId?: string | number }
}

export const Chat = ({ chat }: Props) => {
    const setSender = useStore(state => state.setSender)
    const setActiveChannel = useChannelStore(state => state.setActiveChannel)
    const { data: allChannels } = useGetChannels({ enabled: true })
    const { profile, sent_at, sender_id, channelId, channelPlatform } = chat
    const [imageError, setImageError] = useState(false)
    const { profile: userProfile } = useProfile()
    
    // Get unread count for this sender
    const platform = channelPlatform || 'instagram'
    const unreadCount = useUnreadCount(sender_id, platform)

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setSender(sender_id)
        
        // Try to update last seen immediately if we have cached messages
        if (sender_id && userProfile?.id) {
            const queryKey = [`/messengers/getChatBySender/${sender_id}?store_id=${userProfile.id}&platform=${platform}`]
            const cachedData = queryClient.getQueryData<{ messages?: Array<{ id: number }> }>(queryKey)
            if (cachedData?.messages && Array.isArray(cachedData.messages) && cachedData.messages.length > 0) {
                LastSeenStorage.updateLastSeen(sender_id, cachedData.messages)
            }
        }
        
        if (channelId && allChannels && Array.isArray(allChannels)) {
            const channel = allChannels.find((ch: ChatRecord) => 
                (ch.account_id === channelId || ch.ig_business_id === channelId?.toString())
            )
            if (channel) {
                setActiveChannel(channel)
            }
        }
    }

    const handleProfileClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (profile?.link) {
            window.open(profile.link, '_blank')
        }
    }

    return (
        <ListItemButton
            sx={{
                backgroundColor: '#F5F7FA',
                mb: '6px'
            }}
            onClick={handleClick}
        >
            <ListItemAvatar>
                <Badge
                    badgeContent={unreadCount > 0 ? unreadCount : undefined}
                    color="error"
                    max={99}
                    sx={{
                        '& .MuiBadge-badge': {
                            right: 3,
                            top: 3,
                            minWidth: '18px',
                            height: '18px',
                            fontSize: '0.7rem',
                            fontWeight: 'bold'
                        }
                    }}
                >
                    <Avatar 
                        src={!imageError && profile?.profile_pic ? profile.profile_pic : undefined}
                        onError={() => setImageError(true)}
                        onClick={handleProfileClick}
                        sx={{ 
                            cursor: profile?.link ? 'pointer' : 'default',
                            '&:hover': profile?.link ? { opacity: 0.8 } : {}
                        }}
                    >
                        {(imageError || !profile?.profile_pic) && <AccountCircleOutlinedIcon />}
                    </Avatar>
                </Badge>
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Typography
                        component="span"
                        onClick={handleProfileClick}
                        sx={{
                            cursor: profile?.link ? 'pointer' : 'default',
                            color: profile?.link ? 'primary.main' : 'inherit',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': profile?.link ? { 
                                opacity: 0.8,
                                transform: 'translateX(2px)'
                            } : {}
                        }}
                    >
                        @{profile?.username || sender_id}
                    </Typography>
                }
                secondary={dayjs(sent_at).format("DD MMM YYYY, HH:mm")}
            />
        </ListItemButton>
    )
}