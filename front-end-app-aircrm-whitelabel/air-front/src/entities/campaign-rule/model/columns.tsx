import { FC } from 'react'
import { GridColDef } from '@mui/x-data-grid'

import { ruleTypeLabels } from '../lib/rule-type-labels'
import { CampaignRule } from './types'

interface Props {
  Actions: FC<{ row: CampaignRule }>
  StatusToggle: FC<{ row: CampaignRule }>
}

export const columns = ({
  Actions,
  StatusToggle,
}: Props): GridColDef<CampaignRule>[] => [
  {
    field: 'id',
    headerName: 'ID',
    width: 90,
  },
  {
    field: 'rule_type',
    headerName: 'Заголовок',
    flex: 1,
    renderCell: ({ row }) => ruleTypeLabels[row.rule_type],
  },
  {
    field: 'bonus',
    headerName: 'Баллы',
    flex: 1,
    renderCell: ({ row }) => row.criteria.bonus,
  },
  {
    field: 'total_amount',
    headerName: 'Сумма заказа',
    flex: 1,
    renderCell: ({ row }) => row.criteria.total_amount ?? '',
  },
  {
    field: 'status',
    headerName: 'Статус',
    renderCell: ({ row }) => <StatusToggle row={row} />,
    flex: 1,
  },
  {
    field: 'actions',
    headerName: 'Действия',
    renderCell: ({ row }) => <Actions row={row} />,
    width: 150,
  },
]
