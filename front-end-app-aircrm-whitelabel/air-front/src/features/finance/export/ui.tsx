import { ExportDropdown } from '@shared/ui'

import { exportFinanceAnalytic } from './api'

export const Ui = () => {
  return <ExportDropdown exportData={exportFinanceAnalytic} />
}
