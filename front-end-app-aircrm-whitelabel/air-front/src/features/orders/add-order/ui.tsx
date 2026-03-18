import { Link } from 'react-router-dom'

import { RouterPaths } from '@shared/lib'
import { AddButton } from '@shared/ui'
import { useMediaQuery, useTheme } from '@mui/material'

export const Ui = () => {

  const theme = useTheme()
  const isDesktopOrLarger = useMediaQuery(theme.breakpoints.up(1280))
  return (
    <>
    {isDesktopOrLarger && (
        <AddButton component={Link} to={RouterPaths.posTerminal}>
          Новый заказ
        </AddButton>
      )}
    </>
  )
}
