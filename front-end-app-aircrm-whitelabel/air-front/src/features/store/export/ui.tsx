import { ExportDropdown } from '@shared/ui'

import { exportRestaurants } from './api'

export const Ui = () => {
  return <ExportDropdown exportData={exportRestaurants} />
}
