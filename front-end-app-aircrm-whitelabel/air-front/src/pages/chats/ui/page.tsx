import { SyntheticEvent } from "react"
import { useSearchParams } from "react-router-dom"
import { LayoutContent } from "@widgets/layout"
import { ChatNav, Chats } from "@widgets/chats"
import { Channels } from "@widgets/channels"
import { AddChannelButton } from "@features/chats/add-channel"
import { Page as MetaSettingsContent } from "@pages/meta-settings/ui/page"
import { useMediaQuery, useTheme, Tabs, Tab, Box } from "@mui/material"

type TabKey = 'chats' | 'channels' | 'meta'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'chats',    label: 'Чаты' },
  { key: 'channels', label: 'Каналы' },
  { key: 'meta',     label: 'Meta настройки' },
]

export const Page = () => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))
    const [params, setParams] = useSearchParams()

    const activeTab: TabKey = (params.get('tab') as TabKey) ?? 'chats'

    const handleTab = (_: SyntheticEvent, value: TabKey) => {
        setParams({ tab: value })
    }

    const tabBar = (
        <Tabs
            value={activeTab}
            onChange={handleTab}
            textColor="inherit"
            sx={{
                minHeight: 36,
                '& .MuiTab-root': { minHeight: 36, textTransform: 'none', fontWeight: 600, fontSize: 14 },
            }}
        >
            {TABS.map(({ key, label }) => (
                <Tab key={key} value={key} label={label} />
            ))}
        </Tabs>
    )

    const rightSlot = activeTab === 'chats' ? (
        <>{!isMobile && <ChatNav />}<AddChannelButton /></>
    ) : null

    return (
        <LayoutContent
            title="Мессенджеры"
            breadcrumbs={[{ label: 'Мессенджеры', name: 'chats' }]}
            rightSlot={rightSlot}
        >
            {activeTab === 'chats' && isMobile && <ChatNav />}

            {tabBar}

            <Box sx={{ mt: 2 }}>
                {activeTab === 'chats'    && <Chats />}
                {activeTab === 'channels' && <Channels />}
                {activeTab === 'meta'     && <MetaSettingsContent />}
            </Box>
        </LayoutContent>
    )
}
