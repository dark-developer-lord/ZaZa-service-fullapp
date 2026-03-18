import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from 'react-query'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'
import {
  Box,
  Grid,
  Typography,
  Button,
  Stack,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
  TextField,
  InputAdornment,
  Tooltip
} from '@mui/material'
import { LoadingButton } from '@mui/lab'

import { FormInput, FormDateInput, FileUploader } from '@shared/ui'
import { CustomerItem } from '@entities/customer'
import AddIcon from '@icons/add-fill.svg?react'
import { VendorApi, ApiKeys, putQuery, postQuery, queryClient } from '@shared/api'

import { customerEditSchema, CustomerEditDto } from '../model/dto'
import { fileUploadProps } from '../lib/file-upload-props'
import { AddPointsModal } from './add-points-modal'

interface Props {
  customer?: CustomerItem
}

export const CustomerEditForm = ({ customer }: Props) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))
  const [isEditMode, setIsEditMode] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [isAddPointsModalOpen, setIsAddPointsModalOpen] = useState(false)

  const defaultValues: CustomerEditDto = {
    image: '',
    customer_id: (customer?.user_number || customer?.id)?.toString() || '',
    full_name: `${customer?.f_name || ''} ${customer?.l_name || ''}`.trim(),
    phone: customer?.phone || '',
    birth_date: customer?.birth_date || '',
    user_address: customer?.user_address || '',
    loyalty_points: customer?.loyalty_points || undefined,
    loyalty_point_percentage: customer?.loyalty_points_percentage ?
      (customer.loyalty_points_percentage % 1 === 0 ?
        Math.floor(customer.loyalty_points_percentage) :
        customer.loyalty_points_percentage) : 0,
    source: customer?.source || '',
    notes: '', // Will be populated from API
  }

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CustomerEditDto>({
    resolver: yupResolver(customerEditSchema),
    defaultValues,
  })

  // Update form when customer prop changes (after API refetch)
  useEffect(() => {
    if (customer) {
      setValue('customer_id', (customer.user_number || customer.id).toString())
      setValue('full_name', `${customer.f_name || ''} ${customer.l_name || ''}`.trim())
      setValue('phone', customer.phone || '')
      setValue('birth_date', customer.birth_date || '')
      setValue('user_address', customer.user_address || '')
      setValue('loyalty_points', customer.loyalty_points || undefined)
      setValue('loyalty_point_percentage', customer.loyalty_points_percentage ?
        (customer.loyalty_points_percentage % 1 === 0 ?
          Math.floor(customer.loyalty_points_percentage) :
          customer.loyalty_points_percentage) : 0)
      setValue('source', customer.source || '')
    }
  }, [customer, setValue])

  const { mutate: updateCustomer, isLoading: isUpdating } = useMutation({
    mutationKey: [ApiKeys.Customers.updateCustomer_ + customer?.id],
    mutationFn: putQuery(VendorApi.updateCustomer_ + customer?.id),
    onSuccess() {
      toast.success('Данные клиента успешно обновлены')
      // Invalidate all customer-related queries to ensure UI updates
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey as string[]
          return queryKey[0] === ApiKeys.Customers.getCustomers
        }
      })
      setIsEditMode(false)
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Произошла ошибка при обновлении')
      }
    },
  })

  const { mutate: addPoints, isLoading: isAddingPoints } = useMutation({
    mutationKey: [ApiKeys.Customers.addCustomerPoints_ + customer?.id],
    mutationFn: postQuery(VendorApi.addCustomerPoints_ + customer?.id + '/add-points'),
    onSuccess() {
      toast.success('Баллы успешно начислены')
      // Invalidate all customer-related queries to ensure UI updates
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey as string[]
          return queryKey[0] === ApiKeys.Customers.getCustomers
        }
      })
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Произошла ошибка при начислении баллов')
      }
    },
  })

  useEffect(() => {
    if (customer) {
      const updatedValues: CustomerEditDto = {
        image: '',
        customer_id: (customer.user_number || customer.id).toString(),
        full_name: `${customer.f_name || ''} ${customer.l_name || ''}`.trim(),
        phone: customer.phone || '',
        birth_date: customer.birth_date || '',
        user_address: customer.user_address || '',
        loyalty_points: customer.loyalty_points || undefined,
        loyalty_point_percentage: customer?.loyalty_points_percentage ?
          (customer.loyalty_points_percentage % 1 === 0 ?
            Math.floor(customer.loyalty_points_percentage) :
            customer.loyalty_points_percentage) : 0,
        source: customer.source || '',
        notes: '',
      }
      reset(updatedValues)
    }
  }, [customer, reset])

  const onSubmit = (data: CustomerEditDto) => {
    // Transform data for API - user_address should be sent as address in payload
    const payload = {
      ...data,
      address: data.user_address, // Map user_address to address for API
    }
    delete payload.user_address // Remove the original field

    // console.log('Customer update payload:', payload)
    updateCustomer(payload)
  }

  const handleEdit = () => {
    setIsEditMode(true)
  }

  const handleAddPoints = (points: number, comment: string) => {
    const payload = {
      points_to_add: points,
      comment: comment
    }
    addPoints(payload)
  }

  const handleCancel = () => {
    setIsEditMode(false)
    if (customer) {
      const originalValues: CustomerEditDto = {
        image: '',
        customer_id: customer.id.toString(),
        full_name: `${customer.f_name || ''} ${customer.l_name || ''}`.trim(),
        phone: customer.phone || '',
        birth_date: customer.birth_date || '',
        user_address: customer.user_address || '',
        loyalty_points: customer.loyalty_points || undefined,
        loyalty_point_percentage: customer?.loyalty_points_percentage ?
          (customer.loyalty_points_percentage % 1 === 0 ?
            Math.floor(customer.loyalty_points_percentage) :
            customer.loyalty_points_percentage) : 0,
        source: customer.source || '',
        notes: '',
      }
      reset(originalValues)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Общие сведения
      </Typography>

      <Box sx={{
        display: 'flex',
        gap: 2,
        alignItems: 'flex-start',
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        <Box sx={{
          flexShrink: 0,
          width: isMobile ? '100%' : '120px',
          display: 'flex',
          justifyContent: isMobile ? 'center' : 'flex-start'
        }}>
          <FormControl sx={{ width: isMobile ? '120px' : '100%' }}>
            <Tooltip title="Coming soon..." arrow placement="top">
              <Box>
                <FileUploader
                  title="Загрузить фото 1:1"
                  name="image"
                  control={control}
                  files={files}
                  setFiles={setFiles}
                  setValue={setValue}
                  errorMessage={errors.image?.message}
                  acceptFiles={fileUploadProps.acceptFiles}
                  acceptFilesText={fileUploadProps.acceptFilesText}
                  maxFileSize={fileUploadProps.maxFileSize}
                  compact={true}
                  disabled={true}
                  sx={{
                    height: '112px',
                    width: '100%',
                    opacity: 0.6,
                    cursor: 'not-allowed',
                  }}
                />
              </Box>
            </Tooltip>
          </FormControl>
        </Box>

        {/* Form Fields - Takes remaining space */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Row 1 - Responsive layout */}
          <Box sx={{
            display: 'flex',
            gap: 1.5,
            flexDirection: isMobile ? 'column' : 'row',
            flexWrap: isMobile ? 'nowrap' : 'wrap'
          }}>
            <Box sx={{
              flex: isMobile ? '1 1 100%' : '95 1 0%',
              minWidth: isMobile ? 'auto' : '80px'
            }}>
              <FormInput
                name="customer_id"
                control={control}
                label="ID Клиента"
                disabled={true}
                size="small"
              />
            </Box>
            <Box sx={{
              flex: isMobile ? '1 1 100%' : '266 1 0%',
              minWidth: isMobile ? 'auto' : '150px'
            }}>
              <FormInput
                name="full_name"
                control={control}
                label="ФИО клиента"
                disabled={!isEditMode}
                size="small"
              />
            </Box>
            <Box sx={{
              flex: isMobile ? '1 1 100%' : '188 1 0%',
              minWidth: isMobile ? 'auto' : '120px'
            }}>
              <FormInput
                name="phone"
                control={control}
                label="Номер телефона"
                disabled={!isEditMode}
                size="small"
              />
            </Box>
            <Box sx={{
              flex: isMobile ? '1 1 100%' : '130 1 0%',
              minWidth: isMobile ? 'auto' : '110px'
            }}>
              <FormDateInput
                name="birth_date"
                control={control}
                label="Дата рождения"
                disabled={!isEditMode}
              />
            </Box>
            <Box sx={{
              flex: isMobile ? '1 1 100%' : '135 1 0%',
              minWidth: isMobile ? 'auto' : '100px'
            }}>
              <FormInput
                name="user_address"
                control={control}
                label="Адрес"
                disabled={!isEditMode}
                size="small"
              />
            </Box>
          </Box>

          {/* Row 2 - Responsive layout */}
          <Box sx={{
            display: 'flex',
            gap: 1.5,
            flexDirection: isMobile ? 'column' : 'row',
            flexWrap: isMobile ? 'nowrap' : 'wrap'
          }}>
            <Box sx={{
              flex: isMobile ? '1 1 100%' : '95 1 0%',
              minWidth: isMobile ? 'auto' : '80px'
            }}>
              <FormInput
                name="loyalty_point_percentage"
                control={control}
                label="% Начисление"
                type="number"
                disabled={!isEditMode}
                size="small"
                inputProps={{
                  step: "0.01",
                  min: "0",
                  max: "100"
                }}
              />
            </Box>
            <Box sx={{
              flex: isMobile ? '1 1 100%' : '130 1 0%',
              minWidth: isMobile ? 'auto' : '100px'
            }}>
              <TextField
                label="Кол-во покупок"
                type="number"
                disabled={true}
                size="small"
                value={customer?.total_order_count || 0}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
            <Box sx={{
              flex: isMobile ? '1 1 100%' : '174 1 0%',
              minWidth: isMobile ? 'auto' : '120px'
            }}>
              <TextField
                label="Сумма покупок"
                type="number"
                disabled={true}
                size="small"
                value={customer?.total_order_amount || 0}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
            <Box sx={{
              flex: isMobile ? '1 1 100%' : '115 1 0%',
              minWidth: isMobile ? 'auto' : '90px'
            }}>
              <TextField
                label="Дни отсутствия"
                type="number"
                disabled={true}
                size="small"
                value={customer?.absence_days || 0}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
            <Box sx={{
              flex: isMobile ? '1 1 100%' : '170 1 0%',
              minWidth: isMobile ? 'auto' : '110px'
            }}>
              <FormInput
                name="source"
                control={control}
                label="Источник"
                disabled={!isEditMode}
                size="small"
              />
            </Box>
            <Box sx={{
              flex: isMobile ? '1 1 100%' : '118 1 0%',
              minWidth: isMobile ? 'auto' : '90px'
            }}>
              <TextField
                label="Долг"
                type="number"
                disabled={true}
                size="small"
                value={customer?.total_installment || 0}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
            <Box sx={{
              flex: isMobile ? '1 1 100%' : '158 1 0%',
              minWidth: isMobile ? 'auto' : '120px'
            }}>
              <TextField
                label="Баллы"
                type="number"
                disabled={true}
                size="small"
                value={customer?.loyalty_points || 0}
                fullWidth
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      sx={{
                        padding: 0,
                        margin: 0,
                        '& .MuiInputAdornment-root': {
                          padding: 0,
                          margin: 0
                        }
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '43px',
                          width: '40px',
                          marginRight: '-14px',
                          marginTop: '-1px',
                          marginBottom: '-1px',
                          borderRadius: '0 12px 12px 0',
                          transition: 'background-color 0.2s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'primary.dark'
                          }
                        }}
                        onClick={() => setIsAddPointsModalOpen(true)}
                      >
                        <AddIcon width={16} height={16} style={{ fill: 'white' }} />
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Row 3 - Notes field taking full width with reduced height */}
      <Box sx={{ mt: 2 }}>
        <FormInput
          name="notes"
          control={control}
          label="Заметки"
          multiline
          rows={2}
          placeholder="Впишите свои заметки о данном клиенте, чтобы ваши взаимоотношения были лучше."
          disabled={!isEditMode}
          size="small"
        />
      </Box>

      {/* Action Buttons - Responsive layout */}
      <Box sx={{
        display: 'flex',
        justifyContent: isMobile ? 'center' : 'flex-end',
        gap: 2,
        mt: 3,
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center'
      }}>
        <Button
          variant="contained"
          onClick={isEditMode ? handleCancel : handleEdit}
          sx={{
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.primary.main,
            minWidth: isMobile ? 'auto' : '140px',
            '&:hover': {
              backgroundColor: theme.palette.secondary.dark,
              color: theme.palette.primary.main,
            },
          }}
        >
          {isEditMode ? 'Отменить' : 'Редактировать'}
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          disabled={!isEditMode}
          loading={isUpdating}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            minWidth: isMobile ? 'auto' : '140px',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
            '&:disabled': {
              backgroundColor: theme.palette.grey[300],
              color: theme.palette.grey[500],
            },
          }}
        >
          Сохранить
        </LoadingButton>
      </Box>

      {/* Add Points Modal */}
      <AddPointsModal
        open={isAddPointsModalOpen}
        onClose={() => setIsAddPointsModalOpen(false)}
        currentPoints={customer?.loyalty_points || 0}
        onAddPoints={handleAddPoints}
        isLoading={isAddingPoints}
      />
    </Box>
  )
}
