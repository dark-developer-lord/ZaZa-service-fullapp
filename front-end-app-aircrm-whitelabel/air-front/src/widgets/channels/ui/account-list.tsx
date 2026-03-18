import { useNavigate } from "react-router-dom";
import { Typography, CircularProgress, Stack, Grid, Box } from "@mui/material"
import { Board } from "@shared/ui";
import { Chat } from "@pages/chats/model/store"

import { RouterPaths } from "@shared/lib";
import { useStore as useChannelStore } from "../model/store";
import { ChannelCard } from "./channel-card";
import { AddAccountCard } from "./add-account-card";
import { useProfile } from "@shared/auth";
import axios from 'axios';
import toast from 'react-hot-toast';
import { queryClient } from '@shared/api';
import { useGetOwnerProfiles } from "../api/get-owner-profiles";
import { useMemo } from "react";

interface Props {
    data: Chat[] | undefined
    isFetching?: boolean
    error?: any
}

export const AccountList = ({data, isFetching, error}: Props) => {
    const setChannel = useChannelStore(state => state.setActiveChannel)
    const navigate = useNavigate()
    const { profile } = useProfile()
    const ownerProfilesMap = useGetOwnerProfiles()

    // Merge owner profiles with channels
    const channelsWithOwnerProfiles = useMemo(() => {
        if (!Array.isArray(data)) return []
        
        return data.map(channel => {
            // Try to match by ig_business_id first, then account_id
            const ownerProfile = ownerProfilesMap.get(channel.ig_business_id) || 
                                ownerProfilesMap.get(channel.account_id?.toString() || '')
            
            return {
                ...channel,
                owner_profile: ownerProfile
            }
        })
    }, [data, ownerProfilesMap])

    const handleDeleteChannel = async (channel: Chat) => {
        if (!profile?.id) return

        const loadingToast = toast.loading('Отключение канала...')
        const platform = channel.platform || 'instagram'
        const accountId = channel.ig_business_id || channel.account_id?.toString()

        try {
            await axios.post(`${import.meta.env.VITE_APP_API_URL}/v3/messengers/disconnect`, {
                store_id: profile.id,
                platform: platform,
                account_id: accountId
            })

            toast.dismiss(loadingToast)
            toast.success('Канал успешно отключен')

            // Invalidate queries for all platforms to refresh the list
            queryClient.invalidateQueries([`/messengers/listChats?store_id=${profile.id}&platform=instagram`])
            queryClient.invalidateQueries([`/messengers/listChats?store_id=${profile.id}&platform=whatsapp`])
            queryClient.invalidateQueries([`/messengers/listChats?store_id=${profile.id}&platform=messenger`])

        } catch (error: any) {
            console.error('Error disconnecting channel:', error)

            toast.dismiss(loadingToast)

            const errorMessage = error?.response?.data?.message || 'Ошибка при отключении канала'
            toast.error(errorMessage)
        }
    }

    const handleAddAccount = () => {
        navigate('/chats?tab=meta')
    }

    const accountLimit = 5
    const showAddCard = !isFetching && data && data.length < accountLimit

    const noAccountsMessage = error?.response?.data?.message
    const hasNoAccountsError = noAccountsMessage === "Нет подключённых аккаунтов"

    return (
        <>
            <Typography
                variant="h4"
                textAlign="left"
                mb={4}
            >
                {hasNoAccountsError ? noAccountsMessage : "Выберите аккаунт"}
            </Typography>

            {/* Show loading state while fetching accounts */}
            {isFetching && !data && (
                <Board
                    sx={{
                        mx: 'auto',
                        p: 4,
                        maxWidth: '580px',
                    }}
                >
                    <Stack alignItems="center" spacing={2}>
                        <CircularProgress />
                        <Typography variant="body2" color="text.secondary">
                            Загрузка аккаунтов...
                        </Typography>
                    </Stack>
                </Board>
            )}

            
            {(Array.isArray(data) && data.length > 0) || showAddCard ? (
                <Box sx={{ px: 2 }}>
                    <Grid container spacing={3} justifyContent="flex-start">
                        
                        {channelsWithOwnerProfiles.map((channel) => {
                            const channelId = channel.ig_business_id || channel.account_id?.toString() || ''
                            const uniqueKey = `${channel.platform || 'instagram'}-${channelId}`
                            return (
                                <Grid item key={uniqueKey}>
                                    <ChannelCard
                                        channel={channel}
                                        onClick={() => {
                                            setChannel(channel)
                                            navigate(RouterPaths.chats)
                                        }}
                                        onDelete={handleDeleteChannel}
                                    />
                                </Grid>
                            )
                        })}

                        {showAddCard && (
                            <Grid item>
                                <AddAccountCard onClick={handleAddAccount} />
                            </Grid>
                        )}
                    </Grid>
                </Box>
            ) : null}

    
            {!isFetching && Array.isArray(data) && data.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                        Нет подключенных аккаунтов
                    </Typography>
                </Box>
            )}
        </>
    )
}