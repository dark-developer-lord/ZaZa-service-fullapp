import {
    Control,
    Controller,
    useWatch,
} from 'react-hook-form'

import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    CircularProgress,
    Box,
    Chip,
} from '@mui/material'

import { CreateCashFlowDto } from '@features/finance'
import { useGetAvailableWallets } from '@features/pos-terminal/api/get-available-wallets'

interface Props {
    control: Control<CreateCashFlowDto>
    disabled?: boolean
}

export function WalletMultiSelect({ control, disabled = false }: Props) {
    const { data, isFetching } = useGetAvailableWallets()
    const wallets = data?.wallets || []
    const fact = data?.fact

    // Watch the transaction type to filter wallets
    const transactionType = useWatch({
        control,
        name: 'type',
    })

    // Watch selected wallet IDs
    const selectedWalletIds = useWatch({
        control,
        name: 'wallet_ids',
    }) || []

    // Filter wallets based on transaction type and wallet balance
    const getFilteredWallets = () => {
        let filtered = wallets.filter(wallet => wallet.is_enabled)

        // If transaction type is 'income', hide personal wallets
        if (transactionType === 'income') {
            filtered = filtered.filter(wallet => wallet.type !== 'personal')
        }

        // If transaction type is 'expense' and fact <= 0, only show personal wallets
        if (transactionType === 'expense') {
            const hasZeroOrNegativeBalance = fact !== undefined && fact <= 0
            if (hasZeroOrNegativeBalance) {
                filtered = filtered.filter(wallet => wallet.type === 'personal')
            }
        }

        // Sort wallets: personal wallets first, then others
        filtered.sort((a, b) => {
            const aIsPersonal = a.type === 'personal'
            const bIsPersonal = b.type === 'personal'
            if (aIsPersonal && !bIsPersonal) return -1
            if (!aIsPersonal && bIsPersonal) return 1
            return 0
        })

        return filtered
    }

    const filteredWallets = getFilteredWallets()

    return (
        <Controller
            name="wallet_ids"
            control={control}
            render={({ field, fieldState }) => (
                <FormControl fullWidth>
                    <InputLabel id="wallet-multi-select">Кошелек</InputLabel>
                    <Select
                        label="Кошелек"
                        labelId="wallet-multi-select"
                        size="medium"
                        error={Boolean(fieldState.error)}
                        disabled={isFetching || disabled}
                        multiple
                        {...field}
                        value={field.value || []}
                        renderValue={(selected) => {
                            const selectedWallets = filteredWallets.filter(wallet =>
                                (selected as number[]).includes(wallet.wallet_id)
                            )
                            return (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selectedWallets.map((wallet) => (
                                        <Chip
                                            key={wallet.wallet_id}
                                            label={wallet.name}
                                            onMouseDown={(event) => {
                                                event.stopPropagation()
                                            }}
                                            onDelete={() => {
                                                const newSelected = (selected as number[]).filter(
                                                    (id) => id !== wallet.wallet_id
                                                )
                                                field.onChange(newSelected)
                                            }}
                                        />
                                    ))}
                                </Box>
                            )
                        }}
                    >
                        {isFetching ? (
                            <MenuItem disabled>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <CircularProgress size={20} />
                                    Загрузка...
                                </Box>
                            </MenuItem>
                        ) : filteredWallets.length === 0 ? (
                            <MenuItem disabled>Нет доступных кошельков</MenuItem>
                        ) : (
                            filteredWallets.map((wallet) => (
                                <MenuItem
                                    key={wallet.wallet_id}
                                    value={wallet.wallet_id}
                                >
                                    {wallet.name}
                                </MenuItem>
                            ))
                        )}
                    </Select>
                    <FormHelperText error>{fieldState.error?.message}</FormHelperText>
                </FormControl>
            )}
        />
    )
}
