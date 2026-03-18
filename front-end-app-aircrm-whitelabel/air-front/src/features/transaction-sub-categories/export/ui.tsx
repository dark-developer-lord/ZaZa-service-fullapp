import { MouseEventHandler, useState } from 'react'
import { LoadingButton } from '@mui/lab'
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material'

import CsvIcon from '@icons/csv.svg?react'
import DownloadIcon from '@icons/download.svg?react'
import ExcelIcon from '@icons/excel.svg?react'

import { exportCategories } from './api'

// TODO: remove this component and use the one from the shared library
export const Ui = () => {
  const [isFetching, setIsFetching] = useState(false)
  const { palette } = useTheme()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const open = Boolean(anchorEl)
  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleExport = (type: 'excel' | 'csv') => {
    return async () => {
      handleClose()
      setIsFetching(true)
      await exportCategories(type)
      setIsFetching(false)
    }
  }

  return (
    <>
      <LoadingButton
        aria-controls={open ? 'export-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        loading={isFetching}
        startIcon={
          <DownloadIcon
            width={20}
            height={20}
            stroke={palette.text.primary}
          />
        }
        color="secondary"
      >
        Экспорт
      </LoadingButton>
      <Menu
        id="export-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleExport('excel')}>
          <ListItemIcon>
            <ExcelIcon
              width={20}
              height={20}
            />
          </ListItemIcon>
          <ListItemText>Excel</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleExport('csv')}>
          <ListItemIcon>
            <CsvIcon
              width={20}
              height={20}
            />
          </ListItemIcon>
          <ListItemText>CSV</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}
