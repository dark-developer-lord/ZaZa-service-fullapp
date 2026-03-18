import { GridColDef } from '@mui/x-data-grid'

import { Zone } from './zone'

export const columns = (): GridColDef<Zone>[] => [
  {
    field: 'id',
    headerName: 'ID',
    width: 90,
  },
  {
    field: 'name',
    headerName: 'Название',
    flex: 1,
  },
]
