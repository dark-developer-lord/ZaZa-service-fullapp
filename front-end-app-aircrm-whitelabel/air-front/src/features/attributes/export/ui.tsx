import { ExportDropdown } from '@shared/ui'

import { exportAttributes } from './api'

export const Ui = () => {
  return <ExportDropdown exportData={exportAttributes} />
}
