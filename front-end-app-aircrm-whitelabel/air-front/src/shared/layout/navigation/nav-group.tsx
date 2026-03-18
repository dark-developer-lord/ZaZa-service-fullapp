import { SyntheticEvent, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Box, List } from '@mui/material'

import { MenuItem } from './menu-item'
import { NavGroupType } from './nav-type'

interface Props {
  group: NavGroupType,
  open: boolean,
  collapseMenu: () => void,
}

export const NavGroup = ({ group, open, collapseMenu }: Props) => {
  const [expanded, setExpanded] = useState<string | false>(false)
  const { pathname } = useLocation()

  useEffect(() => {
    group.children.forEach((child) => {
      if (child.path === pathname) {
        setExpanded(child.name)
      }
    })
  }, [group.children, pathname])

  const handleChange =
    (panel: string) => (_: SyntheticEvent, isExpanded: boolean) => {
      if(!open){
        collapseMenu()
      }
      setExpanded(isExpanded ? panel : false)
    }

  return (
    <Box>
      <List>
        {group.children.map((child) => (
          <MenuItem
            key={child.name}
            item={child}
            expanded={expanded === child.name}
            onChange={handleChange(child.name)}
            open={open}
            // collapseMenu={collapseMenu}
          />
        ))}
      </List>
    </Box>
  )
}
