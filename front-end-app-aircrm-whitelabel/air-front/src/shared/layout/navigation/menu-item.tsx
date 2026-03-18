import { SyntheticEvent, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  useTheme,
  alpha,
  Collapse,
  List,
} from '@mui/material'

import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'

import { NavType } from './nav-type'

interface Props {
  item: NavType
  expanded?: boolean
  onChange?: (event: SyntheticEvent, expanded: boolean) => void
  open: boolean,
}

export const MenuItem = ({ item, open }: Props) => {
  const theme = useTheme()
  const { pathname, search } = useLocation()
  const url = pathname + search
  const [expanded, setExpanded] = useState(false)

  // Check if current item is active (including children only for Reports)
  const isActive = url === item.path || url.startsWith(item.path + '/') ||
    (item.name === 'analytic' && item.children && item.children.some(child => url === child.path || url.startsWith(child.path + '/')))

  // Check if any child is active (only for Reports)
  const hasActiveChild = item.name === 'analytic' && item.children && item.children.some(child =>
    url === child.path || url.startsWith(child.path + '/'))

  // Auto-expand if has active child
  useEffect(() => {
    if (hasActiveChild) {
      setExpanded(true)
    }
  }, [hasActiveChild])

  const handleClick = () => {
    // Dropdown functionality removed - all items are now direct links
  }

  // No dropdown children anymore - all items are direct links
  const hasChildren = false

  return (
    <>
      <ListItem
        disablePadding
        sx={{
          py: '2px'
        }}
      >
        <ListItemButton
          component={hasChildren ? 'div' : Link}
          to={hasChildren ? undefined : item.path}
          onClick={handleClick}
          color="secondary"
          sx={{
            backgroundColor: isActive
              ? alpha(theme.palette.primary.main, 0.1)
              : 'transparent',
            transition: 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDelay: '0ms',
            '&:hover': {
              bgcolor: isActive
                ? alpha(theme.palette.primary.main, 0.15)
                : theme.palette.grey[300],
              transition: 'background-color 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transitionDelay: '35ms'
            },
            justifyContent: open ? 'initial' : 'center',
            borderRadius: '8px',
            mx: '4px',
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 1 : 'auto',
              '& svg': {
                fill: isActive ? theme.palette.primary.main : 'none',
                color: isActive ? 'white' : '#6F7073',
                '& path': {
                  stroke: isActive ? 'white' : '#6F7073',
                },
                '& rect': {
                  stroke: isActive ? theme.palette.primary.main : '#6F7073',
                  fill: isActive ? theme.palette.primary.main : 'none',
                }
              }
            }}
          >
            {item.icon && (
              <item.icon
                width={24}
                height={24}
              />
            )}
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            sx={{
              '& .MuiListItemText-primary': {
                fontSize: '13px',
                fontWeight: 500,
                lineHeight: 1.53,
                color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
              },
            }}
          />
          {hasChildren && open && (
            expanded ? <ExpandLess /> : <ExpandMore />
          )}
        </ListItemButton>
      </ListItem>

      {hasChildren && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children?.map((child) => {
              const childIsActive = url === child.path || url.startsWith(child.path + '/')
              return (
                <ListItem
                  key={child.path}
                  disablePadding
                  sx={{ py: '1px' }}
                >
                  <ListItemButton
                    component={Link}
                    to={child.path}
                    sx={{
                      backgroundColor: childIsActive
                        ? alpha(theme.palette.primary.main, 0.1)
                        : 'transparent',
                      transition: 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transitionDelay: '0ms',
                      '&:hover': {
                        bgcolor: childIsActive
                          ? alpha(theme.palette.primary.main, 0.15)
                          : theme.palette.grey[300],
                        transition: 'background-color 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        transitionDelay: '35ms'
                      },
                      borderRadius: '8px',
                      mx: '4px',
                      ml: open ? '20px' : '4px', // Indent children
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 1 : 'auto',
                        '& svg': {
                          fill: childIsActive ? theme.palette.primary.main : 'none',
                          color: childIsActive ? 'white' : '#6F7073',
                          '& path': {
                            stroke: childIsActive ? 'white' : '#6F7073',
                          },
                          '& rect': {
                            stroke: childIsActive ? theme.palette.primary.main : '#6F7073',
                            fill: childIsActive ? theme.palette.primary.main : 'none',
                          }
                        }
                      }}
                    >
                      {child.icon && (
                        <child.icon
                          width={20}
                          height={20}
                        />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={child.label}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontSize: '12px',
                          fontWeight: 400,
                          lineHeight: 1.53,
                          color: childIsActive ? theme.palette.primary.main : theme.palette.text.secondary,
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              )
            })}
          </List>
        </Collapse>
      )}
    </>
  )
}