import { ExportDropdown } from '@shared/ui'

import { exportCustomers } from './api'

export const Ui = () => {
  return <ExportDropdown exportData={exportCustomers} />
}
