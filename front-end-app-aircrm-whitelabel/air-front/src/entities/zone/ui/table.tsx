import { DataTable } from '@shared/ui'

import { columns } from '../model/columns'
import { Zone } from '../model/zone'

interface Props {
  rows: Zone[]
  loading: boolean
  error: unknown
}

export const Table = ({ rows, loading, error }: Props) => {
  return (
    <DataTable
      columns={columns()}
      rows={rows}
      loading={loading}
      error={error}
      hideFooter
    />
  )
}
