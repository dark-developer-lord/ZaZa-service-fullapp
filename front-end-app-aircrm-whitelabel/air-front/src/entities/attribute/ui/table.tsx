import { FC } from 'react'

import { DataTable } from '@shared/ui'

import { columns } from '../model/columns'
import { Attribute } from '../model/types'

import { useGetLoginSource } from '@shared/auth'

interface Props {
  Actions: FC<{ row: Attribute }>
  rows: Attribute[]
  loading: boolean
  error: unknown
}

export const Table = ({ rows, loading, error, Actions }: Props) => {
  const loginSource = useGetLoginSource()
  return (
    <DataTable
      columns={columns(Actions, loginSource)}
      rows={rows}
      loading={loading}
      error={error}
      hideFooter
    />
  )
}
