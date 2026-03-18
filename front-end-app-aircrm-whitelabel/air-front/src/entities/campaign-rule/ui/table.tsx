import { FC } from 'react'

import { DataTable } from '@shared/ui'

import { columns } from '../model/columns'
import { CampaignRule } from '../model/types'

interface Props {
  Actions: FC<{ row: CampaignRule }>
  StatusToggle: FC<{ row: CampaignRule }>
  rows: CampaignRule[]
  loading: boolean
  error: unknown
}

export const Table = ({
  rows,
  loading,
  error,
  Actions,
  StatusToggle,
}: Props) => {
  return (
    <DataTable
      columns={columns({ Actions, StatusToggle })}
      rows={rows}
      loading={loading}
      error={error}
      hideFooter
    />
  )
}
