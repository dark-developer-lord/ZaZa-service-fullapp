import { useState, ReactNode, useEffect } from 'react'
import { Box, Typography, IconButton, Collapse, Card, CardContent } from '@mui/material'
import { ExpandMore, ExpandLess } from '@mui/icons-material'

interface CollapsibleCardProps {
  title: string
  children: ReactNode
  defaultExpanded?: boolean
  expanded?: boolean // Controlled mode
  onToggle?: (expanded: boolean) => void // Callback for controlled mode
  sx?: any
}

export const CollapsibleCard = ({
  title,
  children,
  defaultExpanded = true,
  expanded: controlledExpanded,
  onToggle,
  sx = {}
}: CollapsibleCardProps) => {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)

  // Use controlled or uncontrolled mode
  const isControlled = controlledExpanded !== undefined
  const expanded = isControlled ? controlledExpanded : internalExpanded

  // Auto-expand when controlled expanded changes to true
  useEffect(() => {
    if (isControlled && controlledExpanded) {
      setInternalExpanded(true)
    }
  }, [isControlled, controlledExpanded])

  const handleToggle = () => {
    const newExpanded = !expanded
    if (isControlled && onToggle) {
      onToggle(newExpanded)
    } else {
      setInternalExpanded(newExpanded)
    }
  }

  return (
    <Card sx={{ borderRadius: 1, ...sx }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          cursor: 'pointer',
          transition: 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transitionDelay: '0ms',
          '&:hover': {
            bgcolor: 'rgba(0, 0, 0, 0.02)',
            transition: 'background-color 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transitionDelay: '30ms'
          }
        }}
        onClick={handleToggle}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <IconButton size="small" sx={{ ml: 1 }}>
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
      
      <Collapse in={expanded}>
        <CardContent sx={{ pt: 0 }}>
          {children}
        </CardContent>
      </Collapse>
    </Card>
  )
}
