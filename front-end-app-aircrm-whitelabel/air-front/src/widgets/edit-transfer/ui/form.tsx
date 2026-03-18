import { useState, useEffect, useMemo, useRef } from 'react'
import {
  Box,
  Typography,
  Grid,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Pagination,
  Card as MuiCard,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Skeleton,
  Autocomplete,
  CircularProgress
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { useGetWarehouses } from '@entities/warehouses'
import { Board, Search, DataTable } from '@shared/ui'
import { normalizeNumber, generateArray } from '@shared/lib'
import { useGetWarehouseProducts } from '@widgets/create-transfer/api/get-warehouse-products'
import { UpdateTransferDto, TransferProductDto, useUpdateTransfer } from '../api/update-transfer'
import { useGetTransferTypes } from '@widgets/create-transfer/api/get-transfer-types'
import { useSearchVendors, VendorItem } from '@widgets/create-transfer/api/search-vendors'
import { Food, ProductVariation } from '@entities/finance/model/food'
import { selectedProductsColumnsWithAccordion } from './selected-products-columns-accordion'
import { ProductSelectionModal } from '@widgets/create-transfer/ui/product-selection-modal'
import { useGetTransfer } from '../api/get-transfer'
import { useStockLookup, StockLookupItem } from '../api/stock-lookup'

export const Ui = () => {
  const params = useParams()
  const transferId = params.id

  const [transferFormat, setTransferFormat] = useState('')
  const [transferName, setTransferName] = useState('')
  const [fromWarehouse, setFromWarehouse] = useState<number | ''>('')
  const [toWarehouse, setToWarehouse] = useState<number | ''>('')
  const [vendorSearch, setVendorSearch] = useState('')
  const [selectedVendor, setSelectedVendor] = useState<VendorItem | null>(null)
  const [productSearch, setProductSearch] = useState('')
  const [productPage, setProductPage] = useState(1)
  const [selectedProducts, setSelectedProducts] = useState<any[]>([])
  const [editingProductId, setEditingProductId] = useState<number | string | null>(null)
  const [editQuantity, setEditQuantity] = useState<string>('')
  const [editSalePrice, setEditSalePrice] = useState<string>('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProductForModal, setSelectedProductForModal] = useState<Food | null>(null)
  const [expandedRowIds, setExpandedRowIds] = useState<number[]>([])
  const hasExpandedInitial = useRef(false)
  const [editingVariationId, setEditingVariationId] = useState<string | null>(null)
  const [editVariationQuantity, setEditVariationQuantity] = useState<string>('')
  const [editVariationSalePrice, setEditVariationSalePrice] = useState<string>('')

  const { data: transferData, isFetching: transferLoading } = useGetTransfer()
  const { data: warehousesData, isFetching: warehousesLoading } = useGetWarehouses()
  const { data: transferTypesData, isFetching: transferTypesLoading } = useGetTransferTypes()
  const { data: vendorsData, isFetching: vendorsLoading } = useSearchVendors(vendorSearch)
  // Paginated products for display
  const { data: productsData, isFetching: productsLoading } = useGetWarehouseProducts({
    warehouseId: fromWarehouse,
    search: productSearch,
    page: productPage,
    perPage: 16
  })

  const { mutate: updateTransfer, isLoading: isUpdating } = useUpdateTransfer(transferId)
  const { mutate: fetchStockLookup } = useStockLookup(fromWarehouse)

  const transferTypes = transferTypesData?.data || []

  // Stock map for max quantity validation - populated from stock-lookup API
  const [warehouseStockMap, setWarehouseStockMap] = useState<Map<number | string, number>>(new Map())

  // Toggle row expansion
  const handleToggleRow = (rowId: number) => {
    setExpandedRowIds((prev) => {
      const newIds = prev.includes(rowId)
        ? prev.filter(id => id !== rowId)
        : [...prev, rowId]
      return newIds
    })
  }

  // Transform data to include variation rows (accordion pattern)
  const tableRows = useMemo(() => {
    const rows: any[] = []
    const expandedSet = new Set(expandedRowIds)

    selectedProducts.forEach((product) => {
      // Add the main product row
      rows.push(product)

      // If expanded and has variations, add variation rows
      // Convert product.id to number for comparison
      const productId = typeof product.id === 'number' ? product.id : Number(product.id)
      const isExpanded = expandedSet.has(productId)
      
      if (isExpanded && product.variations && product.variations.length > 0) {
        product.variations.forEach((variation: any, index: number) => {
          rows.push({
            ...product,
            id: `${product.id}_variation_${index}`,
            isVariationRow: true,
            parentProductId: product.id,
            variationData: variation,
            variationIndex: index,
          })
        })
      }
    })

    return rows
  }, [selectedProducts, expandedRowIds])

  // Automatically expand products with variations by default
  useEffect(() => {
    const productsWithVariations = selectedProducts
      .filter(product => product.variations && product.variations.length > 0)
      .map(product => {
        const productId = typeof product.id === 'number' ? product.id : Number(product.id)
        return isNaN(productId) ? null : productId
      })
      .filter((id): id is number => id !== null)
    
    // Add any products with variations that aren't already expanded
    if (productsWithVariations.length > 0) {
      setExpandedRowIds(prev => {
        const newIds = [...new Set([...prev, ...productsWithVariations])]
        return newIds
      })
    }
  }, [selectedProducts])

  // Load existing transfer data
  useEffect(() => {
    if (transferData?.data) {
      const transfer = transferData.data
      setTransferFormat(transfer.transfer_type)
      setTransferName(transfer.name || '')
      setFromWarehouse(transfer.from_warehouse?.id || '')
      setToWarehouse(transfer.to_warehouse?.id || '')

      // Load to_vendor if present (for external transfers)
      if (transfer.to_vendor) {
        setSelectedVendor({
          id: transfer.to_vendor.id,
          name: transfer.to_vendor.name,
          phone: transfer.to_vendor.phone,
          vendor_number: transfer.to_vendor.id.toString(),
        })
      }

      // Map existing products to selected products format
      // New API structure: products array with variations inside each product
      if (transfer.products && transfer.products.length > 0) {
        const mappedProducts: any[] = []
        const productsWithVariations: number[] = []

        transfer.products.forEach(product => {
          // Map variations with originalQuantity for max validation
          const mappedVariations = (product.variations || []).map((v: any) => ({
            ...v,
            originalQuantity: v.quantity, // Store original quantity for max validation
          }))

          // Check if product has variations and collect its ID for auto-expansion
          if (mappedVariations.length > 0) {
            const id = typeof product.id === 'number' ? product.id : Number(product.id)
            if (!isNaN(id)) {
              productsWithVariations.push(id)
            }
          }

          // Store product with its variations array
          mappedProducts.push({
            id: product.id,
            product_id: product.id,
            product_name: product.name,
            name: product.name,
            image: product.image,
            variation_name: product.variation_name,
            // Store all variations for this product with originalQuantity
            variations: mappedVariations,
            // For products without variations, set default values
            selectedQuantity: product.variations?.length > 0 ? 0 : 1,
            selectedVariation: null,
            costPrice: 0,
            salePrice: 0,
            quantity: 0,
          })
        })

        setSelectedProducts(mappedProducts)
        
        // Automatically expand products with variations
        if (productsWithVariations.length > 0 && !hasExpandedInitial.current) {
          setExpandedRowIds(productsWithVariations)
          hasExpandedInitial.current = true
        }
      }
      // Fallback to old API structure (items array) for backward compatibility
      else if (transfer.items && transfer.items.length > 0) {
        const mappedProducts = transfer.items.map(item => {
          const uniqueId = item.product_variation_id
            ? `${item.product_id}_${item.product_variation_id}`
            : item.product_id

          // If product_variation is an array, find the matching variation by price
          let selectedVariation = null
          if (Array.isArray(item.product_variation) && item.product_variation.length > 0) {
            // Try to find variation by matching cost_price and sale_price
            selectedVariation = item.product_variation.find(
              (v: any) => v.cost_price === item.cost_price && v.sale_price === item.sale_price
            )
            // If not found, use the first variation as fallback
            if (!selectedVariation) {
              selectedVariation = item.product_variation[0]
            }
          } else if (item.product_variation && !Array.isArray(item.product_variation)) {
            // If it's a single object (not an array)
            selectedVariation = item.product_variation
          }

          return {
            id: uniqueId,
            product_id: item.product_id,
            product_name: item.product?.name,
            name: item.product?.name,
            image: item.product?.image,
            selectedQuantity: item.quantity,
            selectedVariation: selectedVariation,
            costPrice: item.cost_price,
            salePrice: item.sale_price,
            quantity: item.quantity, // Available quantity (will be used for validation)
          }
        })
        setSelectedProducts(mappedProducts)
      }
    }
  }, [transferData])

  // Fetch stock quantities for selected products using the stock-lookup API
  useEffect(() => {
    if (!fromWarehouse || selectedProducts.length === 0) return

    // Build the items array for the stock-lookup API
    const items: StockLookupItem[] = []
    selectedProducts.forEach((product) => {
      if (product.variations && product.variations.length > 0) {
        // Add each variation separately
        product.variations.forEach((v: any) => {
          // Use the string variation_id (e.g., "2kg_1764313034233_0")
          if (v.variation_id && product.product_id) {
            items.push({
              product_id: product.product_id,
              variation_id: v.variation_id,
            })
          }
        })
      } else {
        // Product without variations
        if (product.product_id) {
          items.push({ product_id: product.product_id })
        }
      }
    })

    if (items.length === 0) return

    console.log('[stock-lookup] sending items:', items)

    // Call the stock-lookup API
    fetchStockLookup(
      { items },
      {
        onSuccess: (response) => {
          const newMap = new Map<number | string, number>()
          response.data.forEach((item) => {
            // Map by variation_id if present, otherwise by product_id
            if (item.variation_id) {
              newMap.set(item.variation_id, item.quantity)
            }
            if (item.product_id) {
              newMap.set(`product_${item.product_id}`, item.quantity)
            }
          })
          console.log('[stock-lookup] response:', response.data, 'map:', newMap)
          setWarehouseStockMap(newMap)
        },
        onError: (error) => {
          console.error('[stock-lookup] error:', error)
        },
      }
    )
  }, [fromWarehouse, selectedProducts, fetchStockLookup])

  const handleSelectProduct = (product: Food) => {
    setSelectedProductForModal(product)
    setModalOpen(true)
  }

  const handleConfirmSelection = (selections: Array<{ product: Food, quantity: number, selectedVariation: ProductVariation | null }>) => {
    const newProducts = [...selectedProducts]

    selections.forEach(({ product, quantity, selectedVariation }) => {
      // Find if this product already exists (by product.id, not unique variation ID)
      const existingProductIndex = newProducts.findIndex(p => p.product_id === product.id)

      if (existingProductIndex !== -1) {
        // Product exists - check if we need to add/update variation
        const existingProduct = newProducts[existingProductIndex]

        if (selectedVariation) {
          // Product has variations
          if (!existingProduct.variations) {
            existingProduct.variations = []
          }

          // Check if this specific variation already exists
          const existingVariationIndex = existingProduct.variations.findIndex(
            (v: any) => v.variation_id === selectedVariation.variation_id
          )

          if (existingVariationIndex !== -1) {
            // Variation exists - increment quantity
            const existingVar = existingProduct.variations[existingVariationIndex]
            const maxQuantity = existingVar.originalQuantity || selectedVariation.quantity
            const newQuantity = Math.min(existingVar.quantity + quantity, maxQuantity)

            existingProduct.variations[existingVariationIndex] = {
              ...existingVar,
              quantity: newQuantity,
              total_cost_price: existingVar.cost_price * newQuantity,
              total_sale_price: existingVar.sale_price * newQuantity,
            }
          } else {
            // New variation for existing product - add to variations array
            // Use stockQuantity (explicitly stored) or fall back to quantity
            const warehouseStock = (selectedVariation as any).stockQuantity || selectedVariation.quantity
            console.log('[Edit Form - Add Existing] stockQuantity:', (selectedVariation as any).stockQuantity, 'quantity:', selectedVariation.quantity, 'warehouseStock:', warehouseStock)
            existingProduct.variations.push({
              item_id: null,
              product_variation_id: selectedVariation.id,
              variation_id: selectedVariation.variation_id,
              variation_type: selectedVariation.variation_type,
              attribute_value: selectedVariation.attribute_value || (selectedVariation as any).name,
              barcode: selectedVariation.barcode,
              quantity: quantity,
              originalQuantity: warehouseStock,
              cost_price: selectedVariation.cost_price,
              sale_price: selectedVariation.sale_price,
              total_cost_price: selectedVariation.cost_price * quantity,
              total_sale_price: selectedVariation.sale_price * quantity,
              notes: null,
            })
          }

          newProducts[existingProductIndex] = existingProduct
        } else {
          // Product without variations - just increment quantity
          const maxQuantity = typeof product.quantity === 'string' ? parseFloat(product.quantity) : product.quantity
          const newQuantity = Math.min(existingProduct.selectedQuantity + quantity, maxQuantity)

          newProducts[existingProductIndex] = {
            ...existingProduct,
            selectedQuantity: newQuantity
          }
        }
      } else {
        // New product - add it
        const productName = product.product_name || product.name || ''

        if (selectedVariation) {
          // Product with variation
          // Use stockQuantity (explicitly stored) or fall back to quantity
          const warehouseStock = (selectedVariation as any).stockQuantity || selectedVariation.quantity
          console.log('[Edit Form - Add New] stockQuantity:', (selectedVariation as any).stockQuantity, 'quantity:', selectedVariation.quantity, 'warehouseStock:', warehouseStock)
          newProducts.push({
            id: product.id,
            product_id: product.id,
            product_name: productName,
            name: productName,
            image: product.image,
            variation_name: (product as any).variation_name,
            variations: [{
              item_id: null,
              product_variation_id: selectedVariation.id,
              variation_id: selectedVariation.variation_id,
              variation_type: selectedVariation.variation_type,
              attribute_value: selectedVariation.attribute_value || (selectedVariation as any).name,
              barcode: selectedVariation.barcode,
              quantity: quantity,
              originalQuantity: warehouseStock,
              cost_price: selectedVariation.cost_price,
              sale_price: selectedVariation.sale_price,
              total_cost_price: selectedVariation.cost_price * quantity,
              total_sale_price: selectedVariation.sale_price * quantity,
              notes: null,
            }],
            selectedQuantity: 0,
            selectedVariation: null,
            costPrice: 0,
            salePrice: 0,
            quantity: 0,
          })
        } else {
          // Product without variation
          const maxQty = typeof product.quantity === 'string' ? parseFloat(product.quantity) : product.quantity
          newProducts.push({
            id: product.id,
            product_id: product.id,
            product_name: productName,
            name: productName,
            image: product.image,
            variations: [],
            selectedQuantity: quantity,
            selectedVariation: null,
            costPrice: (product as any).cost_price || (product as any).purchase_price || 0,
            salePrice: product.retail_price || product.price || 0,
            quantity: maxQty,
            originalQuantity: maxQty, // Store original warehouse quantity for max validation
          })
        }
      }
    })

    setSelectedProducts(newProducts)
  }

  const handleEditProduct = (productId: number | string) => {
    if (editingProductId === productId) {
      const product = selectedProducts.find(p => p.id === productId)
      if (product) {
        // Get max available quantity - use originalQuantity if available
        const maxQuantity = product.originalQuantity
          || (product.selectedVariation ? product.selectedVariation.quantity : null)
          || (typeof product.quantity === 'string' ? parseFloat(product.quantity) : product.quantity)
          || 1

        let newQuantity = parseFloat(editQuantity) || 1

        if (newQuantity > maxQuantity) {
          newQuantity = maxQuantity
        }

        if (newQuantity < 1) {
          newQuantity = 1
        }

        // Parse and validate sale price
        const newSalePrice = parseFloat(editSalePrice) || product.salePrice

        setSelectedProducts(selectedProducts.map(p =>
          p.id === productId
            ? { ...p, selectedQuantity: newQuantity, salePrice: newSalePrice }
            : p
        ))
      }
      setEditingProductId(null)
      setEditQuantity('')
      setEditSalePrice('')
    } else {
      const product = selectedProducts.find(p => p.id === productId)
      if (product) {
        setEditingProductId(productId as number)
        setEditQuantity(product.selectedQuantity.toString())
        setEditSalePrice(product.salePrice.toString())
      }
    }
  }

  const handleRemoveProduct = (productId: number | string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId))
  }

  const handleEditVariation = (variationRowId: string) => {
    // variationRowId format: "{productId}_variation_{index}"
    const parts = variationRowId.split('_variation_')
    const productId = parseInt(parts[0])
    const variationIndex = parseInt(parts[1])

    if (editingVariationId === variationRowId) {
      // Save and close
      const product = selectedProducts.find(p => p.id === productId)
      if (product && product.variations && product.variations[variationIndex]) {
        const variation = product.variations[variationIndex]
        // Use warehouse stock from stock-lookup as max, not the transfer quantity
        const stockFromMap = warehouseStockMap.get(variation.variation_id)
        const maxQuantity = stockFromMap ?? 999999

        let newQuantity = parseFloat(editVariationQuantity) || 1
        if (newQuantity > maxQuantity) newQuantity = maxQuantity
        if (newQuantity < 1) newQuantity = 1

        const newSalePrice = parseFloat(editVariationSalePrice) || variation.sale_price

        const updatedProducts = selectedProducts.map(p => {
          if (p.id === productId) {
            const updatedVariations = [...p.variations]
            updatedVariations[variationIndex] = {
              ...updatedVariations[variationIndex],
              quantity: newQuantity,
              sale_price: newSalePrice,
              total_cost_price: newQuantity * (updatedVariations[variationIndex].cost_price || 0),
              total_sale_price: newQuantity * newSalePrice,
            }
            return { ...p, variations: updatedVariations }
          }
          return p
        })
        setSelectedProducts(updatedProducts)
      }
      setEditingVariationId(null)
      setEditVariationQuantity('')
      setEditVariationSalePrice('')
    } else {
      // Start editing
      const product = selectedProducts.find(p => p.id === productId)
      if (product && product.variations && product.variations[variationIndex]) {
        const variation = product.variations[variationIndex]
        setEditingVariationId(variationRowId)
        setEditVariationQuantity(variation.quantity.toString())
        setEditVariationSalePrice(variation.sale_price.toString())
      }
    }
  }

  const handleRemoveVariation = (variationRowId: string) => {
    // variationRowId format: "{productId}_variation_{index}"
    const parts = variationRowId.split('_variation_')
    const productId = parseInt(parts[0])
    const variationIndex = parseInt(parts[1])

    setSelectedProducts(selectedProducts.map(p => {
      if (p.id === productId) {
        const updatedVariations = p.variations.filter((_: any, idx: number) => idx !== variationIndex)
        // If no more variations, remove the entire product
        if (updatedVariations.length === 0) {
          return null
        }
        return { ...p, variations: updatedVariations }
      }
      return p
    }).filter(Boolean))
  }

  const handleSubmit = () => {
    // Validation
    if (!transferFormat) {
      toast.error('Выберите формат перемещения')
      return
    }
    if (!transferName.trim()) {
      toast.error('Введите название перемещения')
      return
    }
    if (!fromWarehouse) {
      toast.error('Выберите склад списания')
      return
    }

    if (transferFormat === 'internal' && !toWarehouse) {
      toast.error('Выберите склад для оприходования')
      return
    }

    if (transferFormat === 'external' && !selectedVendor) {
      toast.error('Выберите контрагента')
      return
    }

    if (selectedProducts.length === 0) {
      toast.error('Добавьте хотя бы один товар')
      return
    }

    // Prepare products data - group variations under each product
    const products: TransferProductDto[] = selectedProducts.map(product => {
      if (product.variations && product.variations.length > 0) {
        // Product has variations - send as variations array
        return {
          product_id: product.product_id || product.id,
          variations: product.variations.map((variation: any) => ({
            variation_id: variation.variation_id,
            quantity: variation.quantity,
            cost_price: variation.cost_price,
            sale_price: variation.sale_price,
          })),
        }
      } else {
        // Product without variations - send quantity directly
        return {
          product_id: typeof product.product_id === 'number' ? product.product_id : product.id,
          quantity: product.selectedQuantity,
          cost_price: product.costPrice,
          sale_price: product.salePrice,
        }
      }
    })

    // Prepare transfer data
    const transferData: UpdateTransferDto = {
      name: transferName || undefined,
      transfer_type: transferFormat,
      from_warehouse_id: fromWarehouse as number,
      to_warehouse_id: transferFormat === 'internal' ? (toWarehouse as number) : undefined,
      to_vendor_id: transferFormat === 'external' ? selectedVendor?.id : undefined,
      products,
    }

    updateTransfer(transferData)
  }

  const columns = useMemo(() => selectedProductsColumnsWithAccordion({
    editingProductId,
    editQuantity,
    editSalePrice,
    onEditQuantityChange: setEditQuantity,
    onSalePriceChange: setEditSalePrice,
    onEditProduct: handleEditProduct,
    onRemoveProduct: handleRemoveProduct,
    expandedRows: new Set(expandedRowIds),
    onToggleRow: handleToggleRow,
    editingVariationId,
    editVariationQuantity,
    editVariationSalePrice,
    onEditVariation: handleEditVariation,
    onRemoveVariation: handleRemoveVariation,
    onVariationQuantityChange: setEditVariationQuantity,
    onVariationSalePriceChange: setEditVariationSalePrice,
    warehouseStockMap,
  }), [
    editingProductId,
    editQuantity,
    editSalePrice,
    expandedRowIds,
    editingVariationId,
    editVariationQuantity,
    editVariationSalePrice,
    selectedProducts,
    handleEditProduct,
    handleRemoveProduct,
    handleToggleRow,
    handleEditVariation,
    handleRemoveVariation,
    warehouseStockMap,
  ])

  if (transferLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* First Card - Transfer Document */}
      <Board>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            Документ перемещения
          </Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <Select
              displayEmpty
              value={transferFormat}
              onChange={(e) => {
                setTransferFormat(e.target.value)
                setToWarehouse('')
                setSelectedVendor(null)
              }}
              size="medium"
              disabled={transferTypesLoading}
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: '#9e9e9e' }}>Формат перемещения</span>
                }
                const selectedType = transferTypes.find(t => t.value === selected)
                return selectedType?.label || selected
              }}
            >
              {transferTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={2}>
          {/* Show different fields based on transfer type */}
          {transferFormat === 'external' ? (
            <>
              {/* External Transfer: First Row - Transfer Name + From Warehouse */}
              <Grid item xs={12} md={6}>
                <TextField
                  value={transferName}
                  onChange={(e) => setTransferName(e.target.value)}
                  placeholder="Введите название перемещения"
                  fullWidth
                  size="medium"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Select
                    displayEmpty
                    value={fromWarehouse}
                    onChange={(e) => {
                      const newValue = e.target.value as number
                      setFromWarehouse(newValue)
                      setProductSearch('')
                      setProductPage(1)
                    }}
                    size="medium"
                    disabled={warehousesLoading || !warehousesData}
                    renderValue={(selected) => {
                      if (!selected) {
                        return <span style={{ color: '#9e9e9e' }}>Склад списания</span>
                      }
                      const warehouse = warehousesData?.data.find((item) => item.id === selected)
                      return warehouse?.name
                    }}
                  >
                    {warehousesData?.data.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* External Transfer: Second Row - Vendor Search Fields + Selected Vendor Name */}
              <Grid item xs={12} md={4}>
                <Autocomplete
                  fullWidth
                  options={vendorsData?.data || []}
                  loading={vendorsLoading}
                  value={selectedVendor}
                  onChange={(_, newValue) => setSelectedVendor(newValue)}
                  onInputChange={(_, newInputValue) => setVendorSearch(newInputValue)}
                  getOptionLabel={(option) => option.vendor_number || option.id.toString()}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Введите ID контрагента"
                      size="medium"
                    />
                  )}
                  noOptionsText="Контрагент не найден"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Autocomplete
                  fullWidth
                  options={vendorsData?.data || []}
                  loading={vendorsLoading}
                  value={selectedVendor}
                  onChange={(_, newValue) => setSelectedVendor(newValue)}
                  onInputChange={(_, newInputValue) => setVendorSearch(newInputValue)}
                  getOptionLabel={(option) => option.phone || ''}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Введите телефон контрагента"
                      size="medium"
                    />
                  )}
                  noOptionsText="Контрагент не найден"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Название контрагента"
                  value={selectedVendor?.name || ''}
                  size="medium"
                  disabled
                  sx={{
                    '& .MuiInputBase-input': {
                      color: 'text.primary',
                    },
                  }}
                />
              </Grid>
            </>
          ) : (
            <>
              {/* Internal Transfer: Transfer Name + Warehouse Fields */}
              <Grid item xs={12} md={4}>
                <TextField
                  value={transferName}
                  onChange={(e) => setTransferName(e.target.value)}
                  placeholder="Введите название перемещения"
                  fullWidth
                  size="medium"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <Select
                    displayEmpty
                    value={fromWarehouse}
                    onChange={(e) => {
                      const newValue = e.target.value as number
                      setFromWarehouse(newValue)
                      // If the selected warehouse is the same as toWarehouse, clear toWarehouse
                      if (newValue === toWarehouse) {
                        setToWarehouse('')
                      }
                      setProductSearch('')
                      setProductPage(1)
                    }}
                    size="medium"
                    disabled={warehousesLoading || !warehousesData}
                    renderValue={(selected) => {
                      if (!selected) {
                        return <span style={{ color: '#9e9e9e' }}>Склад списания</span>
                      }
                      const warehouse = warehousesData?.data.find((item) => item.id === selected)
                      return warehouse?.name
                    }}
                  >
                    {warehousesData?.data.map((item) => (
                      <MenuItem
                        key={item.id}
                        value={item.id}
                        disabled={item.id === toWarehouse}
                      >
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <Select
                    displayEmpty
                    value={toWarehouse}
                    onChange={(e) => {
                      const newValue = e.target.value as number
                      setToWarehouse(newValue)
                      // If the selected warehouse is the same as fromWarehouse, clear fromWarehouse
                      if (newValue === fromWarehouse) {
                        setFromWarehouse('')
                      }
                    }}
                    size="medium"
                    disabled={warehousesLoading || !warehousesData || !fromWarehouse}
                    renderValue={(selected) => {
                      if (!selected) {
                        return <span style={{ color: '#9e9e9e' }}>Оприходовать в этот склад</span>
                      }
                      const warehouse = warehousesData?.data.find((item) => item.id === selected)
                      return warehouse?.name
                    }}
                  >
                    {warehousesData?.data
                      .filter((item) => item.id !== fromWarehouse)
                      .map((item) => (
                        <MenuItem
                          key={item.id}
                          value={item.id}
                          disabled={item.id === fromWarehouse}
                        >
                          {item.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}
        </Grid>
      </Board>

      {/* Second Card - Product Search and Selection */}
      <Board title="Поиск товаров">
        <Box sx={{ mb: 3 }}>
          <Search
            value={productSearch}
            onChange={setProductSearch}
          />
        </Box>

        {!fromWarehouse ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
            Выберите склад списания для отображения товаров
          </Typography>
        ) : productsLoading ? (
          <Grid container spacing={2}>
            {generateArray(16).map((id) => (
              <Grid key={id} item xs={6} mobile={3}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
              </Grid>
            ))}
          </Grid>
        ) : productsData?.data && productsData.data.length > 0 ? (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {productsData.data.map((product) => {
              const productName = product.product_name || product.name || ''
              const productImage = product.image || '/placeholder-image.png'
              const productPrice = product.retail_price ?? product.price ?? 0
              const productQuantity = typeof product.quantity === 'string' ? parseFloat(product.quantity) : product.quantity

              return (
                <Grid key={product.id} item xs={6} mobile={3}>
                  <MuiCard>
                    <CardMedia
                      component="img"
                      height="140"
                      image={productImage}
                      alt={productName}
                    />
                    <CardContent>
                      <Typography
                        variant="small"
                        fontWeight={600}
                        component="h3"
                        sx={{
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                        }}
                        title={productName}
                      >
                        {productName}
                      </Typography>
                      <Typography variant="xs" color="text.secondary" component="p" fontWeight={500}>
                        {normalizeNumber(productPrice)} сомони
                      </Typography>
                      <Typography variant="xs" color="text.secondary" component="p" fontWeight={500}>
                        В наличии: {productQuantity}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        fullWidth
                        disabled={productQuantity <= 0}
                        onClick={() => handleSelectProduct(product)}
                      >
                        Выбрать
                      </Button>
                    </CardActions>
                  </MuiCard>
                </Grid>
              )
            })}
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
            Товары не найдены
          </Typography>
        )}

        {productsData?.meta?.last_page && productsData.meta.last_page > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={productsData.meta.last_page}
              page={productsData.meta?.current_page || 1}
              onChange={(_, page) => setProductPage(page)}
            />
          </Box>
        )}
      </Board>

      {/* Third Card - Selected Products Table */}
      <Board title="Выбранные товары">
        <DataTable
          rows={tableRows}
          columns={columns}
          slots={{
            noRowsOverlay: () => (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Добавьте товары для перемещения
                </Typography>
              </Box>
            ),
          }}
          getRowClassName={(params: any) => {
            if (params.row.isVariationRow) return 'variation-row'
            if (params.row.variations && params.row.variations.length > 0) return 'expandable-row'
            return ''
          }}
          hideFooter
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <LoadingButton
            variant="contained"
            onClick={handleSubmit}
            loading={isUpdating}
            disabled={selectedProducts.length === 0}
          >
            Сохранить изменения
          </LoadingButton>
        </Box>
      </Board>

      {/* Product Selection Modal */}
      <ProductSelectionModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedProductForModal(null)
        }}
        product={selectedProductForModal}
        onConfirm={handleConfirmSelection}
      />
    </Box>
  )
}

