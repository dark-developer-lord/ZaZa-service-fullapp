import { Box } from "@mui/material"

import { DeliveryManLogin } from "@widgets/delivery-man-login"

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
            <DeliveryManLogin/>
        </Box>
    )
}