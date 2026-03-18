import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Stack, useMediaQuery, useTheme } from '@mui/material'
import { AxiosError } from 'axios'

import {
  CreateProductDto,
  CreateProductGeneral,
  UpdateProductDto,
  updateProductSchema,
  transformCreateProductDto,
} from '@features/create-update-product'
import { Variations } from '@features/create-update-product/ui/variations'
import { DocumentProcessing } from '@features/create-update-product/ui/document-processing'
import { VariationDetail, VariationType } from '@features/create-update-product/model/variation-types'
import { useGetProduct } from '@entities/products'
import { ApiKeys, getApiPaths, postQuery } from '@shared/api'
import { RouterPaths } from '@shared/lib'
import { PageLoader } from '@shared/ui'

import { setForm } from '../lib/set-form'

const defaultValues: Partial<
  Record<keyof UpdateProductDto, string | number | number[] | string[] | null>
> = {
  name: '',
  description: '',
  image: '',
  category_id: '',
  sub_category_id: '',
  variation_type: '',
  purchase_price: '',
  price: '',
  quantity: '',
  product_code: '',
  discount: 0,
  discount_type: 'percent',
  variation_name: '',
  variation_types: [],
  variation_details: {} as any,
}

export const Form = () => {
  const [files, setFiles] = useState<File[]>([])
  const { data: product, isFetching } = useGetProduct()
  const navigate = useNavigate()
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isValidating },
  } = useForm<UpdateProductDto>({
    defaultValues: defaultValues as unknown as UpdateProductDto,
    resolver: yupResolver(updateProductSchema),
  })
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))
  const params = useParams()
  const { mutate } = useMutation({
    mutationKey: [ApiKeys.Products.updateProduct_ + params.id],
    mutationFn: postQuery(getApiPaths().updateProduct_ + params.id),
  })

  // Variation state management
  const [variationName, setVariationName] = useState<string>('')
  const [variationTypes, setVariationTypes] = useState<VariationType[]>([])
  const [variationDetails, setVariationDetails] = useState<Record<string, VariationDetail>>({})
  const [variationErrors, setVariationErrors] = useState<Record<string, string>>({})

  // Document processing state
  const [showDocumentProcessing, setShowDocumentProcessing] = useState<boolean>(false)

  useEffect(() => {
    if (product) {
      reset(setForm({...product.data, discount_type: 'percent'}) as CreateProductDto | UpdateProductDto)

      // Populate variation state from product data
      // Check both product_variations (new API) and variations (current API response)
      const variations = product.data.product_variations || (product.data as any).variations
      if (variations && variations.length > 0) {
        setVariationName(product.data.variation_name || '')

        // Create variation types from existing variations
        const variationTypes: VariationType[] = variations.map((variation: any) => ({
          id: variation.variation_id,
          name: variation.attribute_value,
        }))

        // Create variation details from existing variations
        const variationDetails: Record<string, VariationDetail> = {}
        variations.forEach((variation: any) => {
          variationDetails[variation.variation_id] = {
            attributeId: variation.attribute_id,
            attributeValue: variation.attribute_value,
            costPrice: variation.cost_price,
            salePrice: variation.sale_price,
            quantity: variation.quantity,
            barcode: variation.barcode,
          }
        })

        setVariationTypes(variationTypes)
        setVariationDetails(variationDetails)
      }
    }
  }, [product, reset])

  const onSubmit: SubmitHandler<UpdateProductDto> = (dto) => {
    const formData = transformCreateProductDto({
      dto,
      variationDetails,
      image: files[0],
    })
    mutate(formData, {
      onSuccess() {
        toast.success('Товар успешно изменён')
        navigate(RouterPaths.warehouse)
      },
      onError(error) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data.message || 'Произошла ошибка при изменении',
          )
        }
      },
    })
  }

  if (isFetching) {
    return <PageLoader />
  }

  return (
    <Stack
      component="form"
      spacing="24px"
      onSubmit={handleSubmit(onSubmit, (error) => { console.log(error) })}
    >
      <CreateProductGeneral
        control={control}
        setValue={setValue}
        files={files}
        setFiles={setFiles}
        watch={watch}
        imageErrorMessage={errors.image?.message}
      />
      <Variations
        variationName={variationName}
        setVariationName={setVariationName}
        variationTypes={variationTypes}
        setVariationTypes={setVariationTypes}
        variationDetails={variationDetails}
        setVariationDetails={setVariationDetails}
        variationErrors={variationErrors}
        onProcessProduct={() => setShowDocumentProcessing(true)}
        isEditMode={true}
      />

      {/* Document Processing Card */}
      {showDocumentProcessing && (
        <DocumentProcessing
          onClose={() => setShowDocumentProcessing(false)}
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
          component={Link}
          to={RouterPaths.warehouse}
        >
          Отмена
        </Button>
        <Button
          type="submit"
          size={isMobile ? 'medium' : 'large'}
          sx={{ width: 200 }}
        >
          Сохранить
        </Button>
      </Stack>
    </Stack>
  )
}
