import { Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme } from "@mui/material"
import { GridExpandMoreIcon } from "@mui/x-data-grid"
import { useLocation } from "react-router-dom"
import { NavType } from "./nav-type"
import { Link } from "react-router-dom"

interface Props {
    open: boolean
    collapseMenu: () => void
    expanded: boolean
    // active: string | null
    menuItem: NavType
}

export const MenuItemCollapsible = ({
    menuItem,
    open,
    expanded,
    // collapseMenu,
}: Props) => {
    const theme = useTheme()
    const { pathname, search } = useLocation()

    const url = pathname + search

    return (
        <ListItem disablePadding  sx={{ display: 'block' }}>
            <ListItemButton
                component={Link}
                to={menuItem.path}
                onClick={() => {

                }}
            >
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 1 : "auto" }}>
                    {menuItem.icon && (
                        <menuItem.icon
                            stroke="#6F7073"
                            width={24}
                            height={24}
                        />
                    )}
                </ListItemIcon>
                <ListItemText 
                    primary={menuItem.label}
                        sx={{
                        '& .MuiListItemText-primary': {
                            fontSize: '13px',
                            fontWeight: 500,
                            lineHeight: 1.53
                        }
                        }}
                />
                { open && (
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        transitionDelay: '0ms',
                        // transform: active === menuItem.path ? 'rotate(270deg)' : 'rotate(90deg)',
                    }}
                >
                    <GridExpandMoreIcon />
                </ListItemIcon>
                )}
            </ListItemButton>
      <Collapse in={expanded}>
        <List>
            {menuItem.children?.map((item) => (
                <ListItem disablePadding key={item.name}>
                    <ListItemButton
                        component={Link}
                        to={item.path}
                        color="secondary"
                        sx={{
                            backgroundColor:
                                url === item.path ? theme.palette.grey[300] : 'transparent',
                            transition: 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            transitionDelay: '0ms',
                            '&:hover': {
                                bgcolor: theme.palette.grey[300],
                                transition: 'background-color 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                transitionDelay: '35ms'
                            },
                            justifyContent: open ? 'initial' : 'center'
                        }}
                        >
                        <ListItemIcon sx={{minWidth: 0, mr: open ? 1 : 'auto'}} >
                            {item.icon && (
                                <item.icon
                                stroke={theme.palette.text.primary}
                                width={20}
                                height={20}
                                />
                            )}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.label}
                            sx={{
                                '& .MuiListItemText-primary': {
                                fontSize: '13px',
                                fontWeight: 500,
                                lineHeight: 1.53
                                }
                            }}
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
      </Collapse>
    </ListItem>  
    )
}