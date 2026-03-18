import { LayoutContent } from "@widgets/layout"
import { Channels } from "@widgets/channels"

export const Page = () => {
    return(
        <LayoutContent
            title="Каналы"
            breadcrumbs={[
                {
                    label: 'Каналы',
                    name: 'channels',
                },
            ]}
        >
            <Channels/>
        </LayoutContent>
    )
}