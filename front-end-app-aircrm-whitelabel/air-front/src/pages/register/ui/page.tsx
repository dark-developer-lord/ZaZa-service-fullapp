import { Box } from "@mui/material"

import { Register } from "@widgets/register"

export const Page = () => {
    return (
        <Box
        sx={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
          }}
        >
            <Register/>
        </Box>
    )
}