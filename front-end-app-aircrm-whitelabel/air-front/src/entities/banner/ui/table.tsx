import { FC } from 'react'

import { DataTable } from '@shared/ui'

import { columns } from '../model/columns'
import { Banner } from '../model/types'

interface Props {
  Actions: FC<{ row: Banner }>
  StatusToggle: FC<{ row: Banner }>
  rows: Banner[]
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
