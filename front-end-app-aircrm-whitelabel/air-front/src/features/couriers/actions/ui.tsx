import { useState } from 'react'
import { useMutation } from 'react-query'
import { Stack, Tooltip, IconButton, CircularProgress } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
import toast from 'react-hot-toast'

import { Courier } from '@entities/courier'
import { getApiPaths, ApiKeys, postQuery, queryClient } from '@shared/api'
import { ShowButton } from '@shared/ui'
import { useStore } from '../create-update/model/store'

import { ShowItemDetails } from '@entities/courier/ui/show-item-details'

interface Props {
  row: Courier
}

export const Ui = ({ row }: Props) => {
  const openUpdate = useStore((state) => state.openUpdate)
  const [openModal, setOpenModal] = useState(false)

  const paths = getApiPaths()

  const { mutate: toggleStatus, isLoading: isToggling } = useMutation({
    mutationKey: [ApiKeys.Couriers.statusCourier_ + row.id],
    mutationFn: postQuery((paths as any).statusCourier_
      ? (paths as any).statusCourier_ + row.id
      : `/vendor/delivery-man/status/${row.id}`),
    onSuccess: () => {
      queryClient.refetchQueries(ApiKeys.Couriers.getCouriers)
      toast.success('Статус курьера обновлён')
    },
    onError: () => {
      toast.error('Не удалось обновить статус курьера')
    },
  })

  return (
    <>
      <Stack
        direction="row"
        spacing="8px"
        alignItems="center"
        height="100%"
      >
        {/* Show details */}
        <ShowButton onClick={() => setOpenModal(true)} />

        {/* Edit courier */}
        <Tooltip title="Редактировать">
          <IconButton
            size="small"
            onClick={() => openUpdate(row)}
            sx={{ color: 'primary.main' }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Toggle active/inactive */}
        <Tooltip title={row.status ? 'Деактивировать' : 'Активировать'}>
          <span>
            <IconButton
              size="small"
              disabled={isToggling}
              onClick={() => toggleStatus(undefined as any)}
              sx={{ color: row.status ? 'success.main' : 'text.disabled' }}
            >
              {isToggling
                ? <CircularProgress size={16} />
                : <PowerSettingsNewIcon fontSize="small" />}
            </IconButton>
          </span>
        </Tooltip>
      </Stack>

      <ShowItemDetails
        open={openModal}
        onClose={() => setOpenModal(false)}
        order={row as any}
      />
    </>
  )
}
