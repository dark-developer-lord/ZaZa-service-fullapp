import { ExportDropdown } from '@shared/ui'

import { exportAddOns } from './api'

export const Ui = () => {
  return <ExportDropdown exportData={exportAddOns} />
}
