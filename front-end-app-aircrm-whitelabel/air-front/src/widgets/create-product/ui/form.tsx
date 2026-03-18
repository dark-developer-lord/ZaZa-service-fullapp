import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Stack, useMediaQuery, useTheme } from '@mui/material'
import { AxiosError } from 'axios'

import {
  CreateProductDto,
  CreateProductGeneral,
  CreateProductPrice,
  createProductSchema,
  transformCreateProductDto,
} from '@features/create-update-product'
import { Variations } from '@features/create-update-product/ui/variations'
import { SingleProductVariation } from '@features/create-update-product/ui/variations/single-product-variation'
import { DocumentProcessing } from '@features/create-update-product/ui/document-processing'
import { VariationDetail, VariationType } from '@features/create-update-product/model/variation-types'
import { useGetAttributes } from '@entities/attribute'
import { ApiKeys, getApiPaths, postQuery } from '@shared/api'
import { RouterPaths } from '@shared/lib'
import LoadingButton from '@mui/lab/LoadingButton'

const defaultValues: Partial<
  Record<keyof CreateProductDto, string | number | number[] | string[] | null>
> = {
  image: '',
  name: '',
  description: '',
  product_code: '',
  purchase_price: '',
  price: '',
  quantity: '',
  warehouse_id: '',
  category_id: '',
  sub_category_id: '',
  variation_type: '',
  discount: 0,
  discount_type: 'percent',
  attribute_id: [],
  choice: [],
  choice_no: [],
  variation_name: '',
  variation_types: [],
  variation_details: {} as any,
  counterparty_id: '',
}

const STORAGE_KEY = 'create-product-form-data'

export const Form = () => {
  const [files, setFiles] = useState<File[]>([])
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))

  // Load saved form data from localStorage
  const getSavedFormData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        return parsed.formData || defaultValues
      }
    } catch (error) {
      console.error('Error loading saved form data:', error)
    }
    return defaultValues
  }

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isValidating },
  } = useForm<CreateProductDto>({
    defaultValues: getSavedFormData() as unknown as CreateProductDto,
    resolver: yupResolver(createProductSchema),
  })
  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Products.createProduct],
    mutationFn: postQuery(getApiPaths().createProduct),
  })
  const { data: attributes } = useGetAttributes({
    refetchOnMount: false,
  })

  // Load saved variation data from localStorage
  const getSavedVariationData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        return {
          variationName: parsed.variationName || '',
          variationTypes: parsed.variationTypes || [],
          variationDetails: parsed.variationDetails || {},
          initialVariationDetails: parsed.initialVariationDetails || {},
        }
      }
    } catch (error) {
      console.error('Error loading saved variation data:', error)
    }
    return {
      variationName: '',
      variationTypes: [],
      variationDetails: {},
      initialVariationDetails: {},
    }
  }

  const savedData = getSavedVariationData()

  // Variation state management (for multiple variations)
  const [variationName, setVariationName] = useState<string>(savedData.variationName)
  const [variationTypes, setVariationTypes] = useState<VariationType[]>(savedData.variationTypes)
  const [variationDetails, setVariationDetails] = useState<Record<string, VariationDetail>>(savedData.variationDetails)
  const [initialVariationDetails, setInitialVariationDetails] = useState<Record<string, VariationDetail>>(savedData.initialVariationDetails)
  const [variationErrors, setVariationErrors] = useState<Record<string, string>>({})

  // Single product variation state (for single variation type)
  const [singleProductDetail, setSingleProductDetail] = useState<VariationDetail>({
    attributeId: '',
    attributeValue: '',
    costPrice: '',
    salePrice: '',
    quantity: '',
    barcode: '',
  })
  const [singleProductErrors, setSingleProductErrors] = useState<{
    attributeId?: string
    attributeValue?: string
    costPrice?: string
    salePrice?: string
    quantity?: string
    barcode?: string
  }>({})

  // Document processing state
  const [showDocumentProcessing, setShowDocumentProcessing] = useState<boolean>(false)

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const subscription = watch((formData) => {
      try {
        const dataToSave = {
          formData,
          variationName,
          variationTypes,
          variationDetails,
          initialVariationDetails,
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
      } catch (error) {
        console.error('Error saving form data:', error)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, variationName, variationTypes, variationDetails, initialVariationDetails])



  const handleClearForm = () => {
    reset(defaultValues as unknown as CreateProductDto)
    setFiles([])
    setVariationName('')
    setVariationTypes([])
    setVariationDetails({})
    setInitialVariationDetails({})
    setVariationErrors({})
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY)
    toast.success('Форма очищена')
  }

  const onSubmit: SubmitHandler<CreateProductDto> = (dto) => {
    // TODO: Add variation validation here

    // Determine which variation details to use based on variation_type
    // variation_type = 1: multiple variations (use variationDetails)
    // variation_type = 2: single product (use singleProductDetail)
    const variationDetailsToSubmit = selectedVariationType === 2
      ? { 'single': singleProductDetail } // For single product, send one variation detail
      : variationDetails // For multiple variations, send all variation details

    const formData = transformCreateProductDto({
      dto,
      variationDetails: variationDetailsToSubmit,
      image: files[0]!,
    })

    // Test API request - log payload structure
    console.log('=== CREATE PRODUCT PAYLOAD ===')
    console.log('FormData entries:')
    for (const [key, value] of (formData as any).entries()) {
      console.log(`${key}:`, value)
    }
    console.log('==============================')

    mutate(formData, {
      onSuccess(response) {
        // Clear localStorage on successful submission
        localStorage.removeItem(STORAGE_KEY)
        toast.success('Товар успешно создан')
        if (location.state?.return === 'arrival') {
          navigate(RouterPaths.createArrival, {
            state: {
              from: 'product',
              productId: (response as any).data,
              productName: watch('name')
            }
          })
        } else {
          navigate(RouterPaths.warehouse)
        }
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

  // Watch variation_type to conditionally show appropriate component
  // 1 = multiple variations (full variation system)
  // 2 = single product (simple form with just attribute fields)
  const selectedVariationType = watch('variation_type')
  const hasMultipleVariations = selectedVariationType === 1
  const isSingleProduct = selectedVariationType === 2

  // Handler for single product variation updates
  const handleSingleProductUpdate = (field: keyof VariationDetail, value: string | number) => {
    setSingleProductDetail(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Stack
      component="form"
      spacing="24px"
      onSubmit={handleSubmit(onSubmit, (errors) => { console.log(errors) } ) }
    >
      <CreateProductGeneral
        control={control}
        setValue={setValue}
        files={files}
        setFiles={setFiles}
        watch={watch}
        imageErrorMessage={errors.image?.message}
        setVariationTypes={setVariationTypes}
        setVariationDetails={setVariationDetails}
        setInitialVariationDetails={setInitialVariationDetails}
        setVariationName={setVariationName}
      />

      {/* Show Variations component when variation_type = 1 (multiple variations) */}
      {hasMultipleVariations && (
        <Variations
          variationName={variationName}
          setVariationName={setVariationName}
          variationTypes={variationTypes}
          setVariationTypes={setVariationTypes}
          variationDetails={variationDetails}
          setVariationDetails={setVariationDetails}
          variationErrors={variationErrors}
          onProcessProduct={() => setShowDocumentProcessing(true)}
          initialVariationDetails={initialVariationDetails}
          hasExistingVariations={Object.keys(initialVariationDetails).length > 0}
        />
      )}

      {/* Show SingleProductVariation when variation_type = 2 (single product) */}
      {isSingleProduct && (
        <SingleProductVariation
          details={singleProductDetail}
          onUpdate={handleSingleProductUpdate}
          errors={singleProductErrors}
          onProcessProduct={() => setShowDocumentProcessing(true)}
        />
      )}

      {/* Document Processing Card */}
      {showDocumentProcessing && (
        <DocumentProcessing
          onClose={() => setShowDocumentProcessing(false)}
          control={control}
          watch={watch}
          setValue={setValue}
          variationTypes={isSingleProduct ? [] : variationTypes}
          variationDetails={isSingleProduct ? { 'single': singleProductDetail } : variationDetails}
          setVariationDetails={isSingleProduct
            ? (updater) => {
                const newDetails = typeof updater === 'function'
                  ? updater({ 'single': singleProductDetail })
                  : updater
                setSingleProductDetail(newDetails['single'] || singleProductDetail)
              }
            : setVariationDetails
          }
          variationErrors={isSingleProduct ? singleProductErrors : variationErrors}
          initialVariationDetails={initialVariationDetails}
          isSingleProduct={isSingleProduct}
        />
      )}

      <Stack
        direction="row"
        spacing="16px"
        justifyContent="flex-end"
      >
        <Button
          variant="outlined"
          size={isMobile ? 'medium' : 'large'}
          sx={{ width: 200 }}
          onClick={() => {
            if (location.state?.return === 'arrival') {
              navigate(RouterPaths.createArrival, {
                state: {
                  from: 'product',
                }
              })
            } else {
              navigate(RouterPaths.warehouse)
            }
          }}
        >
          Отмена
        </Button>
        <Button
          variant="outlined"
          size={isMobile ? 'medium' : 'large'}
          sx={{ width: 200 }}
          onClick={handleClearForm}
        >
          Очистить
        </Button>
        <LoadingButton
          loading={isLoading}
          type="submit"
          size={isMobile ? 'medium' : 'large'}
          sx={{ width: 200 }}
          variant="contained"
        >
          Сохранить
        </LoadingButton>
      </Stack>
    </Stack>
  )
}
