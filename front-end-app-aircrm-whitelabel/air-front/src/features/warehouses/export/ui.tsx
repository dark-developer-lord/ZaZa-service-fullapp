import { ExportDropdown } from '@shared/ui'

import { exportWarehouses } from './api'

export const Ui = () => {
  return <ExportDropdown exportData={exportWarehouses} />
}
