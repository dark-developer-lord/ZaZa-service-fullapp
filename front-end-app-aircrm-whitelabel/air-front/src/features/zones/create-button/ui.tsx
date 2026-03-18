import { Link } from 'react-router-dom'

import { RouterPaths } from '@shared/lib'
import { AddButton } from '@shared/ui'

export const Ui = () => {
  return (
    <AddButton
      component={Link}
      to={RouterPaths.createZone}
    >
      Новая зона
    </AddButton>
  )
}
