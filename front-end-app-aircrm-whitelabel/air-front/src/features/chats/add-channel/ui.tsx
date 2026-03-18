import { RouterPaths } from "@shared/lib"
import { AddButton } from "@shared/ui"
import { Link } from "react-router-dom"


export const Ui = () => {
    return (
    <AddButton
      component={Link}
      to={RouterPaths.channels}
    >
        Добавить канал
    </AddButton>
  )
}