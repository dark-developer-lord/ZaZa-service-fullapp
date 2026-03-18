import { Grid, useMediaQuery, useTheme } from "@mui/material"
import { LatestDialogues } from "./latest-dialogues"
import { Dialogue } from "./dialogue"
import { useState } from "react"

export const Main = () => {
    const [close, _] = useState(true)

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))

    return (
        <Grid 
            container 
            spacing={3}
            sx={{
                height: { xs: 'auto', mobile: 'calc(100vh - 200px)' },
                maxHeight: { xs: 'none', mobile: 'calc(100vh - 200px)' },
                overflow: 'hidden'
            }}
        >
             {/* {
                (isMobile && !close) ?
                null :
                ( */}
                    <Grid xs={12} mobile={4} item sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                        <LatestDialogues />
                    </Grid>
                {/* )
            }
            {
                (isMobile && close) ?
                null :
                ( */}
                    <Grid xs={12} mobile={8} item sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                        <Dialogue />
                    </Grid>
                {/* )
            } */}
        </Grid>
    )
}