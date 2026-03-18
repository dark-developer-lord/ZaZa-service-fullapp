import { MouseEventHandler, useState } from "react"
import {
    Box,
    IconButton,
    Menu,
    MenuItem,
    Tooltip
} from "@mui/material"

import System from "@icons/System.svg?react"
import { Link } from "react-router-dom"
import { RouterPaths } from "@shared/lib"

export const Ui = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const open = Boolean(anchorEl)
    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <Box sx={{
            ml: '16px'
        }}>
            <Tooltip title="Настройки контрагентов">
                <IconButton
                    onClick={handleClick}
                    aria-controls={open ? 'counterparty-system-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <System
                        width={20}
                        height={20}
                    />
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                id="counterparty-system-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                gridRow: '1/3',
                                width: 48,
                                height: 48,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: '50%',
                                transform: 'translateX(50%) translateY(-50%) rotate(45deg)',
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                zIndex: 0,
                            },
                        },
                    },
                }}
            >
                <MenuItem
                    component={Link}
                    to={RouterPaths.counterpartyTypes}
                >
                    Создать тип контрагента
                </MenuItem>
            </Menu>
        </Box>
    )
}

