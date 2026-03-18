import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Stack,
  Button,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'

import { FormInput } from '@shared/ui'
import CloseIcon from '@icons/close.svg?react'

// Validation schema for add points form
const addPointsSchema = yup.object().shape({
  points_to_add: yup
    .number()
    .required('Поле обязательно для заполнения')
    .min(0.01, 'Количество баллов должно быть больше 0')
    .test('decimal', 'Максимум 2 знака после запятой', (value) => {
      if (value === undefined || value === null) return true
      return Number.isInteger(value * 100) // Allows up to 2 decimal places
    }),
  comment: yup.string().optional(),
})

type AddPointsDto = yup.InferType<typeof addPointsSchema>

interface Props {
  open: boolean
  onClose: () => void
  currentPoints: number
  onAddPoints: (points: number, comment: string) => void
  isLoading?: boolean
}

export const AddPointsModal = ({ open, onClose, currentPoints, onAddPoints, isLoading = false }: Props) => {
  const { control, handleSubmit, reset, watch, setValue } = useForm<AddPointsDto>({
    defaultValues: {
      points_to_add: 0,
      comment: '',
    },
    resolver: yupResolver(addPointsSchema),
  })

  const pointsToAdd = watch('points_to_add') || 0

  // Handle comma to dot replacement
  const handlePointsChange = (value: string) => {
    const cleanValue = value.replace(',', '.')
    const numericValue = parseFloat(cleanValue) || 0
    setValue('points_to_add', numericValue)
  }

  const onSubmit = (data: AddPointsDto) => {
    onAddPoints(data.points_to_add, data.comment || '')
    reset()
    onClose()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '12px' }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 2
      }}>
        <Typography variant="h6" component="div">
          Добавление баллов
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{ 
            color: 'text.secondary',
            '&:hover': { backgroundColor: 'grey.100' }
          }}
        >
          <CloseIcon width={20} height={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {/* Current Points Display */}
            <Box sx={{ 
              p: 2, 
              backgroundColor: 'grey.50', 
              borderRadius: '8px',
              border: '1px solid',
              borderColor: 'grey.200'
            }}>
              <Typography variant="body2" color="text.secondary">
                Текущий баланс баллов
              </Typography>
              <Typography variant="h6" color="primary.main">
                {currentPoints} баллов
              </Typography>
            </Box>

            {/* Points to Add Input */}
            <FormInput
              name="points_to_add"
              control={control}
              label="Начисление баллов*"
              type="number"
              required
              inputProps={{
                step: "0.01",
                min: "0.01",
              }}
              onChange={(e) => handlePointsChange(e.target.value)}
              helperText="Введите количество баллов для начисления"
            />

            {/* Comment Input */}
            <FormInput
              name="comment"
              control={control}
              label="Комментарий по начислению"
              multiline
              rows={3}
              placeholder="Укажите причину начисления баллов (необязательно)"
            />

            {/* Preview */}
            {pointsToAdd > 0 && (
              <Box sx={{
                p: 2,
                backgroundColor: 'success.light',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: 'success.main'
              }}>
                <Typography variant="body2" color="success.dark">
                  После начисления у клиента будет: <strong>{Number(currentPoints) + Number(pointsToAdd)} баллов</strong>
                </Typography>
              </Box>
            )}

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleClose}
                fullWidth
                disabled={isLoading}
              >
                Отменить
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isLoading}
                fullWidth
                sx={{
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                Начислить
              </LoadingButton>
            </Stack>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  )
}
