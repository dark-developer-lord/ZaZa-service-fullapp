import { useGetZones, ZonesTable } from '@entities/zone'
import { Board } from '@shared/ui'

export const Ui = () => {
  const { data, isFetching, error } = useGetZones()

  return (
    <Board>
      <ZonesTable
        loading={isFetching}
        rows={data || []}
        error={error}
      />
    </Board>
  )
}
