import type { TypographyStyleOptions, Variant } from '@mui/material/styles'

type CustomVariants = 'xl' | 'large' | 'medium' | 'small' | 'xs' | 'xxs'

declare module '@mui/material/styles' {
  interface TypographyVariants
    extends Partial<Record<CustomVariants, TypographyStyleOptions>> {}
  interface TypographyVariantsOptions
    extends Partial<Record<CustomVariants, TypographyStyleOptions>> {}
}

declare module '@mui/material/typography' {
  interface TypographyPropsVariantOverrides
    extends Record<CustomVariants, true> {}
}

export {}
