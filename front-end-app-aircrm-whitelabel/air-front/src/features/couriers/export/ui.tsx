import { ExportDropdown } from '@shared/ui'

import { exportCouriers } from './api'

export const Ui = () => {
  return <ExportDropdown exportData={exportCouriers} />
}
