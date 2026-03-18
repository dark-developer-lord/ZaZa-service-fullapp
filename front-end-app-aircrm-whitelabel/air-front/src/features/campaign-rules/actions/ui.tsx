import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { CampaignRule } from '@entities/campaign-rule'
import { Api, ApiKeys, deleteQuery, queryClient } from '@shared/api'
import { DeleteButtonConfirmation } from '@shared/ui'

interface Props {
  row: CampaignRule
}

export const Ui = ({ row }: Props) => {
  const { mutateAsync } = useMutation({
    mutationKey: [ApiKeys.Campaigns.deleteCampaignRule_ + row.id],
    mutationFn: deleteQuery(Api.deleteCampaignRule_ + row.id),
    onSuccess: () => {
      queryClient.refetchQueries(ApiKeys.Campaigns.getCampaignRules)
    },
  })
  return (
    <Stack
      direction="row"
      spacing="16px"
      alignItems="center"
      height="100%"
    >
      <DeleteButtonConfirmation
        onDelete={() => {
          toast.promise(mutateAsync(), {
            success: 'Правила акции успешна удалена',
            loading: 'Удаление правила акции',
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
