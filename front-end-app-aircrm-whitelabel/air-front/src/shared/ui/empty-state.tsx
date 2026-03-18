import { Box, Typography, Button } from '@mui/material'
import InboxIcon from '@mui/icons-material/Inbox'
import type { ReactNode } from 'react'

interface Props {
  /** Main heading — e.g. "Нет данных" */
  title?: string
  /** Optional sub-text */
  description?: string
  /** Slot for a custom icon/illustration. Defaults to the Inbox icon. */
  icon?: ReactNode
  /** Show an action button */
  action?: { label: string; onClick: () => void }
}

/**
 * Generic empty-state block used when a list/table returns no rows.
 * Replaces the "blank nothing" that MUI DataGrid shows by default.
 */
export const EmptyState = ({
  title = 'Нет данных',
  description,
  icon,
  action,
}: Props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
        gap: 1.5,
        color: 'text.disabled',
      }}
    >
      {icon ?? <InboxIcon sx={{ fontSize: 56, opacity: 0.4 }} />}
      <Typography variant="h6" color="text.secondary" textAlign="center">
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.disabled" textAlign="center" maxWidth={320}>
          {description}
        </Typography>
      )}
      {action && (
        <Button size="small" variant="outlined" sx={{ mt: 1 }} onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Box>
  )
}
