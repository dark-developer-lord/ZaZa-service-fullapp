import { Link } from 'react-router-dom'

import { RouterPaths } from '@shared/lib'
import { AddButton } from '@shared/ui'

export const  Ui = () => {
  return (
    <AddButton
      sx={{ ml: 'auto' }}
      component={Link}
      to={RouterPaths.createProduct}
    >
      Новый продукт
    </AddButton>
  )
}
