import { AddButton } from '@shared/ui'

import { useStore } from '../model/store'

export const CreateButton = () => {
  const openCreate = useStore((state) => state.openCreate)
  return <AddButton
    sx={{ ml: 'auto' }}
    onClick={openCreate}
  >
    Новая категория
  </AddButton>
}
