import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Stack,
  Box,
  Typography,
} from '@mui/material'
import { GridCloseIcon } from '@mui/x-data-grid'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'
import * as XLSX from 'xlsx'
import UploadIcon from '@icons/upload.svg?react'
import { useTheme } from '@mui/material/styles'

interface Props {
  open: boolean
  onClose: () => void
  onImport: (data: ParsedProduct[]) => void
}

export interface ParsedProduct {
  product_name: string
  category_id: number
  sub_category_id: number | null
  has_variations: boolean
  product_code?: string
  purchase_price?: number
  retail_price?: number
  quantity?: number
  image: null
  variationName?: string
  variationOptions?: Array<{
    id: string
    name: string
  }>
  variationDetails?: Record<string, {
    attributeId: number | string
    attributeValue: string
    costPrice: string
    salePrice: string
    quantity: string
    barcode: string
  }>
}

export const ImportArrivalModal = ({ open, onClose, onImport }: Props) => {
  const [file, setFile] = useState<File | null>(null)
  const theme = useTheme()

  const parseExcelFile = async (file: File) => {
    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

      // Skip header row
      const rows = jsonData.slice(1)

      const products: ParsedProduct[] = []
      let currentProduct: ParsedProduct | null = null
      let currentVariations: Array<{ name: string; value: string; costPrice: number; salePrice: number; quantity: number; barcode: string }> = []

      rows.forEach((row, index) => {
        const [name, variationType, variationValue, purchasePrice, price, quantity, barcode, description] = row

        // If we have a product name, it's a new product
        if (name && name.toString().trim()) {
          // Save previous product if exists
          if (currentProduct) {
            if (currentVariations.length > 0) {
              // Process variations
              ;(currentProduct as any).has_variations = true;
              (currentProduct as any).variationName = currentVariations[0].name;
              (currentProduct as any).variationOptions = currentVariations.map((v, idx) => ({
                id: `${v.value}_${Date.now()}_${idx}`,
                name: v.value
              }));
              (currentProduct as any).variationDetails = {}
              currentVariations.forEach((v, idx) => {
                const optionId = `${v.value}_${Date.now()}_${idx}`
                currentProduct!.variationDetails![optionId] = {
                  attributeId: '',
                  attributeValue: v.value,
                  costPrice: v.costPrice.toString(),
                  salePrice: v.salePrice.toString(),
                  quantity: v.quantity.toString(),
                  barcode: v.barcode || ''
                }
              })
            }
            products.push(currentProduct as any)
          }

          // Start new product
          currentProduct = {
            product_name: name.toString().trim(),
            category_id: 0,
            sub_category_id: null,
            has_variations: false,
            image: null,
          }
          currentVariations = []

          // Check if this row has variation data
          if (variationType && variationType.toString().trim()) {
            currentVariations.push({
              name: variationType.toString().trim(),
              value: variationValue?.toString().trim() || '',
              costPrice: Number(purchasePrice) || 0,
              salePrice: Number(price) || 0,
              quantity: Number(quantity) || 0,
              barcode: barcode?.toString().trim() || ''
            })
          } else {
            // Single product without variations
            currentProduct.product_code = barcode?.toString().trim() || ''
            currentProduct.purchase_price = Number(purchasePrice) || 0
            currentProduct.retail_price = Number(price) || 0
            currentProduct.quantity = Number(quantity) || 0
          }
        } else {
          // This is a variation row for the current product
          if (currentProduct && variationType && variationType.toString().trim()) {
            currentVariations.push({
              name: variationType.toString().trim(),
              value: variationValue?.toString().trim() || '',
              costPrice: Number(purchasePrice) || 0,
              salePrice: Number(price) || 0,
              quantity: Number(quantity) || 0,
              barcode: barcode?.toString().trim() || ''
            })
          }
        }
      })

      // Don't forget the last product
      if (currentProduct) {
        if (currentVariations.length > 0) {
          ;(currentProduct as any).has_variations = true;
          (currentProduct as any).variationName = currentVariations[0].name;
          (currentProduct as any).variationOptions = currentVariations.map((v, idx) => ({
            id: `${v.value}_${Date.now()}_${idx}`,
            name: v.value
          }));
          (currentProduct as any).variationDetails = {};
          currentVariations.forEach((v, idx) => {
            const optionId = `${v.value}_${Date.now()}_${idx}`
            currentProduct!.variationDetails![optionId] = {
              attributeId: '',
              attributeValue: v.value,
              costPrice: v.costPrice.toString(),
              salePrice: v.salePrice.toString(),
              quantity: v.quantity.toString(),
              barcode: v.barcode || ''
            }
          })
        }
        products.push(currentProduct as any)
      }

      return products
    } catch (error) {
      console.error('Error parsing Excel file:', error)
      throw error
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleImport = async () => {
    if (!file) {
      toast.error('Выберите файл для импорта')
      return
    }

    try {
      const parsedData = await parseExcelFile(file)
      onImport(parsedData)
      toast.success(`Импортировано ${parsedData.length} товаров`)
      setFile(null)
      onClose()
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message || 'Произошла ошибка при импорте',
        )
      } else {
        toast.error('Произошла ошибка при чтении файла')
      }
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Импорт товаров</DialogTitle>
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 24,
          right: 24,
        }}
      >
        <GridCloseIcon
          width={24}
          height={24}
        />
      </IconButton>
      <DialogContent>
        <Stack spacing={2}>
          <Box
            sx={{
              border: '2px dashed',
              borderColor: 'grey.300',
              borderRadius: 1,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'grey.50',
              },
            }}
            component="label"
          >
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <UploadIcon
              width={48}
              height={48}
              stroke={theme.palette.grey[500]}
              style={{ marginBottom: 16 }}
            />
            <Typography variant="body1" gutterBottom>
              {file ? file.name : 'Выберите файл Excel'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Поддерживаемые форматы: .xlsx, .xls
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack
          direction="row"
          spacing={2}
          sx={{ width: '100%', px: 2, pb: 2 }}
        >
          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={() => {
              setFile(null)
              onClose()
            }}
          >
            Отмена
          </Button>
          <Button
            size="large"
            fullWidth
            onClick={handleImport}
            disabled={!file}
          >
            Импортировать
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

