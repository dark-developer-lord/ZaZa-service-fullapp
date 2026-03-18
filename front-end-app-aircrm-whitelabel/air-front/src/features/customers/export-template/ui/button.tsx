import { useState } from 'react'
import { LoadingButton } from '@mui/lab'
import { useMutation } from 'react-query'

import DownloadIcon from '@icons/download.svg?react'
import { palette } from '@shared/theme/palette'
import { ApiKeys } from '@shared/api'

import { downloadCustomerTemplate } from '../api'

export const CustomerTemplateButton = () => {
  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Customers.getCustomers, 'template'],
    mutationFn: downloadCustomerTemplate,
  })

  const handleDownload = () => {
    mutate()
  }

  return (
    <LoadingButton
      onClick={handleDownload}
      loading={isLoading}
      color="secondary"
      startIcon={
        <DownloadIcon
          width={20}
          height={20}
          stroke={palette.text.primary}
        />
      }
    >
      Получить шаблон
    </LoadingButton>
  )
}
