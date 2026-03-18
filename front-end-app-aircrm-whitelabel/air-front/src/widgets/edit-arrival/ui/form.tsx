import { useEffect, useState, Fragment } from 'react'
import { Controller, SubmitHandler, useForm, useFieldArray } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Button,
  Stack,
  Typography,
  TextField,
  FormGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  alpha,
  useTheme,
  useMediaQuery,
  Box,
  Collapse,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Paper,
} from '@mui/material'
import { MuiChipsInput } from 'mui-chips-input'
import PlusIcon from '@icons/plus.svg?react'
import DeleteIcon from '@icons/delete.svg?react'
import AddIcon from '@icons/add-fill.svg?react'
import ChevronDownIcon from '@icons/chevron-down.svg?react'
import { AxiosError } from 'axios'
import { useGetAttributes } from '@entities/attribute'
import { useGetCategories } from '@widgets/categories/api/get-categories'
import { useGetSubCategories } from '@entities/sub-category'

import {
  CreateArrivalGeneral,
  ArrivalDto,
  createArrivalSchema,
} from '@features/create-arrival'
import { WarehouseSelect } from '@features/create-arrival/ui/warehouse-select'
import { ApiKeys, getApiPaths, postQuery, putQuery } from '@shared/api'
import { RouterPaths, numberWithSpace } from '@shared/lib'
import { Board, FormInput, PageLoader } from '@shared/ui'
import { Toggle } from '@shared/ui/form'
import { AutocompleteSearch } from '@features/create-arrival'
import { CreateCategoryDialog } from '@features/categories'
import { useStore as useCategoryStore } from '@features/categories/create-update/model/store'
import { CreateSubCategoryDialog } from '@features/sub-categories'
import { useStore as useSubCategoryStore } from '@features/sub-categories/create-update/model/store'
import { CreateAttributeDialog } from '@features/attributes'
import { useStore as useAttributeStore } from '@features/attributes/create-update/model/store'

import { useGetArrival } from '@entities/warehouse'
import { setForm } from '../lib/set-form'

const defaultValues: Partial<
  Record<keyof ArrivalDto, string | number | number[] | string[] | null>
> = {
  name: '',
  counterparty_id: 0,
  counterparty_name: '',
  contact: '',
  company_name: '',
  address: '',
  inn: '',
  warehouse_id: '',
  status: ''
}

export const Form = () => {
  const { data, isFetching, error } = useGetArrival()
  const openCreateCategory = useCategoryStore((state) => state.openCreate)
  const openCreateSubCategory = useSubCategoryStore((state) => state.openCreate)
  const openCreateAttribute = useAttributeStore((state) => state.openCreate)

  const navigate = useNavigate()
  
  // Check if receipt is from transfer (should be read-only)
  const isTransferReceipt = data?.data?.receipt_type === 'transfer_outgoing'
  const isTransferIncoming = data?.data?.receipt_type === 'transfer_incoming'
  const receiptStatus = data?.data?.status
  const isRefund = receiptStatus === 'refund' || receiptStatus === 'return'
  const isCompleted = receiptStatus === 'completed'
  const [refundDialogOpen, setRefundDialogOpen] = useState(false)

  // Redirect if receipt is refunded (prevent manual URL access)
  useEffect(() => {
    if (data?.data?.is_refunded === true) {
      toast.error('Невозможно редактировать возвращенный чек')
      navigate(RouterPaths.warehouse + '?report=receipt')
    }
  }, [data?.data?.is_refunded, navigate])

  // Redirect on Unauthorized error (generic message to prevent information disclosure)
  useEffect(() => {
    if (error) {
      const axiosError = error as AxiosError<{ message?: string }>
      const errorMessage = axiosError.response?.data?.message || axiosError.message
      const statusCode = axiosError.response?.status
      
      if (errorMessage === 'Unauthorized' || statusCode === 401 || statusCode === 403 || statusCode === 404) {
        toast.error('Чек не найден')
        navigate(RouterPaths.warehouse + '?report=receipt')
      }
    }
  }, [error, navigate])
  
  // Refund selection state: track selected products and variations with quantities
  // Structure: { productId: { quantity?: number, variations: { variationId: quantity } } }
  const [refundSelections, setRefundSelections] = useState<Record<number, {
    quantity?: number
    variations?: Record<string, number>
  }>>({})
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    reset,
    getValues
  } = useForm<ArrivalDto>({
    defaultValues: defaultValues as unknown as ArrivalDto,
    resolver: yupResolver(createArrivalSchema),
  })
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'products'
  })

  // State for managing product photos
  const [productPhotos, setProductPhotos] = useState<{ [key: number]: File | null }>({})

  // State for managing variations per row
  const [rowVariations, setRowVariations] = useState<Record<number, {
    variationName: string
    variationOptions: Array<{ id: string; name: string }>
    showOptions: boolean
    variationDetails: Record<string, {
      attributeId: number | string
      attributeValue: string
      costPrice: string
      salePrice: string
      quantity: string
      barcode: string
    }>
  }>>({})

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))

  // Fetch attributes for variation details
  const { data: attributesData, isLoading: attributesLoading } = useGetAttributes({
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  // Fetch categories for product categorization (with perPage=100 to get all categories)
  const { data: categoriesData, isFetching: categoriesLoading } = useGetCategories(100)

  const params = useParams()
  const { mutate } = useMutation({
    mutationKey: [ApiKeys.WarehouseReports.updateReceipt_ + params.id],
    mutationFn: postQuery(getApiPaths().updateReceipt_ + params.id),
  })

  const { mutate: refundReceipt, isLoading: isRefunding } = useMutation({
    mutationKey: [ApiKeys.WarehouseReports.updateReceipt_ + params.id + '_refund'],
    mutationFn: putQuery(getApiPaths().updateReceipt_ + params.id),
    onSuccess: () => {
      toast.success('Возврат успешно выполнен')
      setRefundDialogOpen(false)
      navigate(RouterPaths.warehouse + '?report=receipt')
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message || 'Ошибка при выполнении возврата',
        )
      }
    },
  })

  useEffect(() => {
    if (data) {
      // Convert API data to form format
      const formData = setForm(data.data) as ArrivalDto

      // Reset the form with the data
      reset(formData)

      // Initialize rowVariations state from existing items with variations
      const initialVariations: Record<number, {
        variationName: string
        variationOptions: Array<{ id: string; name: string }>
        showOptions: boolean
        variationDetails: Record<string, {
          attributeId: number | string
          attributeValue: string
          costPrice: string
          salePrice: string
          quantity: string
          barcode: string
        }>
      }> = {}

      // Map items from API to variations state
      data.data.items?.forEach((item, index) => {
        // Check if product has variations array
        if (item.product.variations && item.product.variations.length > 0) {
          const variations = item.product.variations

          // Get variation name from product level (all variations share same name)
          const variationName = item.product.variation_name || ''

          // Create variation options from variation_type field
          const variationOptions = variations.map((variation) => ({
            id: variation.variation_id || `temp_${index}_${variation.id}`,
            name: variation.variation_type || ''
          }))

          // Create variation details for each variation
          const variationDetails: Record<string, {
            attributeId: number | string
            attributeValue: string
            costPrice: string
            salePrice: string
            quantity: string
            barcode: string
          }> = {}

          variations.forEach((variation) => {
            const variationId = variation.variation_id || `temp_${index}_${variation.id}`
            variationDetails[variationId] = {
              attributeId: variation.attribute_id || 0,
              attributeValue: variation.attribute_value || '',
              costPrice: (variation.cost_price || 0).toString(),
              salePrice: (variation.sale_price || 0).toString(),
              quantity: (variation.quantity || 0).toString(),
              barcode: variation.barcode || ''
            }
          })

          initialVariations[index] = {
            variationName: variationName,
            variationOptions: variationOptions,
            showOptions: true,
            variationDetails: variationDetails
          }
        }
      })

      setRowVariations(initialVariations)
    }
  }, [data, reset])

  const onSubmit: SubmitHandler<ArrivalDto> = (dto) => {
    // Create FormData to send actual files
    const formData = new FormData()

    // Add _method field for Laravel to handle PUT request with FormData
    formData.append('_method', 'PUT')

    // Add basic fields
    formData.append('name', dto.name)
    formData.append('counterparty_id', (dto.counterparty_id || 0).toString())
    formData.append('warehouse_id', (dto.warehouse_id || 0).toString())
    formData.append('status', dto.status || 'pending')

    // Add products with their variations
    dto.products?.forEach((product, index) => {
      // Add product fields
      if (product.product_id) {
        formData.append(`products[${index}][product_id]`, product.product_id.toString())
      }
      formData.append(`products[${index}][product_name]`, product.product_name || '')
      if (product.product_code) {
        formData.append(`products[${index}][product_code]`, product.product_code)
      }
      if (product.category_id) {
        formData.append(`products[${index}][category_id]`, product.category_id.toString())
      }
      if (product.sub_category_id) {
        formData.append(`products[${index}][sub_category_id]`, product.sub_category_id.toString())
      }
      formData.append(`products[${index}][has_variations]`, product.has_variations?.toString() || 'false')
      formData.append(`products[${index}][purchase_price]`, product.purchase_price?.toString() || '0')
      formData.append(`products[${index}][retail_price]`, product.retail_price?.toString() || '0')
      formData.append(`products[${index}][quantity]`, product.quantity?.toString() || '0')

      // Add actual image file if exists
      if (productPhotos[index]) {
        formData.append(`products[${index}][image]`, productPhotos[index]!)
      }

      // Add variations if they exist for this product
      const variations = rowVariations[index]

      if (variations && product.has_variations) {
        // Add variation name
        if (variations.variationName) {
          formData.append(`products[${index}][variation_name]`, variations.variationName)
        }

        // Add variation types (options)
        if (variations.variationOptions && variations.variationOptions.length > 0) {
          variations.variationOptions.forEach((option) => {
            formData.append(`products[${index}][variation_types][]`, option.name)
          })
        }

        // Add variation details (attribute values with prices and quantities)
        if (variations.variationDetails && Object.keys(variations.variationDetails).length > 0) {
          let detailIndex = 0
          Object.entries(variations.variationDetails).forEach(([variationId, detail]) => {
            formData.append(`products[${index}][variation_details][${detailIndex}][variation_id]`, variationId)
            formData.append(`products[${index}][variation_details][${detailIndex}][attribute_id]`, (detail.attributeId || 0).toString())
            formData.append(`products[${index}][variation_details][${detailIndex}][attribute_value]`, detail.attributeValue || '')
            formData.append(`products[${index}][variation_details][${detailIndex}][cost_price]`, (parseFloat(detail.costPrice) || 0).toString())
            formData.append(`products[${index}][variation_details][${detailIndex}][sale_price]`, (parseFloat(detail.salePrice) || 0).toString())
            formData.append(`products[${index}][variation_details][${detailIndex}][quantity]`, (parseFloat(detail.quantity) || 0).toString())
            if (detail.barcode) {
              formData.append(`products[${index}][variation_details][${detailIndex}][barcode]`, detail.barcode)
            }
            detailIndex++
          })
        }
      }
    })

    mutate(formData as any, {
      onSuccess() {
        toast.success('Накладная успешно изменена')
        navigate(RouterPaths.warehouse + '?report=receipt')
      },
      onError(error) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data.message || 'Произошла ошибка при создании',
          )
        }
      },
    })
  }

  const onSubmitAndConduct: SubmitHandler<ArrivalDto> = (dto) => {
    dto.status = 'completed'
    onSubmit(dto)
  }

  const onError = (errors: any) => {
    // Show first error to user
    const firstError = Object.values(errors)[0] as any
    if (firstError?.message) {
      toast.error(firstError.message)
    } else if (firstError && typeof firstError === 'object') {
      const nestedError = Object.values(firstError)[0] as any
      if (nestedError?.message) {
        toast.error(nestedError.message)
      }
    }

    // If no error message was shown, show a generic error
    if (!firstError?.message && (!firstError || typeof firstError !== 'object' || !Object.values(firstError)[0])) {
      toast.error('Пожалуйста, заполните все обязательные поля')
    }
  }

  if (isFetching) {
    return <PageLoader />
  }

  return (
    <Stack
      component="form"
      spacing="24px"
      onSubmit={handleSubmit(onSubmit, onError)}
    >
      <CreateArrivalGeneral
        control={control}
        setValue={setValue}
        disabled={isTransferReceipt || isTransferIncoming}
      />
      <Board>
        <Stack
          direction='row'
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: '24px'
          }}
        >
          <Typography variant='h6'>Добавление товаров</Typography>
          <WarehouseSelect control={control} />
        </Stack>
        <Stack py={2} sx={{ rowGap: 3 }}>
          {fields.length !== 0 && (
            <TableContainer component={Stack}>
                <Table
                  sx={{
                    minWidth: 1280,
                    '& .MuiTableCell-head': {
                      borderBottom: 'none',
                      color: '#5E5F62',
                      fontSize: 13,
                      fontWeight: 500,
                      lineHeight: '20px',
                    },
                    '& .MuiTableCell-body': {
                      borderBottom: 'none',
                    }
                  }} aria-label="products form tabel">
                  <TableHead>
                    <TableRow>
                      <TableCell>Товар</TableCell>
                      <TableCell>Фото</TableCell>
                      <TableCell>Категория</TableCell>
                      <TableCell>Подкатегория</TableCell>
                      <TableCell>Вариации</TableCell>
                      {/* Show these columns only if at least one product has variations disabled */}
                      {fields.some((_, idx) => !watch(`products.${idx}.has_variations`)) && (
                        <>
                          <TableCell>Штрихкод</TableCell>
                          <TableCell>Цена закупки</TableCell>
                          <TableCell>Цена продажи</TableCell>
                        </>
                      )}
                      <TableCell>Количество</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fields.map((item, index) => (
                      <Fragment key={item.id}>
                        <TableRow
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell sx={{ width: 250 }}>
                          <AutocompleteSearch
                            control={control}
                            setValue={setValue}
                            getFormValues={getValues}
                            index={index}
                            watch={watch}
                            disabled={isTransferReceipt || isTransferIncoming}
                          />
                        </TableCell>
                        <TableCell>
                          <Box
                            component="label"
                            htmlFor={`photo-upload-${index}`}
                            sx={{
                              width: 60,
                              height: 60,
                              bgcolor: 'grey.200',
                              borderRadius: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: (isTransferReceipt || isTransferIncoming) ? 'not-allowed' : 'pointer',
                              overflow: 'hidden',
                              position: 'relative',
                              opacity: (isTransferReceipt || isTransferIncoming) ? 0.5 : 1,
                              '&:hover': {
                                opacity: (isTransferReceipt || isTransferIncoming) ? 0.5 : 0.8,
                              },
                            }}
                          >
                            <input
                              id={`photo-upload-${index}`}
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              disabled={isTransferReceipt || isTransferIncoming}
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  setProductPhotos(prev => ({
                                    ...prev,
                                    [index]: file
                                  }))
                                  // Set the image file name in the form
                                  setValue(`products.${index}.image`, file.name, {
                                    shouldValidate: true,
                                    shouldDirty: true
                                  })
                                }
                              }}
                            />
                            {productPhotos[index] ? (
                              <img
                                src={URL.createObjectURL(productPhotos[index]!)}
                                alt="Product"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                              />
                            ) : watch(`products.${index}.image`) ? (
                              <img
                                src={`${import.meta.env.VITE_APP_BACK_URL}/storage/product/${watch(`products.${index}.image`)}`}
                                alt="Product"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                              />
                            ) : (
                              <Typography variant="caption" color="text.secondary">
                                Фото
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        {/* Category Selector */}
                        <TableCell sx={{ width: 200 }}>
                          <Controller
                            name={`products.${index}.category_id`}
                            control={control}
                            render={({ field, fieldState }) => (
                              <FormControl fullWidth error={Boolean(fieldState.error)}>
                                <InputLabel>Категория</InputLabel>
                                <Select
                                  label="Категория"
                                  value={field.value || ''}
                                  disabled={isTransferReceipt || categoriesLoading || !categoriesData}
                                  // Allow editing category for transfer_incoming
                                  startAdornment={
                                    categoriesLoading ? (
                                      <CircularProgress size={16} sx={{ mr: 1 }} />
                                    ) : null
                                  }
                                  onChange={(e) => {
                                    if (e.target.value === 'create_new') {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      // Don't set the value, just open the dialog
                                      openCreateCategory()
                                      // Keep the previous value
                                      return
                                    }
                                    field.onChange(e)
                                    // Clear subcategory when category changes
                                    setValue(`products.${index}.sub_category_id`, null)
                                  }}
                                >
                                  <MenuItem
                                    value="create_new"
                                    sx={{ color: 'primary.main' }}
                                  >
                                    <ListItemIcon>
                                      <AddIcon width={20} height={20} fill="currentColor" />
                                    </ListItemIcon>
                                    <ListItemText primary="Добавить" />
                                  </MenuItem>
                                  <Divider />
                                  {categoriesData?.data.filter(cat => cat.status).map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                      {category.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            )}
                          />
                        </TableCell>
                        {/* Subcategory Selector */}
                        <TableCell sx={{ width: 200 }}>
                          <Controller
                            name={`products.${index}.sub_category_id`}
                            control={control}
                            render={({ field, fieldState }) => {
                              const categoryId = watch(`products.${index}.category_id`)
                              const { data: subCategoriesData, isFetching: subCategoriesLoading } = useGetSubCategories(categoryId)

                              return (
                                <FormControl fullWidth error={Boolean(fieldState.error)}>
                                  <InputLabel>
                                    {!categoryId ? "Выберите категорию" : (subCategoriesLoading || !subCategoriesData?.data.length) ? "Нет подкатегорий" : "Подкатегория"}
                                  </InputLabel>
                                  <Select
                                    label="Подкатегория"
                                    value={field.value || ''}
                                    disabled={isTransferReceipt || !categoryId || subCategoriesLoading || !subCategoriesData || !subCategoriesData?.data.length}
                                    // Allow editing subcategory for transfer_incoming
                                    startAdornment={
                                      subCategoriesLoading ? (
                                        <CircularProgress size={16} sx={{ mr: 1 }} />
                                      ) : null
                                    }
                                    onChange={(e) => {
                                      if (e.target.value === 'create_new') {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        // Don't set the value, just open the dialog
                                        openCreateSubCategory()
                                        // Keep the previous value
                                        return
                                      }
                                      field.onChange(e)
                                    }}
                                  >
                                    <MenuItem
                                      value="create_new"
                                      sx={{ color: 'primary.main' }}
                                    >
                                      <ListItemIcon>
                                        <AddIcon width={20} height={20} fill="currentColor" />
                                      </ListItemIcon>
                                      <ListItemText primary="Добавить" />
                                    </MenuItem>
                                    <Divider />
                                    {subCategoriesData?.data.map((subCategory) => (
                                      <MenuItem key={subCategory.id} value={subCategory.id}>
                                        {subCategory.name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`products.${index}.has_variations`}
                            control={control}
                            render={({ field }) => (
                              <Toggle
                                checked={field.value || false}
                                disabled={isTransferReceipt || isTransferIncoming}
                                // Disable variation toggle for transfer_incoming to prevent data integrity issues
                                onChange={(e) => {
                                  if (isTransferReceipt || isTransferIncoming) return
                                  field.onChange(e.target.checked)
                                  // Initialize variation state when toggle is turned on
                                  if (e.target.checked && !rowVariations[index]) {
                                    setRowVariations(prev => ({
                                      ...prev,
                                      [index]: {
                                        variationName: '',
                                        variationOptions: [],
                                        showOptions: false,
                                        variationDetails: {}
                                      }
                                    }))
                                  }
                                }}
                              />
                            )}
                          />
                        </TableCell>
                        {/* Show these cells only when variations are disabled */}
                        {!watch(`products.${index}.has_variations`) && (
                          <>
                            <TableCell>
                              <Controller
                                name={`products.${index}.product_code`}
                                control={control}
                                render={({ field, fieldState }) => (
                                  <FormInput
                                    control={control}
                                    label="Штрихкод"
                                    error={Boolean(fieldState.error)}
                                    helperText={fieldState.error?.message}
                                    disabled={isTransferReceipt || isTransferIncoming}
                                    {...field}
                                  />
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <Controller
                                name={`products.${index}.purchase_price`}
                                control={control}
                                render={({ field, fieldState }) => (
                                  <FormInput
                                    control={control}
                                    label="Цена закупки"
                                    error={Boolean(fieldState.error)}
                                    helperText={fieldState.error?.message}
                                    disabled={isTransferReceipt || isTransferIncoming}
                                    {...field}
                                  />
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <Controller
                                name={`products.${index}.retail_price`}
                                control={control}
                                render={({ field, fieldState }) => (
                                  <FormInput
                                    control={control}
                                    label="Цена продажи"
                                    error={Boolean(fieldState.error)}
                                    helperText={fieldState.error?.message}
                                    disabled={isTransferReceipt || isTransferIncoming}
                                    {...field}
                                  />
                                )}
                              />
                            </TableCell>
                          </>
                        )}
                        <TableCell>
                          <Controller
                            name={`products.${index}.quantity`}
                            control={control}
                            render={({ field, fieldState }) => {
                              const hasVariations = watch(`products.${index}.has_variations`)
                              const totalQuantity = hasVariations && rowVariations[index]?.variationDetails
                                ? Object.values(rowVariations[index].variationDetails).reduce(
                                    (sum, detail) => sum + (Number(detail.quantity) || 0),
                                    0
                                  )
                                : (field.value !== undefined && field.value !== null ? field.value : 0)

                              // Update the field value with total quantity when variations are enabled
                              if (hasVariations && totalQuantity !== field.value) {
                                field.onChange(totalQuantity)
                              }

                              // Ensure field value is set if it's undefined/null for non-variation products
                              if (!hasVariations && (field.value === undefined || field.value === null)) {
                                field.onChange(0)
                              }

                              return (
                                <FormInput
                                  control={control}
                                  label="Количество"
                                  error={Boolean(fieldState.error)}
                                  helperText={fieldState.error?.message}
                                  {...field}
                                  value={hasVariations ? totalQuantity : (field.value ?? 0)}
                                  disabled={hasVariations || isTransferReceipt || isTransferIncoming}
                                />
                              )
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box
                            onClick={() => !(isTransferReceipt || isTransferIncoming) && remove(index)}
                            sx={{
                              width: 40,
                              height: 40,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: (isTransferReceipt || isTransferIncoming) ? 'not-allowed' : 'pointer',
                              opacity: (isTransferReceipt || isTransferIncoming) ? 0.5 : 1,
                              transition: 'all 0.2s',
                              borderRadius: 1,
                              '&:hover': {
                                backgroundColor: (isTransferReceipt || isTransferIncoming) ? 'transparent' : 'rgba(240, 82, 82, 0.08)',
                              },
                            }}
                          >
                            <DeleteIcon
                              width={20}
                              height={20}
                              stroke={(isTransferReceipt || isTransferIncoming) ? 'rgba(0, 0, 0, 0.26)' : '#F05252'}
                            />
                          </Box>
                        </TableCell>
                      </TableRow>

                      {/* Variation Input Row */}
                      {watch(`products.${index}.has_variations`) && (
                        <TableRow>
                          <TableCell colSpan={10} sx={{ py: 2, px: 0, bgcolor: 'grey.50' }}>
                            <Box>
                              {/* Variation Name Input */}
                              {!rowVariations[index]?.showOptions && (
                                <Stack direction="row" spacing={2} alignItems="center">
                                  <TextField
                                    fullWidth
                                    label="Введите название вариации (Например: Размер или объем)"
                                    value={rowVariations[index]?.variationName || ''}
                                    disabled={isTransferReceipt || isTransferIncoming}
                                    onChange={(e) => {
                                      setRowVariations(prev => ({
                                        ...prev,
                                        [index]: {
                                          ...prev[index],
                                          variationName: e.target.value
                                        }
                                      }))
                                    }}
                                  />
                                  <Button
                                    variant="contained"
                                    onClick={() => {
                                      if (rowVariations[index]?.variationName) {
                                        setRowVariations(prev => ({
                                          ...prev,
                                          [index]: {
                                            ...prev[index],
                                            showOptions: true
                                          }
                                        }))
                                      }
                                    }}
                                    disabled={isTransferReceipt || isTransferIncoming || !rowVariations[index]?.variationName}
                                    sx={{ minWidth: 120 }}
                                  >
                                    Применить
                                  </Button>
                                </Stack>
                              )}

                              {/* Variation Options Input */}
                              {rowVariations[index]?.showOptions && (
                                <Stack spacing={2}>
                                  <Stack direction="row" spacing={2} alignItems="center">
                                    <TextField
                                      value={rowVariations[index]?.variationName || ''}
                                    disabled={isTransferReceipt || isTransferIncoming}
                                    onChange={(e) => {
                                      setRowVariations(prev => ({
                                          ...prev,
                                          [index]: {
                                            ...prev[index],
                                            variationName: e.target.value
                                          }
                                        }))
                                      }}
                                      sx={{
                                        minWidth: '300px',
                                        flexShrink: 0,
                                      }}
                                    />
                                      <MuiChipsInput
                                        value={rowVariations[index]?.variationOptions?.map(opt => opt.name) || []}
                                        disabled={isTransferReceipt || isTransferIncoming}
                                        onChange={(newChips) => {
                                          // Create a map of existing chip names to their IDs to preserve them
                                          const existingOptions = rowVariations[index]?.variationOptions || []
                                          const nameToIdMap = new Map<string, string>()

                                          existingOptions.forEach(opt => {
                                            nameToIdMap.set(opt.name, opt.id)
                                          })

                                          // Create options, reusing existing IDs where possible
                                          let chipCounter = 0
                                          const newOptions = newChips.map((name) => {
                                            // If this chip name already exists, reuse its ID
                                            if (nameToIdMap.has(name)) {
                                              // Remove from map so next duplicate gets new ID
                                              const existingId = nameToIdMap.get(name)!
                                              nameToIdMap.delete(name)
                                              return {
                                                id: existingId,
                                                name: name
                                              }
                                            }
                                            // Otherwise create a new ID for new chips
                                            chipCounter++
                                            return {
                                              id: `${name}_${Date.now()}_${chipCounter}`,
                                              name: name
                                            }
                                          })

                                          // Preserve existing variation details
                                          const newDetails = { ...rowVariations[index]?.variationDetails || {} }

                                          // Initialize variation details only for genuinely new options
                                          newOptions.forEach((option) => {
                                            if (!newDetails[option.id]) {
                                              newDetails[option.id] = {
                                                attributeId: '',
                                                attributeValue: '',
                                                costPrice: '',
                                                salePrice: '',
                                                quantity: '',
                                                barcode: '',
                                              }
                                            }
                                          })

                                          // Remove details only for deleted options
                                          const newOptionIds = new Set(newOptions.map(opt => opt.id))
                                          Object.keys(newDetails).forEach((key) => {
                                            if (!newOptionIds.has(key)) {
                                              delete newDetails[key]
                                            }
                                          })

                                          setRowVariations(prev => ({
                                            ...prev,
                                            [index]: {
                                              ...prev[index],
                                              variationOptions: newOptions,
                                              variationDetails: newDetails
                                            }
                                          }))
                                        }}
                                        placeholder={`Введите тип вариации "${rowVariations[index]?.variationName || 'Размер'}" - Например: Большой/Маленький или X/M/L...`}
                                        fullWidth
                                      />
                                    </Stack>

                                  {/* Variation Detail Rows */}
                                  {rowVariations[index]?.variationOptions.length > 0 && (
                                    <Stack spacing={2} sx={{ mt: 2 }}>
                                      {rowVariations[index]?.variationOptions.map((option) => {
                                        const details = rowVariations[index]?.variationDetails?.[option.id] || {
                                          attributeId: '',
                                          attributeValue: '',
                                          costPrice: '',
                                          salePrice: '',
                                          quantity: '',
                                          barcode: '',
                                        }

                                        return (
                                          <Grid
                                            key={option.id}
                                            container
                                            spacing={2}
                                            alignItems="center"
                                            sx={{
                                              bgcolor: 'background.paper',
                                              p: 1,
                                              borderRadius: 1,
                                            }}
                                          >
                                            {/* Type Label */}
                                            <Grid item xs={12} sm={2}>
                                              <TextField
                                                value={option.name}
                                                label="Тип вариации"
                                                disabled
                                                fullWidth
                                                sx={{
                                                  '& .MuiOutlinedInput-root': {
                                                    bgcolor: 'grey.50',
                                                  },
                                                }}
                                              />
                                            </Grid>

                                            {/* Attribute Selector */}
                                            <Grid item xs={12} sm={2}>
                                              <FormControl fullWidth>
                                                <InputLabel>Атрибут</InputLabel>
                                                <Select
                                                  label="Атрибут"
                                                  value={typeof details.attributeId === 'string' && details.attributeId === 'create_new' ? details.attributeId : (details.attributeId || '')}
                                                  disabled={isTransferReceipt || isTransferIncoming || attributesLoading}
                                                  onChange={(e) => {
                                                    if (e.target.value === 'create_new') {
                                                      e.preventDefault()
                                                      e.stopPropagation()
                                                      // Don't set the value, just open the dialog
                                                      openCreateAttribute()
                                                      // Keep the previous value
                                                      return
                                                    }
                                                    setRowVariations(prev => ({
                                                      ...prev,
                                                      [index]: {
                                                        ...prev[index],
                                                        variationDetails: {
                                                          ...prev[index].variationDetails,
                                                          [option.id]: {
                                                            ...prev[index].variationDetails[option.id],
                                                            attributeId: e.target.value,
                                                            attributeValue: '',
                                                          }
                                                        }
                                                      }
                                                    }))
                                                  }}
                                                >
                                                  <MenuItem
                                                    value="create_new"
                                                    sx={{ color: 'primary.main' }}
                                                  >
                                                    <ListItemIcon>
                                                      <AddIcon width={20} height={20} fill="currentColor" />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Добавить" />
                                                  </MenuItem>
                                                  <Divider />
                                                  {attributesData?.data.map((attribute) => (
                                                    <MenuItem key={attribute.id} value={attribute.id}>
                                                      {attribute.name}
                                                    </MenuItem>
                                                  ))}
                                                </Select>
                                              </FormControl>
                                            </Grid>

                                            {/* Attribute Value */}
                                            <Grid item xs={12} sm={2}>
                                              <TextField
                                                value={details.attributeValue}
                                    disabled={isTransferReceipt || isTransferIncoming}
                                    onChange={(e) => {
                                      setRowVariations(prev => ({
                                                    ...prev,
                                                    [index]: {
                                                      ...prev[index],
                                                      variationDetails: {
                                                        ...prev[index].variationDetails,
                                                        [option.id]: {
                                                          ...prev[index].variationDetails[option.id],
                                                          attributeValue: e.target.value
                                                        }
                                                      }
                                                    }
                                                  }))
                                                }}
                                                label="Значение атрибута"
                                                fullWidth
                                                placeholder="например: Красный"
                                              />
                                            </Grid>

                                            {/* Cost Price */}
                                            <Grid item xs={6} sm={1.5}>
                                              <TextField
                                                value={details.costPrice}
                                                disabled={isTransferReceipt || isTransferIncoming}
                                                onChange={(e) => {
                                                  const value = e.target.value.replace(',', '.')
                                                  setRowVariations(prev => ({
                                                    ...prev,
                                                    [index]: {
                                                      ...prev[index],
                                                      variationDetails: {
                                                        ...prev[index].variationDetails,
                                                        [option.id]: {
                                                          ...prev[index].variationDetails[option.id],
                                                          costPrice: value
                                                        }
                                                      }
                                                    }
                                                  }))
                                                }}
                                                label="Себест."
                                                fullWidth
                                              />
                                            </Grid>

                                            {/* Sale Price */}
                                            <Grid item xs={6} sm={1.5}>
                                              <TextField
                                                value={details.salePrice}
                                                disabled={isTransferReceipt || isTransferIncoming}
                                                onChange={(e) => {
                                                  const value = e.target.value.replace(',', '.')
                                                  setRowVariations(prev => ({
                                                    ...prev,
                                                    [index]: {
                                                      ...prev[index],
                                                      variationDetails: {
                                                        ...prev[index].variationDetails,
                                                        [option.id]: {
                                                          ...prev[index].variationDetails[option.id],
                                                          salePrice: value
                                                        }
                                                      }
                                                    }
                                                  }))
                                                }}
                                                label="Продажа"
                                                fullWidth
                                              />
                                            </Grid>

                                            {/* Quantity */}
                                            <Grid item xs={6} sm={1.5}>
                                              <TextField
                                                value={details.quantity}
                                                disabled={isTransferReceipt || isTransferIncoming}
                                                onChange={(e) => {
                                                  const value = e.target.value.replace(',', '.')
                                                  setRowVariations(prev => ({
                                                    ...prev,
                                                    [index]: {
                                                      ...prev[index],
                                                      variationDetails: {
                                                        ...prev[index].variationDetails,
                                                        [option.id]: {
                                                          ...prev[index].variationDetails[option.id],
                                                          quantity: value
                                                        }
                                                      }
                                                    }
                                                  }))
                                                }}
                                                label="Кол-во"
                                                fullWidth
                                              />
                                            </Grid>

                                            {/* Barcode */}
                                            <Grid item xs={6} sm={1.5}>
                                              <TextField
                                                value={details.barcode}
                                    disabled={isTransferReceipt || isTransferIncoming}
                                    onChange={(e) => {
                                      setRowVariations(prev => ({
                                                    ...prev,
                                                    [index]: {
                                                      ...prev[index],
                                                      variationDetails: {
                                                        ...prev[index].variationDetails,
                                                        [option.id]: {
                                                          ...prev[index].variationDetails[option.id],
                                                          barcode: e.target.value
                                                        }
                                                      }
                                                    }
                                                  }))
                                                }}
                                                label="Штрихкод"
                                                fullWidth
                                              />
                                            </Grid>
                                          </Grid>
                                        )
                                      })}
                                    </Stack>
                                  )}
                                </Stack>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                      </Fragment>
                    ))}
                  </TableBody>
                </Table>
            </TableContainer>
          )}

          {!(isTransferReceipt || isTransferIncoming) && (
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<PlusIcon style={{ width: 20, height: 20 }} />}
                onClick={() => {
                  append({product_id: null, product_name: '', category_id: 0, sub_category_id: null, product_code: '', has_variations: false, purchase_price: 0, retail_price: 0, quantity: 0, image: null})
                }}
                sx={{
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(0, 84, 86, 0.04)',
                  },
                  '& svg': {
                    stroke: 'rgba(0, 0, 0, 0.54)',
                  },
                }}
              >
                Добавить товар
              </Button>
            </Box>
          )}
        </Stack>
      </Board>
      <Stack
        direction="row"
        spacing="16px"
        justifyContent="flex-end"
      >
        {!(isTransferReceipt || isTransferIncoming) && (
          <>
            <Button
              type="submit"
              size={isMobile ? 'small' : 'medium'}
              sx={{ width: 200 }}
            >
              Сохранить
            </Button>
            {!isRefund && (
              <Button
                type="button"
                size={isMobile ? 'small' : 'medium'}
                onClick={handleSubmit(onSubmitAndConduct, onError)}
                sx={(theme) => ({
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    width: 200,
                    '&:hover': {
                      color: theme.palette.primary.contrastText
                    }
                  })
                }
              >
                Сохранить и провести
              </Button>
            )}
            {isRefund && (
              <Button
                type="button"
                size={isMobile ? 'small' : 'medium'}
                onClick={handleSubmit(onSubmitAndConduct, onError)}
                sx={(theme) => ({
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    width: 200,
                    '&:hover': {
                      color: theme.palette.primary.contrastText
                    }
                  })
                }
              >
                Принять возврат
              </Button>
            )}
          </>
        )}
        {isTransferIncoming && !isCompleted && (
          <>
            <Button
              type="submit"
              size={isMobile ? 'small' : 'medium'}
              sx={{ width: 200 }}
            >
              Сохранить
            </Button>
            <Button
              type="button"
              size={isMobile ? 'small' : 'medium'}
              onClick={handleSubmit(onSubmitAndConduct, onError)}
              sx={(theme) => ({
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  width: 200,
                  '&:hover': {
                    color: theme.palette.primary.contrastText
                  }
                })
              }
            >
              Сохранить и провести
            </Button>
            <Button
              type="button"
              size={isMobile ? 'small' : 'medium'}
              onClick={() => setRefundDialogOpen(true)}
              sx={(theme) => ({
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                  color: theme.palette.error.main,
                  width: 200,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.error.main, 0.2),
                  }
                })
              }
            >
              Возврат
            </Button>
          </>
        )}
        {isTransferIncoming && isCompleted && (
          <Button
            type="button"
            size={isMobile ? 'small' : 'medium'}
            onClick={() => setRefundDialogOpen(true)}
            sx={(theme) => ({
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
                width: 200,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.error.main, 0.2),
                }
              })
            }
          >
            Возврат
          </Button>
        )}
        <Button
          variant="outlined"
          size={isMobile ? 'small' : 'medium'}
          sx={{ width: 200 }}
          component={Link}
          to={RouterPaths.warehouse + '?report=arrival'}
        >
          Отмена
        </Button>
      </Stack>
      <CreateCategoryDialog />
      <CreateSubCategoryDialog />
      <CreateAttributeDialog />
      
      {/* Refund Selection Dialog */}
      <Dialog
        open={refundDialogOpen}
        onClose={() => !isRefunding && setRefundDialogOpen(false)}
        aria-labelledby="refund-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="refund-dialog-title">
          Выбор товаров для возврата
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Выберите товары и количество для возврата. Вы можете вернуть все товары или выбрать частичный возврат.
          </DialogContentText>
          
          {(() => {
            // For transfer_incoming receipts, products might be in items array
            // Convert items to products format if products is empty
            let productsToShow: any[] = []
            
            if (data?.data?.products && data.data.products.length > 0) {
              productsToShow = data.data.products
            } else if (data?.data?.items && data.data.items.length > 0) {
              // Convert items to products format
              // Group items by product_id to handle variations
              const productMap = new Map<number, any>()
              
              data.data.items.forEach((item: any) => {
                const productId = item.product?.id
                if (!productId) return
                
                if (!productMap.has(productId)) {
                  // Create product entry
                  productMap.set(productId, {
                    id: productId,
                    product_id: productId,
                    name: item.product?.name || '',
                    product_name: item.product?.name || '',
                    image: item.image || item.product?.image || null,
                    product_code: item.product?.code || null,
                    code: item.product?.code || null,
                    quantity: 0,
                    variations: [],
                    variationMap: new Map() // Track variations by variation_id to avoid duplicates
                  })
                }
                
                const product = productMap.get(productId)!
                
                if (item.variation) {
                  // Product has a variation - this item represents a specific variation
                  const variationId = item.variation.variation_id || item.variation.id?.toString()
                  
                  if (!product.variationMap.has(variationId)) {
                    // Add new variation
                    const variation = {
                      item_id: item.id,
                      product_variation_id: item.variation.id,
                      variation_id: item.variation.variation_id,
                      variation_type: item.product?.variation_name || item.variation.variation_type || '',
                      attribute_value: item.variation.attribute_value || '',
                      quantity: item.quantity || 0,
                      barcode: item.variation.barcode || null
                    }
                    product.variations.push(variation)
                    product.variationMap.set(variationId, variation)
                  } else {
                    // Update existing variation quantity
                    const existingVariation = product.variationMap.get(variationId)!
                    existingVariation.quantity += item.quantity || 0
                  }
                  product.quantity += item.quantity || 0
                } else if (item.product?.variations && item.product.variations.length > 0) {
                  // Product has variations array - use all variations from product
                  if (product.variations.length === 0) {
                    // Only set variations once
                    product.variations = item.product.variations.map((v: any) => ({
                      item_id: v.id || item.id,
                      product_variation_id: v.id,
                      variation_id: v.variation_id,
                      variation_type: v.variation_type || v.type_name || '',
                      attribute_value: v.attribute_value || '',
                      quantity: v.quantity || 0,
                      barcode: v.barcode || null
                    }))
                  }
                  product.quantity = item.quantity || 0
                } else {
                  // Product without variations
                  product.quantity += item.quantity || 0
                }
              })
              
              // Clean up variationMap (not needed in final structure)
              productsToShow.forEach((p: any) => delete p.variationMap)
              
              productsToShow = Array.from(productMap.values())
            }
            
            return productsToShow.length > 0 ? (
              <Stack spacing={2}>
                {productsToShow.map((product) => {
                // Handle both ArrivalProduct structure (product_id) and TransferProduct structure (id)
                const productId = (product as any).id || (product as any).product_id
                const productName = (product as any).name || (product as any).product_name || 'Без названия'
                const productImage = (product as any).image || null
                const productCode = (product as any).product_code || (product as any).code || null
                // Check for variations - could be in variations array or variation_details
                const variations = (product as any).variations || (product as any).variation_details || []
                const hasVariations = variations && variations.length > 0
                const productQuantity = (product as any).quantity || 0
                const currentSelection = refundSelections[productId] || {}
                
                return (
                  <Paper key={productId} elevation={1} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      {productImage && (
                        <Box
                          component="img"
                          src={`${import.meta.env.VITE_APP_BACK_URL}/storage/product/${productImage}`}
                          alt={productName}
                          sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }}
                        />
                      )}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6">{productName}</Typography>
                        {productCode && (
                          <Typography variant="body2" color="text.secondary">
                            Код: {productCode}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    
                    {!hasVariations ? (
                      // Product without variations - simple quantity input
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={(currentSelection.quantity || 0) > 0}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    // When checked, set to max quantity by default
                                    setRefundSelections(prev => ({
                                      ...prev,
                                      [productId]: {
                                        ...prev[productId],
                                        quantity: productQuantity
                                      }
                                    }))
                                  } else {
                                    // When unchecked, remove from selection
                                    setRefundSelections(prev => {
                                      const newSelections = { ...prev }
                                      if (newSelections[productId]) {
                                        delete newSelections[productId].quantity
                                        if (!newSelections[productId].variations || Object.keys(newSelections[productId].variations || {}).length === 0) {
                                          delete newSelections[productId]
                                        }
                                      }
                                      return newSelections
                                    })
                                  }
                                }}
                              />
                            }
                            label={
                              <Typography variant="body1" fontWeight={600}>
                                Вернуть товар
                              </Typography>
                            }
                          />
                          {(currentSelection.quantity || 0) > 0 && (
                            <Typography variant="body2" color="text.secondary">
                              (Доступно: {productQuantity} шт.)
                            </Typography>
                          )}
                        </Box>
                        {(currentSelection.quantity || 0) > 0 && (
                          <Box sx={{ ml: 4 }}>
                            <TextField
                              type="number"
                              label="Количество для возврата"
                              size="small"
                              value={currentSelection.quantity || 0}
                              onChange={(e) => {
                                const qty = Math.max(0, Math.min(Number(e.target.value), productQuantity))
                                setRefundSelections(prev => ({
                                  ...prev,
                                  [productId]: {
                                    ...prev[productId],
                                    quantity: qty
                                  }
                                }))
                              }}
                              inputProps={{ min: 0, max: productQuantity }}
                              helperText={`Максимум: ${productQuantity} шт.`}
                              fullWidth
                            />
                          </Box>
                        )}
                      </Box>
                    ) : (
                      // Product with variations - accordion with variation selection
                      <Accordion defaultExpanded>
                        <AccordionSummary
                          expandIcon={<ChevronDownIcon width={20} height={20} />}
                        >
                          <Typography variant="body1" fontWeight={600}>
                            Вариации ({variations.length})
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Stack spacing={2}>
                            {variations.map((variation: any) => {
                              // Use item_id as primary identifier, fallback to product_variation_id or variation_id
                              const variationId = variation.item_id?.toString() || variation.product_variation_id?.toString() || variation.variation_id || ''
                              const variationQty = currentSelection.variations?.[variationId] || 0
                              
                              return (
                                <Box key={variationId} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: variationQty > 0 ? 2 : 0 }}>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={variationQty > 0}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              // When checked, set to max quantity by default
                                              setRefundSelections(prev => ({
                                                ...prev,
                                                [productId]: {
                                                  ...prev[productId],
                                                  variations: {
                                                    ...prev[productId]?.variations,
                                                    [variationId]: variation.quantity || 0
                                                  }
                                                }
                                              }))
                                            } else {
                                              // When unchecked, remove from selection
                                              setRefundSelections(prev => {
                                                const newSelections = { ...prev }
                                                if (newSelections[productId]?.variations) {
                                                  delete newSelections[productId].variations![variationId]
                                                  if (Object.keys(newSelections[productId].variations || {}).length === 0) {
                                                    delete newSelections[productId].variations
                                                    if (!newSelections[productId].quantity) {
                                                      delete newSelections[productId]
                                                    }
                                                  }
                                                }
                                                return newSelections
                                              })
                                            }
                                          }}
                                        />
                                      }
                                      label={
                                        <Box>
                                          <Typography variant="body2" fontWeight={600}>
                                            {variation.variation_type} - {variation.attribute_value}
                                          </Typography>
                                          <Typography variant="caption" color="text.secondary">
                                            Доступно: {variation.quantity || 0} шт.
                                          </Typography>
                                        </Box>
                                      }
                                    />
                                  </Box>
                                  {variationQty > 0 && (
                                    <Box sx={{ ml: 4 }}>
                                      <TextField
                                        type="number"
                                        label="Количество для возврата"
                                        size="small"
                                        value={variationQty}
                                        onChange={(e) => {
                                          const qty = Math.max(0, Math.min(Number(e.target.value), variation.quantity || 0))
                                          setRefundSelections(prev => ({
                                            ...prev,
                                            [productId]: {
                                              ...prev[productId],
                                              variations: {
                                                ...prev[productId]?.variations,
                                                [variationId]: qty
                                              }
                                            }
                                          }))
                                        }}
                                        inputProps={{ min: 0, max: variation.quantity || 0 }}
                                        helperText={`Максимум: ${variation.quantity || 0} шт.`}
                                        fullWidth
                                      />
                                    </Box>
                                  )}
                                </Box>
                              )
                            })}
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </Paper>
                )
              })}
            </Stack>
          ) : (
            <Typography color="text.secondary">Нет товаров для возврата</Typography>
          )
          })()}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setRefundDialogOpen(false)
              setRefundSelections({})
            }}
            disabled={isRefunding}
          >
            Отмена
          </Button>
          <Button
            onClick={() => {
              // Build refund payload
              const refundItems: any[] = []
              
              // Get products list (from products or items) - same logic as in dialog
              let productsList: any[] = []
              if (data?.data?.products && data.data.products.length > 0) {
                productsList = data.data.products
              } else if (data?.data?.items && data.data.items.length > 0) {
                // Convert items to products format
                const productMap = new Map<number, any>()
                data.data.items.forEach((item: any) => {
                  const productId = item.product?.id
                  if (!productId) return
                  
                  if (!productMap.has(productId)) {
                    productMap.set(productId, {
                      id: productId,
                      product_id: productId,
                      variations: []
                    })
                  }
                  
                  const product = productMap.get(productId)!
                  
                  if (item.variation) {
                    product.variations.push({
                      item_id: item.id,
                      product_variation_id: item.variation.id,
                      variation_id: item.variation.variation_id,
                      ...item.variation
                    })
                  } else if (item.product?.variations && item.product.variations.length > 0) {
                    product.variations = item.product.variations.map((v: any) => ({
                      item_id: v.id,
                      product_variation_id: v.id,
                      variation_id: v.variation_id,
                      ...v
                    }))
                  }
                })
                productsList = Array.from(productMap.values())
              }
              
              Object.entries(refundSelections).forEach(([productId, selection]) => {
                // Handle both ArrivalProduct structure (product_id) and TransferProduct structure (id)
                const product = productsList.find((p: any) => 
                  (p.id === Number(productId)) || (p.product_id === Number(productId))
                )
                if (!product) return
                
                if (selection.quantity !== undefined && selection.quantity > 0) {
                  // Product without variations
                  refundItems.push({
                    product_id: Number(productId),
                    quantity: selection.quantity
                  })
                }
                
                if (selection.variations) {
                  // Products with variations
                  Object.entries(selection.variations).forEach(([variationId, qty]) => {
                    if (qty > 0) {
                      // Handle both variation_details and variations arrays
                      const variationsArray = (product as any).variations || (product as any).variation_details || []
                      const variation = variationsArray.find((v: any) => {
                        const vId = v.item_id?.toString() || v.product_variation_id?.toString() || v.variation_id || ''
                        return vId === variationId
                      })
                      if (variation) {
                        // Use item_id or product_variation_id for the refund API
                        refundItems.push({
                          product_id: Number(productId),
                          item_id: variation.item_id,
                          product_variation_id: variation.product_variation_id,
                          quantity: qty
                        })
                      }
                    }
                  })
                }
              })
              
              if (refundItems.length === 0) {
                toast.error('Выберите хотя бы один товар для возврата')
                return
              }
              
              refundReceipt({ refund: true, items: refundItems } as any)
            }}
            color="error"
            variant="contained"
            disabled={isRefunding}
            autoFocus
          >
            {isRefunding ? 'Выполняется...' : 'Подтвердить возврат'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}