import { Box } from "@mui/material"

import { EmployeeLogin } from "@widgets/employee-login"

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
            <EmployeeLogin/>
        </Box>
    )
}
