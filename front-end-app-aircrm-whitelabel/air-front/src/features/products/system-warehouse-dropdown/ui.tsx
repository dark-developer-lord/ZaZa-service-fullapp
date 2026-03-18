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

export const Ui = () =>{
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const open = Boolean(anchorEl)
    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
        setAnchorEl(event.currentTarget)
      }

    const handleClose = () => {
        setAnchorEl(null)
    }

    return(
    <Box sx={{
        ml: '16px'
    }}>
        <Tooltip title="Категории & Подкатегории">
            <IconButton
              onClick={handleClick}
              aria-controls={open ? 'system-menu' : undefined}
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
        id="system-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
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
                  right: { xs: 68, mobile: 112 },
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            },
          }}
        >
            <MenuItem
              component={Link}
              to={RouterPaths.categories}
            >
                  Категории
            </MenuItem>
            <MenuItem
              component={Link}
              to={RouterPaths.subCategories}
            >
                  Подкатегории
            </MenuItem>
            <MenuItem
              component={Link}
              to={RouterPaths.attributes}
            >
                  Атрибуты
            </MenuItem>
            <MenuItem
              component={Link}
              to={RouterPaths.warehouses}
            >
                  Склады
            </MenuItem>
        </Menu>
    </Box>
)
}