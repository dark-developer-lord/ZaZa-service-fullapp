import { Skeleton, Typography, TypographyProps } from '@mui/material'

interface Props extends TypographyProps {
  label: string
  total?: number
  labelProps?: TypographyProps
  totalProps?: TypographyProps
}

export const InfoItem = ({
  total,
  label,
  labelProps,
  totalProps,
  ...props
}: Props) => {
  return (
    <Typography
      variant="medium"
      component="p"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...props.sx,
      }}
      {...props}
    >
      <Typography
        component="span"
        color="text.secondary"
        {...labelProps}
      >
        {label}
      </Typography>
      {total !== undefined ? (
        <Typography
          component="span"
          color="text.primary"
          fontWeight={600}
          {...totalProps}
        >
          {Math.round(total * 100) / 100} сомони
        </Typography>
      ) : (
        <Skeleton
          width={70}
          height={20}
          variant="rounded"
        />
      )}
    </Typography>
  )
}
