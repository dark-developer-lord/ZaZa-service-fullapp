import { useState } from "react";
import { Box, BottomNavigation, BottomNavigationAction } from "@mui/material"
import { useLocation, Link } from 'react-router-dom';
import { DrawerMenu } from "./drawer";
import { PermissionModules, useHasPermission } from "@shared/auth";

const List = [
    {
        icon: '/icons/main-page-default.svg',
        activeIcon: '/icons/main-page-active.svg',
        name: 'Главная',
        href: '/onboarding'
    },
    {
        icon: '/icons/orders-default.svg',
        activeIcon: '/icons/orders-active.svg',
        name: 'Заказы',
        href: '/orders',
        permission: PermissionModules.order,
    },
    {
        icon: '/icons/new-order-default.svg',
        activeIcon: '/icons/new-order-active.svg',
        name: 'Новый заказ',
        href: '/pos-terminal',
        permission: PermissionModules.posTerminal,
    },
    {
        icon: '/icons/clients-default.svg',
        activeIcon: '/icons/clients-active.svg',
        name: 'Клиенты',
        href: '/customers',
        permission: PermissionModules.customer,
    },
    {
        icon: '/icons/menu.svg',
        activeIcon: '/icons/menu.svg',
        name: 'Меню',
        href: '/customers'
    },
]

function Navbar(){
    const location = useLocation()
    const [open, setOpen] = useState(false)
        const hasPermission = useHasPermission()

        const visibleItems = List.slice(0, 4).filter((item) => {
            if (!('permission' in item) || !item.permission) {
                return true
            }

            return hasPermission(item.permission)
        })

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
      };

    return (
        <Box
            sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 20,
            bgcolor: 'background.paper',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            overflow: 'hidden'
        }}
        >
            <BottomNavigation
                sx={{height: 55}}
                showLabels
            >
            {visibleItems.map(({ icon, activeIcon, name, href }) => {
                const isActive = location.pathname == href;
                return (
                    <BottomNavigationAction
                        sx={{
                            ".MuiBottomNavigationAction-label": {
                                fontSize: '11px',
                                textAlign: 'center',

                            },
                        padding: '0px 6px'
                        }}
                        key={name}
                        label={name}
                        icon={
                            <img
                                src={isActive ? activeIcon : icon}
                                alt={name}
                                width={30}
                                height={30}
                            />
                        }
                        component={Link}
                        to={href}
                    />
                )
            })}
            <BottomNavigationAction
                onClick={toggleDrawer(true)}
                label="Меню"
                icon={
                    <img
                    src="/icons/menu.svg"
                    alt=""
                    width={30}
                    height={30}
                    />
                }
            />
            </BottomNavigation>
            <DrawerMenu open={open} onClose={() => setOpen(false)}/>
        </Box>
    )
}
export default Navbar