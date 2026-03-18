import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Typography,
  Avatar,
  Chip,
} from '@mui/material'
import { Control, Controller, UseFormSetValue, UseFormWatch } from 'react-hook-form'

import { useSearchWarehouseProducts, WarehouseProductItem } from '../api/search-warehouse-products'
import { safeUrlToFile } from '../lib/url-to-file'
import { VariationDetail, VariationType } from '../model/variation-types'

import { CreateDto, UpdateDto } from '../model/dto'

interface Props {
  control: Control<CreateDto>
  setValue: UseFormSetValue<CreateDto>
  warehouseId: number | null
  files: File[]
  setFiles: Dispatch<SetStateAction<File[]>>
  setVariationTypes: Dispatch<SetStateAction<VariationType[]>>
  setVariationDetails: Dispatch<SetStateAction<Record<string, VariationDetail>>>
  setInitialVariationDetails: Dispatch<SetStateAction<Record<string, VariationDetail>>>
  setVariationName: Dispatch<SetStateAction<string>>
}

export const ProductNameSearch = ({
  control,
  setValue,
  warehouseId,
  files,
  setFiles,
  setVariationTypes,
  setVariationDetails,
  setInitialVariationDetails,
  setVariationName
}: Props) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)

  // Debounce search term - wait 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [searchTerm])

  const { data, isFetching } = useSearchWarehouseProducts(
    warehouseId || 0,
    debouncedSearchTerm
  )

  const options = data?.data || []
  const isSearching = isFetching && debouncedSearchTerm.length >= 2

  const handleProductSelect = async (product: WarehouseProductItem | null) => {
    if (product) {
      // Auto-fill form fields with selected product data
      setValue('name', product.product_name)
      setValue('purchase_price', product.purchase_price)
      setValue('price', product.retail_price)
      setValue('quantity', parseFloat(product.quantity))

      // Auto-fill category and subcategory
      if (product.category?.id) {
        setValue('category_id', product.category.id)
      }
      if (product.subcategory?.id) {
        setValue('sub_category_id', product.subcategory.id)
      } else {
        setValue('sub_category_id', null)
      }

      // Set product code if available
      if (product.product_code) {
        setValue('product_code', product.product_code)
      }

      // Handle product image if available
      if (product.image) {
        try {
          const imageFile = await safeUrlToFile(product.image, `${product.product_name}.jpg`)
          if (imageFile) {
            setFiles([imageFile])
          }
        } catch (error) {
          console.warn('Failed to load product image:', error)
        }
      } else {
        // Clear files if no image
        setFiles([])
      }

      // Handle variations if they exist
      if (product.variations && product.variations.length > 0) {
        // Set the variation name from the API response
        setVariationName(product.variation_name || '')

        // Create variation details from the variations (for existing variations only)
        const variationDetails: Record<string, VariationDetail> = {}
        product.variations.forEach((variation) => {
          variationDetails[variation.variation_id] = {
            attributeId: variation.attribute_id,
            attributeValue: variation.attribute_value,
            costPrice: variation.cost_price,
            salePrice: variation.sale_price,
            quantity: variation.quantity,
            barcode: variation.barcode,
          }
        })

        // Store initial variation details for existing variations (read-only)
        setInitialVariationDetails(variationDetails)
        // Clear new variation types and details (user will add new ones)
        setVariationTypes([])
        setVariationDetails({})
      } else {
        // Clear variations if no variations exist
        setVariationName('')
        setVariationTypes([])
        setVariationDetails({})
        setInitialVariationDetails({})
      }

      setInputValue(product.product_name)
    } else {
      setInputValue('')
      setFiles([])
      setVariationName('')
      setVariationTypes([])
      setVariationDetails({})
      setInitialVariationDetails({})
    }
  }

  return (
    <Controller
      name="name"
      control={control}
      render={({ field, fieldState }) => {
        // Sync inputValue with field.value when form is loaded from localStorage
        if (field.value && !inputValue && !isInitialized) {
          setInputValue(field.value)
          setIsInitialized(true)
        }

        return (
          <Autocomplete<WarehouseProductItem>
            value={options.find(option => option.product_name === field.value) || null}
            onChange={(_, newValue) => {
              handleProductSelect(newValue)
              field.onChange(newValue?.product_name || '')
            }}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => {
              setInputValue(newInputValue)
              setSearchTerm(newInputValue)
              field.onChange(newInputValue)
            }}
          options={options}
          getOptionLabel={(option) => option.product_name || ''}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          loading={isSearching}
          loadingText="Поиск товаров..."
          noOptionsText={
            !warehouseId 
              ? "Сначала выберите склад"
              : debouncedSearchTerm.length < 2 
                ? "Введите минимум 2 символа для поиска"
                : "Товар не найден - будет создан новый"
          }
          disabled={!warehouseId}
          freeSolo={true as any}
          renderOption={(props, option) => (
            <Box component="li" {...props}>
              <Avatar
                src={option.image || undefined}
                alt={option.product_name}
                sx={{ width: 32, height: 32, mr: 2 }}
              >
                {!option.image && option.product_name.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" fontWeight={500}>
                  {option.product_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {option.category?.name}{option.subcategory ? ` • ${option.subcategory?.name}` : ''} • Цена: {option.retail_price}с. • Кол-во: {option.quantity}
                </Typography>
                {/* Show variations if they exist */}
                {option.variations && option.variations.length > 0 && (
                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {option.variations.map((variation) => (
                      <Chip
                        key={variation.variation_id}
                        label={`${variation.attribute_value}: ${variation.quantity}шт`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem', height: 20 }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Название товара"
              placeholder="Введите название товара для поиска"
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isSearching ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
        )
      }}
    />
  )
}
