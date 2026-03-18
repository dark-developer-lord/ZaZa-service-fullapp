import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { Campaign } from '@entities/campaign'
import { Api, ApiKeys, deleteQuery, queryClient } from '@shared/api'
import { DeleteButtonConfirmation, EditButton } from '@shared/ui'

import { useStore } from '../create-update/model/store'

interface Props {
  row: Campaign
}

export const Ui = ({ row }: Props) => {
  const openUpdate = useStore((state) => state.openUpdate)
  const { mutateAsync } = useMutation({
    mutationKey: [ApiKeys.Campaigns.deleteCampaign_ + row.id],
    mutationFn: deleteQuery(Api.deleteCampaign_ + row.id),
    onSuccess: () => {
      queryClient.refetchQueries(ApiKeys.Campaigns.getCampaigns)
    },
  })
  return (
    <Stack
      direction="row"
      spacing="16px"
      alignItems="center"
      height="100%"
    >
      <EditButton onClick={() => openUpdate(row)} />
      <DeleteButtonConfirmation
        onDelete={() => {
          toast.promise(mutateAsync(), {
            success: 'Акция успешна удалена',
            loading: 'Удаление Акции',
            error: (error) => {
              if (error instanceof AxiosError) {
                return error.response?.data.message || 'Ошибка при удалении'
              }
              return 'Ошибка при удалении'
            },
          })
        }}
      />
    </Stack>
  )
}
