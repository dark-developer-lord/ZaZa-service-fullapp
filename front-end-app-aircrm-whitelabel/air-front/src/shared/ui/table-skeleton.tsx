import { Box, Skeleton } from '@mui/material'

interface Props {
  /** Number of skeleton rows */
  rows?: number
  /** Number of columns to simulate */
  columns?: number
  /** Row height in px */
  rowHeight?: number
}

/**
 * Drop-in skeleton for any table/list while data is loading.
 * Shows a header row + N data rows. Replaces the PageLoader flash
 * so the layout doesn't jump.
 */
export const TableSkeleton = ({ rows = 8, columns = 5, rowHeight = 52 }: Props) => {
  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', gap: 2, mb: 1, px: 1 }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" height={24} sx={{ flex: 1 }} />
        ))}
      </Box>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <Box
          key={i}
          sx={{
            display: 'flex',
            gap: 2,
            mb: 0.75,
            px: 1,
            py: 0.5,
            borderRadius: '12px',
            bgcolor: 'background.paper',
          }}
        >
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton
              key={j}
              variant="rounded"
              height={rowHeight * 0.55}
              sx={{ flex: 1, borderRadius: '8px' }}
            />
          ))}
        </Box>
      ))}
    </Box>
  )
}
