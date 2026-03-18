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
} from '@mui/material'

import { CreateCashFlowDto } from '@features/finance'
import { useGetAvailableWallets } from '@features/pos-terminal/api/get-available-wallets'

interface Props {
    control: Control<CreateCashFlowDto>
    disabled?: boolean
}

export function WalletSelect({ control, disabled = false }: Props) {
    const { data, isFetching } = useGetAvailableWallets()
    const wallets = data?.wallets || []
    const fact = data?.fact // Total fact from API response

    // Watch the transaction type to filter wallets
    const transactionType = useWatch({
        control,
        name: 'type',
    })

    // Filter wallets based on transaction type and wallet balance
    const getFilteredWallets = () => {
        let filtered = wallets.filter(wallet => wallet.is_enabled)

        // If transaction type is 'income', hide personal wallets
        if (transactionType === 'income') {
            filtered = filtered.filter(wallet => wallet.type !== 'personal')
        }

        // If transaction type is 'expense' and fact <= 0, only show personal wallets
        if (transactionType === 'expense') {
            // Check if total fact is zero or negative
            const hasZeroOrNegativeBalance = fact !== undefined && fact <= 0

            // If fact <= 0, only show personal wallets
            if (hasZeroOrNegativeBalance) {
                filtered = filtered.filter(wallet => wallet.type === 'personal')
            }
        }

        // Sort wallets: personal wallets first, then others
        filtered.sort((a, b) => {
            const aIsPersonal = a.type === 'personal'
            const bIsPersonal = b.type === 'personal'

            if (aIsPersonal && !bIsPersonal) return -1  // a comes first
            if (!aIsPersonal && bIsPersonal) return 1   // b comes first
            return 0  // keep original order
        })

        return filtered
    }

    const filteredWallets = getFilteredWallets()

    return (
        <Controller
            name="wallet_id"
            control={control}
            render={({ field, fieldState }) => (
                <FormControl fullWidth>
                    <InputLabel id="wallet-select">Кошелек</InputLabel>
                    <Select
                        label="Кошелек"
                        labelId="wallet-select"
                        size="medium"
                        error={Boolean(fieldState.error)}
                        disabled={isFetching || disabled}
                        {...field}
                        value={field.value || ''}
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

