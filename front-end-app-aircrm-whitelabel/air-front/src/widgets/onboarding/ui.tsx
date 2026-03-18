import { Box, Button, Grid, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import toast from "react-hot-toast"
import { Api, ApiKeys, getQuery, postQuery } from "@shared/api"
import { getLSLoginSource, getSaasTenant, setActiveSaasTenant } from "@shared/auth"
import { RouterPaths } from "@shared/lib"
import { Board } from "@shared/ui"
import { useNavigate } from "react-router-dom"
import { Card } from "./ui/card"

const rout = [
    {
        title: '1.Создание склада',
        link: RouterPaths.warehouses
    },
    {
        title: '2.Настройка категорий',
        link: RouterPaths.categories
    },
    {
        title: '3.Настройка подкатегорий',
        link: RouterPaths.subCategories
    },
    {
        title: '4.Добавление товаров',
        link: RouterPaths.createProduct
    },
    {
        title: '5.Оформите свою первую продажу',
        link: RouterPaths.posTerminal
    }
]

interface SaasModule {
    code: string
    name: string
    group: string
    enabled: boolean
}

interface SaasPanelConfigResponse {
    tenant: {
        id: number
        name: string
        sector_type: string
        panel_preset: string
        modules: SaasModule[]
    }
}

interface SectorUpdateDto {
    tenant_id: number
    sector_type: 'goods' | 'services' | 'hybrid'
    panel_preset: 'goods' | 'services' | 'hybrid'
}

interface ModulesUpdateDto {
    tenant_id: number
    modules: string[]
}

interface TenantUpdateResponse {
    message: string
    tenant: {
        id: number
        name: string
        slug?: string
        sector_type: 'goods' | 'services' | 'hybrid'
        panel_preset: 'goods' | 'services' | 'hybrid'
        timezone?: string
        currency?: string
        is_active?: boolean
        modules: SaasModule[]
    }
}

export const Ui = () => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const loginSource = getLSLoginSource()
    const isSaas = loginSource === 'saas'
    const currentTenant = getSaasTenant()
    const [selectedSector, setSelectedSector] = useState<'goods' | 'services' | 'hybrid'>('goods')
    const [selectedModules, setSelectedModules] = useState<string[]>([])

    const { data: panelConfig, refetch: refetchPanelConfig } = useQuery({
        queryKey: ['saas-panel-config', currentTenant?.id],
        queryFn: getQuery<SaasPanelConfigResponse>(Api.saasPanelConfig),
        enabled: isSaas,
        staleTime: 60_000,
    })

    const tenant = panelConfig?.tenant

    useEffect(() => {
        if (tenant) {
            setSelectedSector((tenant.sector_type as 'goods' | 'services' | 'hybrid') ?? 'goods')
            setSelectedModules(tenant.modules.filter((item) => item.enabled).map((item) => item.code))
        }
    }, [tenant?.id, tenant?.sector_type, tenant?.modules])

    const modulesByGroup = useMemo(() => {
        if (!tenant) {
            return {}
        }

        return tenant.modules.reduce((acc, item) => {
            const key = item.group || 'other'
            if (!acc[key]) {
                acc[key] = []
            }
            acc[key].push(item)
            return acc
        }, {} as Record<string, SaasModule[]>)
    }, [tenant])

    const applyTenantUpdate = async (updatedTenant: TenantUpdateResponse['tenant']) => {
        const useSession = sessionStorage.getItem('login_source') === 'saas'
        setActiveSaasTenant(updatedTenant as any, useSession)
        await Promise.all([
            queryClient.invalidateQueries([ApiKeys.Auth.getPermissions]),
            queryClient.invalidateQueries([ApiKeys.Common.navOrdersCount]),
            queryClient.invalidateQueries(['saas-panel-config']),
            queryClient.invalidateQueries(['saas-tenants']),
        ])
    }

    const sectorMutation = useMutation({
        mutationFn: postQuery<SectorUpdateDto, TenantUpdateResponse>(Api.saasSelectSector),
        onSuccess: async (response) => {
            await applyTenantUpdate(response.tenant)
            setSelectedSector(response.tenant.sector_type)
            setSelectedModules(response.tenant.modules.filter((item) => item.enabled).map((item) => item.code))
            toast.success('Сектор обновлён')
        },
        onError: () => {
            toast.error('Не удалось обновить сектор')
        },
    })

    const modulesMutation = useMutation({
        mutationFn: postQuery<ModulesUpdateDto, TenantUpdateResponse>(Api.saasSelectModules),
        onSuccess: async (response) => {
            await applyTenantUpdate(response.tenant)
            toast.success('Модули обновлены')
        },
        onError: () => {
            toast.error('Не удалось обновить модули')
        },
    })

    const saveSector = () => {
        if (!tenant) {
            return
        }

        sectorMutation.mutate({
            tenant_id: tenant.id,
            sector_type: selectedSector,
            panel_preset: selectedSector,
        })
    }

    const toggleModule = (code: string) => {
        setSelectedModules((prev) =>
            prev.includes(code) ? prev.filter((item) => item !== code) : [...prev, code],
        )
    }

    const saveModules = () => {
        if (!tenant || selectedModules.length === 0) {
            toast.error('Выберите хотя бы один модуль')
            return
        }

        modulesMutation.mutate({
            tenant_id: tenant.id,
            modules: selectedModules,
        })
    }

    return(
    <Box>
        <Board
        sx={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', mb: '20px'}}
        >
            <Box>
            <Typography
            variant={isMobile ? "h5" : 'h4'}
            >
                Давайте начнем работу!
            </Typography>
            <Typography
            fontSize={isMobile ? "17px" : "20px"}
            >
                Для начала вам необходимо сделать следующие шаги, не бойтесь мы вам подскажем
            </Typography>
            <br />
            </Box>
            <Button
                color="secondary"
                size={isMobile ? "small" : "medium"}
                onClick={() => {
                    localStorage.setItem("hint", "hide")
                    navigate(RouterPaths.posTerminal)
                }}
            >
                Отключить подсказки
            </Button>
        </Board>
        <Board>
            <Grid
                container
                spacing={1}
            >
                {rout.map(( {title, link} ) => (
                <Grid
                key={title}
                item
                xs={6}
                mobile={4}
                >
                    <Card
                    title={title}
                    link={link}
                    />
                </Grid>
            ))}
            </Grid>
        </Board>
        {isSaas && tenant && (
            <Board sx={{ mt: '20px' }}>
                <Typography variant={isMobile ? "h6" : "h5"}>
                    SaaS конфигурация панели
                </Typography>
                <Typography sx={{ mt: '4px' }} color="text.secondary">
                    Tenant: {tenant.name} • Сектор: {tenant.sector_type}
                </Typography>
                <Box sx={{ display: 'flex', gap: '8px', mt: '16px', flexWrap: 'wrap' }}>
                    {(['goods', 'services', 'hybrid'] as const).map((option) => (
                        <Button
                            key={option}
                            size="small"
                            variant={selectedSector === option ? 'contained' : 'outlined'}
                            onClick={() => setSelectedSector(option)}
                        >
                            {option}
                        </Button>
                    ))}
                    <Button
                        size="small"
                        color="secondary"
                        onClick={saveSector}
                        disabled={sectorMutation.isLoading}
                    >
                        Сохранить сектор
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', mt: '16px' }}>
                    {tenant.modules.filter((item) => item.enabled).map((item) => (
                        <Box
                            key={item.code}
                            sx={{
                                px: '10px',
                                py: '6px',
                                borderRadius: '12px',
                                bgcolor: 'grey.100',
                                fontSize: '13px',
                            }}
                        >
                            {item.name}
                        </Box>
                    ))}
                </Box>
                <Box sx={{ mt: '20px' }}>
                    {Object.entries(modulesByGroup).map(([groupName, groupModules]) => (
                        <Box key={groupName} sx={{ mb: '12px' }}>
                            <Typography sx={{ mb: '6px', textTransform: 'capitalize' }} color="text.secondary">
                                {groupName}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {groupModules.map((item) => {
                                    const checked = selectedModules.includes(item.code)
                                    return (
                                        <Button
                                            key={item.code}
                                            size="small"
                                            variant={checked ? 'contained' : 'outlined'}
                                            onClick={() => toggleModule(item.code)}
                                        >
                                            {item.name}
                                        </Button>
                                    )
                                })}
                            </Box>
                        </Box>
                    ))}
                    <Box sx={{ display: 'flex', gap: '8px' }}>
                        <Button
                            size="small"
                            color="secondary"
                            onClick={saveModules}
                            disabled={modulesMutation.isLoading}
                        >
                            Сохранить модули
                        </Button>
                        <Button
                            size="small"
                            variant="text"
                            onClick={() => refetchPanelConfig()}
                        >
                            Обновить
                        </Button>
                    </Box>
                </Box>
            </Board>
        )}
    </Box>)
}