import { LoadingButton } from '@mui/lab'
import DownloadIcon from '@icons/download.svg?react'
import { palette } from '@shared/theme/palette'
import { useMutation } from 'react-query'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'

import { apiExport } from '../api/api-export'

export const ExportTemplateButton = () => {
  const { mutate, isLoading } = useMutation({
    mutationFn: apiExport,
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message ||
            'Произошла ошибка при экспорте шаблона продуктов',
        )
      }
    },
    onSuccess: () => {
      toast.success('Шаблон успешно экспортирован')
    },
  })

  const handleDownload = () => {
    (mutate as any)()
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
