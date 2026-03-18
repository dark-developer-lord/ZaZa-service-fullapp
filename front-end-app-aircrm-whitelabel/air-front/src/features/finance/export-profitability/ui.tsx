import { ExportDropdown } from '@shared/ui'

import { exportProductProfitability } from './api'

export const ExportProfitabilityButton = () => {
  return <ExportDropdown exportData={exportProductProfitability} />
}
