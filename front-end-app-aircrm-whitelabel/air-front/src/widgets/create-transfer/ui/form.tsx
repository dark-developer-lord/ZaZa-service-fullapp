import { useState, useMemo, useEffect } from 'react'
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
  CircularProgress,
  Stack,
  FormControlLabel,
  Checkbox,
  Alert,
  Avatar
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import toast from 'react-hot-toast'
import { useGetWarehouses } from '@entities/warehouses'
import { Board, Search, DataTable, Toggle } from '@shared/ui'
import { normalizeNumber, generateArray, formatDateForAPI } from '@shared/lib'
import { useGetWarehouseProducts } from '../api/get-warehouse-products'
import { useCreateTransfer, CreateTransferDto, TransferProductDto } from '../api/create-transfer'
import { useGetTransferTypes } from '../api/get-transfer-types'
import { useSearchVendors, VendorItem } from '../api/search-vendors'
import { Food, ProductVariation } from '@entities/finance/model/food'
import { selectedProductsColumnsWithAccordion } from './selected-products-columns-accordion'
import { ProductSelectionModal } from './product-selection-modal'
import { useStockLookup, StockLookupItem } from '@widgets/edit-transfer/api/stock-lookup'
import { useGetAvailableWallets } from '@features/pos-terminal/api/get-available-wallets'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers'

export const Form = () => {
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
  const [editingVariationId, setEditingVariationId] = useState<string | null>(null)
  const [editVariationQuantity, setEditVariationQuantity] = useState<string>('')
  const [editVariationSalePrice, setEditVariationSalePrice] = useState<string>('')
  
  // Wallet and installment state for external transfers
  const [isInstallment, setIsInstallment] = useState(false)
  const [initialPayment, setInitialPayment] = useState<number>(0)
  const [debtDueDate, setDebtDueDate] = useState<string>('')
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<number[]>([])
  const [paymentAmounts, setPaymentAmounts] = useState<Record<number, number>>({})

  const { data: warehousesData, isFetching: warehousesLoading } = useGetWarehouses()
  const { data: transferTypesData, isFetching: transferTypesLoading } = useGetTransferTypes()
  const { data: vendorsData, isFetching: vendorsLoading } = useSearchVendors(vendorSearch)
  const { data: productsData, isFetching: productsLoading } = useGetWarehouseProducts({
    warehouseId: fromWarehouse,
    search: productSearch,
    page: productPage,
    perPage: 16
  })

  const { mutate: createTransfer, isLoading: isCreating } = useCreateTransfer()
  const { mutate: fetchStockLookup } = useStockLookup(fromWarehouse)
  const { data: walletsResponse, isLoading: walletsLoading } = useGetAvailableWallets()

  const transferTypes = transferTypesData?.data || []
  const wallets = (walletsResponse?.wallets || []).filter(wallet => wallet.type !== 'personal')

  // Stock map for max quantity validation - populated from stock-lookup API
  const [warehouseStockMap, setWarehouseStockMap] = useState<Map<number | string, number>>(new Map())

  // Calculate total amount from selected products
  const calculateTotalAmount = useMemo(() => {
    return selectedProducts.reduce((total, product) => {
      if (product.variations && product.variations.length > 0) {
        // Sum all variations
        const variationsTotal = product.variations.reduce((sum: number, v: any) => {
          const quantity = v.quantity || 0
          const salePrice = v.sale_price || 0
          return sum + (quantity * salePrice)
        }, 0)
        return total + variationsTotal
      } else {
        // Product without variations
        const quantity = product.selectedQuantity || 0
        const salePrice = product.salePrice || 0
        return total + (quantity * salePrice)
      }
    }, 0)
  }, [selectedProducts])

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

  const handleToggleRow = (productId: number) => {
    setExpandedRowIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  // Wallet and installment handlers
  const handlePaymentMethodChange = (walletId: number, checked: boolean) => {
    const paymentMethodsEnabled = !isInstallment || (isInstallment && initialPayment > 0)
    if (!paymentMethodsEnabled) return

    let newSelectedMethods: number[]
    
    if (checked) {
      newSelectedMethods = [...selectedPaymentMethods, walletId]
    } else {
      newSelectedMethods = selectedPaymentMethods.filter(id => id !== walletId)
      const newAmounts = { ...paymentAmounts }
      delete newAmounts[walletId]
      setPaymentAmounts(newAmounts)
    }

    setSelectedPaymentMethods(newSelectedMethods)

    const targetAmount = isInstallment ? (initialPayment || 0) : calculateTotalAmount

    if (newSelectedMethods.length === 1) {
      setPaymentAmounts({ [newSelectedMethods[0]]: targetAmount })
    } else if (newSelectedMethods.length > 1) {
      const amountPerMethod = Math.round(((targetAmount || 0) / newSelectedMethods.length) * 100) / 100
      const newAmounts: Record<number, number> = { ...paymentAmounts }
      newSelectedMethods.forEach(methodId => {
        if (!paymentAmounts[methodId]) {
          newAmounts[methodId] = amountPerMethod
        }
      })
      setPaymentAmounts(newAmounts)
    }
  }

  const handleAmountChange = (walletId: number, value: string) => {
    const numericValue = parseFloat(value) || 0
    setPaymentAmounts(prev => ({ ...prev, [walletId]: numericValue }))
  }

  const handleInstallmentToggle = (checked: boolean) => {
    setIsInstallment(checked)
    if (!checked) {
      setInitialPayment(0)
      setDebtDueDate('')
      setSelectedPaymentMethods([])
      setPaymentAmounts({})
    }
  }

  // Clear wallet and installment state when transfer format changes
  useEffect(() => {
    if (transferFormat !== 'external') {
      setIsInstallment(false)
      setInitialPayment(0)
      setDebtDueDate('')
      setSelectedPaymentMethods([])
      setPaymentAmounts({})
    }
  }, [transferFormat])

  // Clear payment methods when installment is enabled but initial payment is 0
  useEffect(() => {
    const paymentMethodsEnabled = !isInstallment || (isInstallment && initialPayment > 0)
    if (!paymentMethodsEnabled) {
      setSelectedPaymentMethods([])
      setPaymentAmounts({})
    }
  }, [isInstallment, initialPayment])

  // Update payment amounts when total amount changes (for non-installment transfers)
  useEffect(() => {
    // Only update if payment methods are already selected and it's not an installment
    if (selectedPaymentMethods.length > 0 && !isInstallment && transferFormat === 'external') {
      const targetAmount = calculateTotalAmount
      
      if (selectedPaymentMethods.length === 1) {
        // Single payment method - set to full amount
        setPaymentAmounts({ [selectedPaymentMethods[0]]: targetAmount })
      } else if (selectedPaymentMethods.length > 1) {
        // Multiple payment methods - distribute evenly
        const amountPerMethod = Math.round(((targetAmount || 0) / selectedPaymentMethods.length) * 100) / 100
        const newAmounts: Record<number, number> = {}
        selectedPaymentMethods.forEach(methodId => {
          newAmounts[methodId] = amountPerMethod
        })
        setPaymentAmounts(newAmounts)
      }
    }
  }, [calculateTotalAmount, selectedPaymentMethods, isInstallment, transferFormat])

  // Automatically expand products with variations by default
  useEffect(() => {
    const productsWithVariations = selectedProducts
      .filter(product => product.variations && product.variations.length > 0)
      .map(product => product.id)
      .filter((id): id is number => typeof id === 'number')
    
    // Add any products with variations that aren't already expanded
    if (productsWithVariations.length > 0) {
      setExpandedRowIds(prev => {
        const newIds = [...new Set([...prev, ...productsWithVariations])]
        return newIds
      })
    }
  }, [selectedProducts])

  const tableRows = useMemo(() => {
    const rows: any[] = []

    selectedProducts.forEach((product) => {
      // Add the main product row
      rows.push(product)

      // If expanded and has variations, add variation rows
      if (expandedRowIds.includes(product.id) && product.variations && product.variations.length > 0) {
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

  const handleSelectProduct = (product: Food) => {
    // Open modal for quantity and variation selection
    setSelectedProductForModal(product)
    setModalOpen(true)
  }

  const handleConfirmSelection = (selections: Array<{ product: Food, quantity: number, selectedVariation: ProductVariation | null }>) => {
    const newProducts = [...selectedProducts]

    selections.forEach(({ product, quantity, selectedVariation }) => {
      const productName = product.product_name || product.name || ''
      // Get product_id from API response (actual product ID, not warehouse item ID)
      const actualProductId = (product as any).product_id || product.id

      // Find if this product already exists (by actual product_id, not unique variation ID)
      const existingProductIndex = newProducts.findIndex(p => p.product_id === actualProductId)

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
            console.log('[Form - Add Existing] stockQuantity:', (selectedVariation as any).stockQuantity, 'quantity:', selectedVariation.quantity, 'warehouseStock:', warehouseStock)
            existingProduct.variations.push({
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
        if (selectedVariation) {
          // Product with variation
          // Use stockQuantity (explicitly stored) or fall back to quantity
          const warehouseStock = (selectedVariation as any).stockQuantity || selectedVariation.quantity
          console.log('[Form - Add New] stockQuantity:', (selectedVariation as any).stockQuantity, 'quantity:', selectedVariation.quantity, 'warehouseStock:', warehouseStock)
          newProducts.push({
            id: product.id,
            product_id: actualProductId,
            product_name: productName,
            name: productName,
            image: product.image,
            variation_name: (product as any).variation_name,
            variations: [{
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
            product_id: actualProductId,
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
    // If already editing this product, save and close
    if (editingProductId === productId) {
      const product = selectedProducts.find(p => p.id === productId)
      if (product) {
        // Get max available quantity - use originalQuantity if available
        const maxQuantity = product.originalQuantity
          || (product.selectedVariation ? product.selectedVariation.quantity : null)
          || (typeof product.quantity === 'string' ? parseFloat(product.quantity) : product.quantity)
          || 1

        // Parse and validate the input quantity
        let newQuantity = parseFloat(editQuantity) || 1

        // Clamp to available quantity
        if (newQuantity > maxQuantity) {
          newQuantity = maxQuantity
        }

        // Ensure minimum of 1
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
      // Start editing this product
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
    const isExternal = transferFormat === 'external'

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

    // Validate based on transfer type
    if (isExternal) {
      if (!selectedVendor) {
        toast.error('Выберите контрагента')
        return
      }

      // Validate wallets for external transfers
      const paymentMethodsEnabled = !isInstallment || (isInstallment && initialPayment > 0)
      const hasAvailableWallets = wallets.length > 0
      const hasSelectedPaymentMethod = Array.isArray(selectedPaymentMethods) && selectedPaymentMethods.length > 0
      const isPaymentMethodRequired = hasAvailableWallets && paymentMethodsEnabled

      if (isPaymentMethodRequired && !hasSelectedPaymentMethod) {
        toast.error('Выберите способ оплаты')
        return
      }

      // Validate payment amounts match target
      if (hasSelectedPaymentMethod) {
        const targetAmount = isInstallment ? (initialPayment || 0) : calculateTotalAmount
        const totalPaymentAmount = selectedPaymentMethods.reduce((sum, walletId) => {
          return sum + (paymentAmounts[walletId] || 0)
        }, 0)
        const isValidAmount = Math.abs(totalPaymentAmount - targetAmount) < 0.01

        if (!isValidAmount) {
          toast.error(`Сумма оплаты должна равняться ${targetAmount.toFixed(2)} с.`)
          return
        }
      }

      // Validate installment fields if installment is enabled
      if (isInstallment) {
        if (initialPayment === 0 || initialPayment >= calculateTotalAmount) {
          toast.error('Укажите корректную сумму первоначального платежа')
          return
        }
        if (!debtDueDate) {
          toast.error('Укажите дату закрытия долга')
          return
        }
      }
    } else {
      if (!toWarehouse) {
        toast.error('Выберите склад оприходования')
        return
      }
      if (fromWarehouse === toWarehouse) {
        toast.error('Склад списания и склад оприходования не могут быть одинаковыми')
        return
      }
    }

    if (selectedProducts.length === 0) {
      toast.error('Добавьте хотя бы один товар')
      return
    }

    // Build products array - group variations under each product
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
          product_id: product.product_id || product.id,
          quantity: product.selectedQuantity,
          cost_price: (product as any).cost_price || (product as any).purchase_price || 0,
          sale_price: product.salePrice || (product as any).retail_price || (product as any).price || 0,
        }
      }
    })

    // Build payload
    const payload: CreateTransferDto = {
      name: transferName,
      transfer_type: transferFormat,
      from_warehouse_id: fromWarehouse as number,
      products: products,
    }

    // Add conditional fields based on transfer type
    if (isExternal) {
      payload.to_vendor_id = selectedVendor!.id

      // Add wallets for external transfers
      if (selectedPaymentMethods.length > 0) {
        payload.wallets = selectedPaymentMethods.map(walletId => ({
          id: walletId,
          amount: paymentAmounts[walletId] || 0
        }))
      }

      // Add installment fields if installment is enabled
      if (isInstallment) {
        payload.is_installment = true
        payload.initial_payment = initialPayment
        payload.due_date = debtDueDate
        payload.total_due = calculateTotalAmount
        payload.remaining_balance = calculateTotalAmount - initialPayment
      }
    } else {
      payload.to_warehouse_id = toWarehouse as number
    }

    createTransfer(payload)
  }

  // Validation function to determine if submit button should be disabled
  const isSubmitDisabled = useMemo(() => {
    const isExternal = transferFormat === 'external'

    // Basic required fields
    if (!transferFormat) return true
    if (!transferName.trim()) return true
    if (!fromWarehouse) return true

    // Transfer type specific validations
    if (isExternal) {
      if (!selectedVendor) return true

      // Payment method validation for external transfers
      const paymentMethodsEnabled = !isInstallment || (isInstallment && initialPayment > 0)
      const hasAvailableWallets = wallets.length > 0
      const hasSelectedPaymentMethod = Array.isArray(selectedPaymentMethods) && selectedPaymentMethods.length > 0

      // If wallets are available and payment is enabled, payment method is required
      if (hasAvailableWallets && paymentMethodsEnabled) {
        if (!hasSelectedPaymentMethod) return true

        // Validate payment amounts match target
        const targetAmount = isInstallment ? (initialPayment || 0) : calculateTotalAmount
        const totalPaymentAmount = selectedPaymentMethods.reduce((sum, walletId) => {
          return sum + (paymentAmounts[walletId] || 0)
        }, 0)
        const isValidAmount = Math.abs(totalPaymentAmount - targetAmount) < 0.01
        if (!isValidAmount) return true
      }

      // Installment validation (if enabled)
      if (isInstallment) {
        if (initialPayment === 0 || initialPayment >= calculateTotalAmount) return true
        if (!debtDueDate) return true
      }
    } else {
      // Internal transfer validation
      if (!toWarehouse) return true
      if (fromWarehouse === toWarehouse) return true
    }

    // Products validation
    if (selectedProducts.length === 0) return true

    return false
  }, [
    transferFormat,
    transferName,
    fromWarehouse,
    toWarehouse,
    selectedVendor,
    selectedProducts,
    isInstallment,
    initialPayment,
    debtDueDate,
    wallets,
    selectedPaymentMethods,
    paymentAmounts,
    calculateTotalAmount
  ])

  const columns = useMemo(() => selectedProductsColumnsWithAccordion({
    editingProductId,
    editQuantity,
    editSalePrice,
    onEditProduct: handleEditProduct,
    onRemoveProduct: handleRemoveProduct,
    onQuantityChange: setEditQuantity,
    onSalePriceChange: setEditSalePrice,
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

  return (
    <>
      {/* First Card - Document Information */}
      <Board sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            Документ перемещения
          </Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <Select
              displayEmpty
              value={transferFormat}
              onChange={(e) => setTransferFormat(e.target.value)}
              size="medium"
              disabled={transferTypesLoading}
              renderValue={(selected) => {
                if (transferTypesLoading) {
                  return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} />
                      <span style={{ color: '#9e9e9e' }}>Загрузка...</span>
                    </Box>
                  )
                }
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
                  fullWidth
                  placeholder="Введите название перемещения"
                  value={transferName}
                  onChange={(e) => setTransferName(e.target.value)}
                  size="medium"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Select
                    displayEmpty
                    value={fromWarehouse}
                    onChange={(e) => setFromWarehouse(e.target.value as number)}
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
                  fullWidth
                  placeholder="Введите название перемещения"
                  value={transferName}
                  onChange={(e) => setTransferName(e.target.value)}
                  size="medium"
                />
              </Grid>
              {/* Internal Transfer: Warehouse Fields */}
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
                    disabled={warehousesLoading || !warehousesData}
                    renderValue={(selected) => {
                      if (!selected) {
                        return <span style={{ color: '#9e9e9e' }}>Оприходовать в этот склад</span>
                      }
                      const warehouse = warehousesData?.data.find((item) => item.id === selected)
                      return warehouse?.name
                    }}
                  >
                    {warehousesData?.data.map((item) => (
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
      <Board sx={{ mb: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Search
            value={productSearch}
            onChange={setProductSearch}
          />
        </Box>

        {/* Product Cards Grid */}
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

        {/* Pagination */}
        {productsData?.meta?.last_page && productsData.meta.last_page > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={productsData.meta.last_page}
              page={productsData.meta.current_page}
              onChange={(_, page) => setProductPage(page)}
            />
          </Box>
        )}
      </Board>

      {/* Third Card - Selected Products Table */}
      <Board title="Выбранные товары">
        <DataTable
          columns={columns}
          rows={tableRows}
          loading={false}
          hideFooter
          getRowId={(row) => row.id}
          getRowClassName={(params: any) => {
            if (params.row.isVariationRow) return 'variation-row'
            if (params.row.variations && params.row.variations.length > 0) return 'expandable-row'
            return ''
          }}
          slots={{
            noRowsOverlay: () => (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '100px 0',
                }}
              >
                <Typography>Добавьте товары для перемещения</Typography>
              </Box>
            ),
          }}
        />
      </Board>

      {/* Wallet and Installment Section for External Transfers */}
      {transferFormat === 'external' && (
        <Board sx={{ mb: 3, mt: 3 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
            Оплата и рассрочка
          </Typography>

          {/* Installment Fields */}
          <Stack spacing={2} sx={{ mb: 4 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="body1" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                Товар в рассрочку
              </Typography>
              <Toggle
                checked={isInstallment}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInstallmentToggle(e.target.checked)}
              />
            </Box>

            {isInstallment && (
              <>
                <TextField
                  label="Сумма первоначального платежа"
                  type="text"
                  value={initialPayment === 0 ? '' : initialPayment}
                  onChange={(e) => {
                    const value = e.target.value
                    if (/^[1-9][0-9]*$/.test(value)) {
                      const parsed = parseInt(value)
                      if (parsed < calculateTotalAmount) {
                        setInitialPayment(parsed)
                        // Update payment amount if only one wallet is selected
                        if (selectedPaymentMethods.length === 1) {
                          setPaymentAmounts({ [selectedPaymentMethods[0]]: parsed })
                        }
                      }
                    } else if (value === '') {
                      setInitialPayment(0)
                      if (selectedPaymentMethods.length === 1) {
                        setPaymentAmounts({ [selectedPaymentMethods[0]]: 0 })
                      }
                    }
                  }}
                  error={initialPayment >= calculateTotalAmount && initialPayment > 0 && calculateTotalAmount > 0}
                  helperText={initialPayment >= calculateTotalAmount && initialPayment > 0 && calculateTotalAmount > 0 ? 'Первоначальный платеж не может быть 100%. Это не рассрочка!' : ''}
                  onKeyDown={(e) => {
                    const invalidKeys = ['-', '+', 'e', '.', ',', '*', '/', '(', ')']
                    if (invalidKeys.includes(e.key)) {
                      e.preventDefault()
                    }
                  }}
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[1-9][0-9]*',
                    style: {
                      MozAppearance: 'textfield',
                    },
                  }}
                  sx={{
                    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                      WebkitAppearance: 'none',
                      margin: 0,
                    },
                  }}
                  fullWidth
                />

                <DatePicker
                  label="Дата закрытия долга"
                  value={debtDueDate ? dayjs(debtDueDate) : null}
                  onChange={(value) => {
                    if (value) {
                      const formattedDate = formatDateForAPI(value)
                      setDebtDueDate(formattedDate)
                    } else {
                      setDebtDueDate('')
                    }
                  }}
                  minDate={dayjs()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    }
                  }}
                />

                <Typography variant="body2">
                  Остаток долга: <strong>{(calculateTotalAmount - (initialPayment || 0)).toLocaleString()} сомони</strong>
                </Typography>
              </>
            )}
          </Stack>

          {/* Payment Methods */}
          {walletsLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                Загружаем способы оплаты...
              </Typography>
            </Box>
          ) : wallets.length === 0 ? (
            <Alert severity="info" sx={{ my: 2 }}>
              Нет доступных способов оплаты
            </Alert>
          ) : (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Способы оплаты
              </Typography>

              {isInstallment && initialPayment === 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Установите первоначальный взнос для выбора способов оплаты
                </Alert>
              )}

              <Stack spacing={2}>
                {wallets.map((wallet) => {
                  const paymentMethodsEnabled = !isInstallment || (isInstallment && initialPayment > 0)
                  const isSelected = selectedPaymentMethods.includes(wallet.wallet_id)
                  const amount = paymentAmounts[wallet.wallet_id] || 0
                  const isInputDisabled = !paymentMethodsEnabled || selectedPaymentMethods.length === 1
                  const targetAmount = Number(isInstallment ? (initialPayment || 0) : calculateTotalAmount) || 0

                  return (
                    <Box key={wallet.wallet_id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isSelected}
                            onChange={(e) => handlePaymentMethodChange(wallet.wallet_id, e.target.checked)}
                            disabled={!paymentMethodsEnabled}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {wallet.logo && (
                              <Avatar
                                src={`${import.meta.env.VITE_APP_BACK_URL}/${wallet.logo}`}
                                sx={{
                                  width: 32,
                                  height: 32,
                                  bgcolor: 'grey.100',
                                  '& img': {
                                    objectFit: 'contain',
                                    width: '100%',
                                    height: '100%'
                                  }
                                }}
                              />
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography>{wallet.name}</Typography>
                              {wallet.is_enabled && (
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: 'success.main'
                                  }}
                                />
                              )}
                            </Box>
                          </Box>
                        }
                      />
                      
                      {isSelected && (
                        <TextField
                          size="small"
                          type="number"
                          label="Сумма"
                          value={amount}
                          onChange={(e) => handleAmountChange(wallet.wallet_id, e.target.value)}
                          disabled={isInputDisabled}
                          sx={{
                            ml: 4,
                            mt: 1,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1
                            }
                          }}
                          inputProps={{
                            min: 0,
                            max: targetAmount,
                            step: 0.01
                          }}
                        />
                      )}
                    </Box>
                  )
                })}

                {selectedPaymentMethods.length > 1 && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    {(() => {
                      const targetAmount = Number(isInstallment ? (initialPayment || 0) : calculateTotalAmount) || 0
                      const totalPaymentAmount = selectedPaymentMethods.reduce((sum, walletId) => {
                        return sum + (paymentAmounts[walletId] || 0)
                      }, 0)
                      const isValidAmount = Math.abs(totalPaymentAmount - targetAmount) < 0.01
                      return (
                        <>
                          <Typography variant="body2" color="text.secondary">
                            Сумма к оплате: {targetAmount.toFixed(2)} с.
                          </Typography>
                          <Typography
                            variant="body2"
                            color={isValidAmount ? 'success.main' : 'error.main'}
                            sx={{ fontWeight: 'bold' }}
                          >
                            Итого по способам: {totalPaymentAmount.toFixed(2)} с.
                          </Typography>
                          {!isValidAmount && (
                            <Typography variant="caption" color="error.main">
                              Сумма должна равняться {targetAmount.toFixed(2)} с.
                            </Typography>
                          )}
                        </>
                      )
                    })()}
                  </Box>
                )}
              </Stack>
            </Box>
          )}
        </Board>
      )}

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

      {/* Submit Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <LoadingButton
          variant="contained"
          color="primary"
          size="large"
          loading={isCreating}
          disabled={isSubmitDisabled}
          onClick={handleSubmit}
          sx={{
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: '#004547',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 8px rgba(0, 84, 86, 0.3)',
            },
            transition: 'all 0.2s ease-in-out',
            borderRadius: 1,
            px: 4,
          }}
        >
          Создать перемещение
        </LoadingButton>
      </Box>
    </>
  )
}

