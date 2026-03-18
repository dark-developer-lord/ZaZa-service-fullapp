import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { ConnectButton } from "./connect-button"
import { useGetStatus } from "../api/get-status"
import { useGetChannels } from "../api/get-channels"
import { AccountList } from "./account-list"
import { channelArr } from "./connect-button"

export const Main = () => {
    const isConnected = useGetStatus()
    const { data, isFetching, error } = useGetChannels({ enabled: isConnected })

    // Get unique connected platforms from API
    const connectedPlatforms = Array.isArray(data) ? [...new Set(data.map(c => c.platform).filter(Boolean))] : []

    // Filter platforms not yet connected
    const notConnected = channelArr.filter(c => !connectedPlatforms.includes(c.subtitle))

    return (
        <Box>
            {!isConnected && (
                <Stack alignItems="center" rowGap={3}>
                    <Typography variant="h4">Проверка подключения</Typography>
                    <CircularProgress />
                </Stack>
            )}

            
            {isConnected && !isFetching && notConnected.length > 0 && (
                <Box mb={4}>
                    <ConnectButton platforms={notConnected} />
                </Box>
            )}


            {isConnected && (
                <AccountList data={data} isFetching={isFetching} error={error} />
            )}
        </Box>
    )
}