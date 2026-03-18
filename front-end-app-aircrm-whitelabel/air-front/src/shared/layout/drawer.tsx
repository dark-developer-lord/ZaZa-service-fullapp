import { Avatar, Box, Button, Divider, Drawer, IconButton, Typography } from "@mui/material"
import { useQuery, useQueryClient } from "react-query"
import { Api, ApiKeys, getQuery } from "@shared/api"
import { PermissionModules, Profile, SaasProfile, SaasTenant, VendorProfile, getLSLoginSource, getSaasTenant, getSaasTenantId, setActiveSaasTenant, useHasPermission, useProfile } from "@shared/auth"
import { RouterPaths } from "@shared/lib"
import { Board } from "@shared/ui"
import { Link, useLocation, useNavigate } from "react-router-dom"

import ClearIcon from '@mui/icons-material/Clear';
import { useEffect } from "react"

interface Props {
    open: boolean
    onClose: () => void
}

interface SaasTenantsResponse {
    tenants: SaasTenant[]
}

export const DrawerMenu = ({ open, onClose}: Props) => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const pathname = useLocation()
    const profile = useProfile((state) => state.profile) as Profile | VendorProfile | SaasProfile
    const setProfile = useProfile((state) => state.setProfile)
    const loginSource = getLSLoginSource()
    const hasPermission = useHasPermission()
    const isSaas = loginSource === 'saas'
    const currentTenant = isSaas ? getSaasTenant() : null
    const currentTenantId = isSaas ? getSaasTenantId() : null

    const { data: tenantsData, isFetching: loadingTenants } = useQuery({
      queryKey: ['saas-tenants'],
      queryFn: getQuery<SaasTenantsResponse>(Api.saasMyTenants),
      enabled: isSaas,
      staleTime: 60_000,
    })

    useEffect(() => {
        onClose()
    }, [pathname])

    if (!profile) {
        return null
    }

    const displayName = 'f_name' in profile
      ? profile.f_name
      : profile.name

    const displayPhone = 'phone' in profile ? profile.phone : null

    const avatarSrc = 'image' in profile ? profile.image || undefined : undefined

        const switchTenant = (tenant: SaasTenant) => {
            const useSession = sessionStorage.getItem('login_source') === 'saas'
            setActiveSaasTenant(tenant, useSession)
            if (isSaas && profile) {
                setProfile({ ...(profile as SaasProfile) }, 'saas')
            }
            queryClient.invalidateQueries([ApiKeys.Auth.getPermissions])
            queryClient.invalidateQueries([ApiKeys.Auth.profile])
            queryClient.invalidateQueries([ApiKeys.Common.navOrdersCount])
            queryClient.invalidateQueries(['saas-panel-config'])
            queryClient.invalidateQueries(['saas-tenants'])
            onClose()
            navigate(RouterPaths.onboarding)
        }

        const quickLinks = [
            {
                title: 'Клиенты',
                description: 'Список клиентов',
                path: RouterPaths.customers,
                permission: PermissionModules.customer,
            },
            {
                title: 'Курьеры',
                description: 'Список курьеров',
                path: RouterPaths.couriers,
                permission: PermissionModules.deliveryman,
            },
            {
                title: 'Финансы',
                description: 'Общая информация по финансам',
                path: RouterPaths.finance,
                permission: PermissionModules.finance,
            },
            {
                title: 'Склад',
                description: 'Товары',
                path: RouterPaths.warehouse,
                permission: PermissionModules.food,
            },
        ].filter((item) => hasPermission(item.permission))

    const DrawerList = (
        <Box
            role="presentation"
        >
            <IconButton
                size="small"
                onClick={onClose}
                sx={{
                    position: 'fixed',
                    right: 10,
                    top: 10
                }}
            >
                <ClearIcon />
            </IconButton>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar
                    src={avatarSrc}
                    alt="profile avatar"
                />
                <Typography>
                    {displayName}
                </Typography>
                {displayPhone && <Typography>{displayPhone}</Typography>}
            </Box>
            {/* ReDo / re-do */}
            <Board
                sx={{
                    mt: '10px',
                    padding: '20px 10px'
                }}
            >
                <Typography
                variant="h5"
                >
                    Общие
                </Typography>
                <Box
                    sx={{
                        border: '2px solid #F5F7FA',
                        borderRadius: '16px',
                        padding: '10px',
                        mb: '10px'
                    }}
                >
                    {quickLinks.map((item, index) => (
                      <Box key={item.path}>
                        <Box
                          sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '10px 0px'
                          }}
                        >
                            <Box>
                                <Typography variant="h6">
                                    {item.title}
                                </Typography>
                                <Typography
                                  component={"span"}
                                  fontSize="13px"
                                >
                                    {item.description}
                                </Typography>
                            </Box>
                            <Button
                                size="small"
                                component={Link}
                                to={item.path}
                            >
                                Открыть
                            </Button>
                        </Box>
                        {index < quickLinks.length - 1 && <Divider/>}
                      </Box>
                    ))}
                </Box>
                <Divider/>
                <Button
                    sx={{
                        mt: '10px',
                        width: '100%',
                        borderRadius: '16px',
                    }}
                    onClick={() => {
                        localStorage.setItem("hint", "show")
                        navigate(RouterPaths.onboarding)
                    }}
                >
                    Открыть подсказку
                </Button>
                {(loginSource === 'vendor' || loginSource === 'saas') && (
                  <Button
                      sx={{
                          mt: '10px',
                          width: '100%',
                          borderRadius: '16px',
                      }}
                      onClick={() => {
                          const hint = localStorage.getItem('hint')
                          localStorage.setItem('hint', hint === 'hide' ? 'show' : 'hide')
                          navigate(hint === 'hide' ? RouterPaths.onboarding : RouterPaths.posTerminal)
                      }}
                  >
                      Переключить подсказки
                  </Button>
                )}
                {(loginSource === 'vendor' || loginSource === 'vendor-employee') && (
                  <>
                    <Divider sx={{ mt: '10px' }} />
                    <Button
                        sx={{
                            mt: '10px',
                            width: '100%',
                            borderRadius: '16px',
                        }}
                        variant="outlined"
                        onClick={() => navigate(RouterPaths.panelSettings)}
                    >
                        Настройка панелей
                    </Button>
                  </>
                )}
                <Divider sx={{ mt: '10px' }} />
                <Button
                    sx={{
                        mt: '10px',
                        width: '100%',
                        borderRadius: '16px',
                    }}
                    variant="outlined"
                    onClick={() => navigate(RouterPaths.profileSettings)}
                >
                    Профиль
                </Button>
                                {isSaas && (
                                    <Box sx={{ mt: '16px' }}>
                                        <Divider sx={{ mb: '10px' }} />
                                        <Typography variant="h6">Сменить tenant</Typography>
                                        {currentTenant?.name && (
                                            <Typography fontSize="13px" color="text.secondary" sx={{ mb: '8px' }}>
                                                Активный: {currentTenant.name}
                                            </Typography>
                                        )}
                                        {loadingTenants && (
                                            <Typography fontSize="13px" color="text.secondary">
                                                Загрузка tenants...
                                            </Typography>
                                        )}
                                        <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {tenantsData?.tenants?.map((tenant) => (
                                                <Button
                                                    key={tenant.id}
                                                    size="small"
                                                    variant={tenant.id === currentTenantId ? 'contained' : 'outlined'}
                                                    disabled={tenant.id === currentTenantId}
                                                    onClick={() => switchTenant(tenant)}
                                                >
                                                    {tenant.name}
                                                </Button>
                                            ))}
                                        </Box>
                                    </Box>
                                )}
            </Board>
        </Box>
    )

    return (
            <Drawer
                open={open}
                onClose={onClose}
                sx={{
                    '& .MuiDrawer-paper': {
                        minWidth: 0,
                        width: '100%',
                        padding: '30px 10px',
                        bgcolor: '#F5F7FA'
                    }
                }}
            >
                {DrawerList}
            </Drawer>
    )

}
