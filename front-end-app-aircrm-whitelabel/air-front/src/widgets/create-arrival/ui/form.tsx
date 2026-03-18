import { useEffect, useState, Fragment, useRef } from 'react'
import { Controller, SubmitHandler, useForm, useFieldArray } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Button,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  alpha,
  useTheme,
  useMediaQuery,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import { MuiChipsInput } from 'mui-chips-input'
import PlusIcon from '@icons/plus.svg?react'
import DeleteIcon from '@icons/delete.svg?react'
import AddIcon from '@icons/add-fill.svg?react'
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
import { ApiKeys, getApiPaths, postQuery } from '@shared/api'
import { RouterPaths } from '@shared/lib'
import { Board, FormInput } from '@shared/ui'
import { Toggle } from '@shared/ui/form'
import { AutocompleteSearch } from '@features/create-arrival/'
import { ImportArrivalButton, ParsedProduct } from '@features/products/import'
import { ExportProductsTemplate } from '@features/products/export-template/index'
import { CreateCategoryDialog } from '@features/categories'
import { useStore as useCategoryStore } from '@features/categories/create-update/model/store'
import { CreateSubCategoryDialog } from '@features/sub-categories'
import { useStore as useSubCategoryStore } from '@features/sub-categories/create-update/model/store'
import { CreateAttributeDialog } from '@features/attributes'
import { useStore as useAttributeStore } from '@features/attributes/create-update/model/store'

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
  status: 'pending',
  warehouse_id: 0,
}

export const Form = () => {
  const [productPhotos, setProductPhotos] = useState<{ [key: number]: File | null }>({})
  const openCreateCategory = useCategoryStore((state) => state.openCreate)
  const openCreateSubCategory = useSubCategoryStore((state) => state.openCreate)
  const openCreateAttribute = useAttributeStore((state) => state.openCreate)

  const getDefaultValues = () => {
    if (location.state?.from === 'product') {
      return {
        ...JSON.parse(localStorage.getItem('new-arrival') as string),
        products: [
          ...JSON.parse(localStorage.getItem('new-arrival') as string).products,
          {
            product_id: location.state.productId,
            product_name: location.state.productName
          }
        ]
      }
    }
    return defaultValues
  }

  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))

  // Fetch attributes for variation details
  const { data: attributesData, isLoading: attributesLoading } = useGetAttributes({
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  // Fetch categories for product categorization (with perPage=100 to get all categories)
  const { data: categoriesData, isFetching: categoriesLoading } = useGetCategories(100)

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    getValues,
  } = useForm<ArrivalDto>({
    defaultValues: getDefaultValues() as unknown as ArrivalDto,
    resolver: yupResolver(createArrivalSchema),
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products'
  })

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

  // Track if initial row has been added to prevent duplicates in React StrictMode
  const hasInitialRowRef = useRef(false)

  // Add initial empty row on mount (only once)
  useEffect(() => {
    if (!hasInitialRowRef.current && fields.length === 0 && !location.state?.from) {
      hasInitialRowRef.current = true
      append({product_id: null, product_name: '', category_id: 0, sub_category_id: null, product_code: '', has_variations: false, purchase_price: 0, retail_price: 0, quantity: 0, image: null})
    }
  }, [fields.length, location.state?.from, append])

  // Handle imported data from Excel
  const handleImport = (importedProducts: ParsedProduct[]) => {
    // Clear existing products
    remove()

    // Add imported products
    importedProducts.forEach((product, index) => {
      append({
        product_id: null,
        product_name: product.product_name,
        category_id: product.category_id,
        sub_category_id: product.sub_category_id,
        product_code: product.product_code || '',
        has_variations: product.has_variations,
        purchase_price: product.purchase_price || 0,
        retail_price: product.retail_price || 0,
        quantity: product.quantity || 0,
        image: null
      })

      // If product has variations, set up variation state
      if (product.has_variations && product.variationName && product.variationOptions && product.variationDetails) {
        setRowVariations(prev => ({
          ...prev,
          [index]: {
            variationName: product.variationName!,
            variationOptions: product.variationOptions!,
            showOptions: true,
            variationDetails: product.variationDetails!
          }
        }))
      }
    })
  }

  const { mutate } = useMutation({
    mutationKey: [ApiKeys.WarehouseReports.createReceipt],
    mutationFn: postQuery(getApiPaths().createReceipt),
  })

  const onSubmit: SubmitHandler<ArrivalDto> = (dto) => {
    // Create FormData to send actual files
    const formData = new FormData()

    // Add basic fields
    formData.append('name', dto.name)
    formData.append('counterparty_id', dto.counterparty_id.toString())
    formData.append('warehouse_id', dto.warehouse_id.toString())
    formData.append('status', dto.status || 'pending')

    // Add products with their images and variations
    dto.products?.forEach((product, index) => {
      // Add product fields
      if (product.product_id) {
        formData.append(`products[${index}][product_id]`, product.product_id.toString())
      }
      formData.append(`products[${index}][product_name]`, product.product_name || '')
      formData.append(`products[${index}][category_id]`, product.category_id?.toString() || '0')
      if (product.sub_category_id) {
        formData.append(`products[${index}][sub_category_id]`, product.sub_category_id.toString())
      }
      if (product.product_code) {
        formData.append(`products[${index}][product_code]`, product.product_code)
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
            formData.append(`products[${index}][variation_details][${detailIndex}][attribute_id]`, detail.attributeId.toString())
            formData.append(`products[${index}][variation_details][${detailIndex}][attribute_value]`, detail.attributeValue)
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
        localStorage.removeItem('new-arrival')
        toast.success('Накладная успешно создана')
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
  }

  return (
    <Stack
      component="form"
      spacing="24px"
      onSubmit={handleSubmit(onSubmit, onError)}
    >
      <CreateArrivalGeneral control={control} setValue={setValue} />
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
          <Stack direction='row' spacing={2} alignItems='center'>
            <WarehouseSelect control={control} />
            <ImportArrivalButton onImport={handleImport} />
            <ExportProductsTemplate />
          </Stack>
        </Stack>
        <Stack py={2} sx={{ rowGap: 3 }}>
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
                            cursor: 'pointer',
                            overflow: 'hidden',
                            position: 'relative',
                            '&:hover': {
                              opacity: 0.8,
                            },
                          }}
                        >
                          <input
                            id={`photo-upload-${index}`}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
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
                                {...field}
                                disabled={categoriesLoading || !categoriesData}
                                startAdornment={
                                  categoriesLoading ? (
                                    <CircularProgress size={16} sx={{ mr: 1 }} />
                                  ) : null
                                }
                                onChange={(e) => {
                                  if (e.target.value === 'create_new') {
                                    openCreateCategory()
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
                                  {!categoryId ? "Подкатегория" : (subCategoriesLoading || !subCategoriesData?.data.length) ? "Нет подкатегорий" : "Подкатегория"}
                                </InputLabel>
                                <Select
                                  label="Подкатегория"
                                  {...field}
                                  disabled={!categoryId || subCategoriesLoading}
                                  startAdornment={
                                    subCategoriesLoading ? (
                                      <CircularProgress size={16} sx={{ mr: 1 }} />
                                    ) : null
                                  }
                                  onChange={(e) => {
                                    if (e.target.value === 'create_new') {
                                      openCreateSubCategory()
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
                              onChange={(e) => {
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
                              : field.value || 0

                            // Update the field value with total quantity when variations are enabled
                            if (hasVariations && totalQuantity !== field.value) {
                              field.onChange(totalQuantity)
                            }

                            return (
                              <FormInput
                                control={control}
                                label="Количество"
                                error={Boolean(fieldState.error)}
                                helperText={fieldState.error?.message}
                                {...field}
                                value={hasVariations ? totalQuantity : field.value}
                                disabled={hasVariations}
                              />
                            )
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          onClick={() => remove(index)}
                          sx={{
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            borderRadius: 1,
                            '&:hover': {
                              backgroundColor: 'rgba(240, 82, 82, 0.08)',
                            },
                          }}
                        >
                          <DeleteIcon
                            width={20}
                            height={20}
                            stroke="#F05252"
                          />
                        </Box>
                      </TableCell>
                    </TableRow>

                    {/* Variation Input Row */}
                    {watch(`products.${index}.has_variations`) && (
                      <TableRow>
                        <TableCell colSpan={8} sx={{ py: 2, px: 0, bgcolor: 'grey.50' }}>
                          <Box>
                            {/* Variation Name Input */}
                            {!rowVariations[index]?.showOptions && (
                              <Stack direction="row" spacing={2} alignItems="center">
                                <TextField
                                  fullWidth
                                  label="Введите название вариации (Например: Размер или объем)"
                                  value={rowVariations[index]?.variationName || ''}
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
                                  disabled={!rowVariations[index]?.variationName}
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
                                      onChange={(newChips) => {
                                        // Preserve existing IDs and only create new IDs for new chips
                                        const existingOptions = rowVariations[index]?.variationOptions || []

                                        // Create a map to track which existing chips we've already matched
                                        const usedExistingIds = new Set<string>()

                                        const newOptions = newChips.map((name, idx) => {
                                          // Find an existing option with this name that hasn't been used yet
                                          const existingOption = existingOptions.find(
                                            opt => opt.name === name && !usedExistingIds.has(opt.id)
                                          )

                                          if (existingOption) {
                                            // Mark this existing option as used
                                            usedExistingIds.add(existingOption.id)
                                            return {
                                              id: existingOption.id,
                                              name: name
                                            }
                                          }

                                          // Otherwise create a new ID for new chip
                                          return {
                                            id: `${name}_${Date.now()}_${idx}_${Math.random()}`,
                                            name: name
                                          }
                                        })

                                        // Initialize variation details for new options
                                        const newDetails = { ...rowVariations[index]?.variationDetails || {} }
                                        const existingIds = new Set(Object.keys(newDetails))

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

                                        // Remove details for deleted options
                                        const newOptionIds = new Set(newOptions.map(opt => opt.id))
                                        Object.keys(newDetails).forEach((key) => {
                                          if (!newOptionIds.has(key) && existingIds.has(key)) {
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
                                                value={details.attributeId}
                                                onChange={(e) => {
                                                  if (e.target.value === 'create_new') {
                                                    openCreateAttribute()
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
                                                disabled={attributesLoading}
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
        </Stack>
      </Board>
      <Stack
        direction="row"
        spacing="16px"
        justifyContent="flex-end"
      >
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
          onClick={handleSubmit(onSubmitAndConduct)}
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
          variant="outlined"
          size={isMobile ? 'small' : 'medium'}
          sx={{ width: 200 }}
          component={Link}
          to={RouterPaths.warehouse + '?report=receipt'}
        >
          Отмена
        </Button>
      </Stack>
      <CreateCategoryDialog />
      <CreateSubCategoryDialog />
      <CreateAttributeDialog />
    </Stack>
  )
}