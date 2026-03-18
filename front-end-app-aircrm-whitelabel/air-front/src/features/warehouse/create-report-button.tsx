import { Link } from 'react-router-dom'
import { AddButton } from '@shared/ui'

interface Props {
    path: string
    text?: string
}

export const Ui = ({ path, text = 'Создать' }: Props) => {
  return (
    <AddButton
      component={Link}
      to={path}
    >
      {text}
    </AddButton>
  )
}
