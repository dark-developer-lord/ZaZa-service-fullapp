import { useState, useMemo } from "react"
import { Box, Divider, List, Typography } from "@mui/material"
import { Board, Search } from "@shared/ui"
import { Chat } from "./chat"
import { useChannelStore, useGetChannels } from "@widgets/channels"

export const LatestDialogues = () => {
    const platformFilter = useChannelStore(state => state.platformFilter)
    const [searchValue, setSearchValue] = useState('')
    
    // Get all channels to filter by platform
    const { data: allChannels } = useGetChannels({ enabled: true })

    const filteredContacts = useMemo(() => {
        if (!allChannels || !Array.isArray(allChannels)) return []
        
        // Filter channels by platform
        let channelsToUse: typeof allChannels = []
        
        if (platformFilter === 'all') {
            channelsToUse = allChannels
        } else if (platformFilter === 'facebook') {
            // Facebook and messenger are the same
            channelsToUse = allChannels.filter(ch => ch.platform === 'messenger' || ch.platform === 'facebook')
        } else {
            channelsToUse = allChannels.filter(ch => ch.platform === platformFilter)
        }
        
        // Combine all contacts from matching channels
        const allContacts = channelsToUse.flatMap(channel => 
            (channel.contacts || []).map(contact => ({
                ...contact,
                channelPlatform: channel.platform,
                channelId: channel.account_id || channel.ig_business_id
            }))
        )
        
        // Filter by search value
        const lowerSearch = searchValue.toLowerCase()
        return allContacts.filter(contact =>
            contact?.sender_id?.toLowerCase().includes(lowerSearch) ||
            contact?.profile?.username?.toLowerCase().includes(lowerSearch)
        )
    }, [allChannels, platformFilter, searchValue])

    return (
        <Board
            sx={{
                height: { xs: '600px', mobile: '100%' },
                maxHeight: { xs: '600px', mobile: 'calc(100vh - 200px)' },
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}
        >
            <Typography
                variant="h6"
                component="h3"
                sx={{ mb: '12px' }}
            >
                Последние диалоги
            </Typography>
            <Divider sx={{ mb: '12px' }} />
            <Search
                value={searchValue}
                onChange={setSearchValue}
            />
            <Box sx={{ mt: '10px', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <List
                    sx={{
                        flex: 1,
                        overflow: 'auto',
                        minHeight: 0
                    }}
                >
                    {filteredContacts.length > 0 ? (
                        filteredContacts.map((chat, index) => (
                            <Chat key={`${chat.sender_id}-${chat.channelId}-${index}`} chat={chat} />
                        ))
                    ) : (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ textAlign: 'center', py: 4 }}
                        >
                            {searchValue ? 'Диалоги не найдены' : 'Нет диалогов'}
                        </Typography>
                    )}
                </List>
            </Box>
        </Board>
    )
}
