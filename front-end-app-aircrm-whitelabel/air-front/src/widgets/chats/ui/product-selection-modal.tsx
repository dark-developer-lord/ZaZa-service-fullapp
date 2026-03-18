import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Grid,
    Typography,
    Checkbox,
    Card,
    CardMedia,
    CardContent,
    CircularProgress,
    Divider,
} from '@mui/material'
import { Food } from '@entities/products/model/food'
import { useGetFoods } from '@entities/products'
import { RestaurantSelect, CategoriesSelect, FoodSearch } from '@features/pos-terminal'
import { useCartStore } from '@features/pos-terminal/model/cart-store'
import { normalizeNumber } from '@shared/lib'

interface Props {
    open: boolean
    onClose: () => void
    onSelectProducts: (products: Food[]) => void
}

export const ProductSelectionModal = ({ open, onClose, onSelectProducts }: Props) => {
    const [page, setPage] = useState(1)
    const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set())
    const [restaurantId, searchValue, categories] = useCartStore((state) => [
        state.restaurantId,
        state.search,
        state.categories,
    ])

    const { data, isFetching } = useGetFoods({
        search: searchValue,
        warehouseId: restaurantId,
        categories,
        page,
        perPage: 12,
    })

    useEffect(() => {
        setPage(1)
    }, [searchValue, restaurantId, categories])

    const handleProductToggle = (productId: number) => {
        setSelectedProducts((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(productId)) {
                newSet.delete(productId)
            } else {
                newSet.add(productId)
            }
            return newSet
        })
    }

    const handleSend = () => {
        if (selectedProducts.size === 0 || !data) return

        const productsToSend = data.data.filter((product) =>
            selectedProducts.has(product.id)
        )
        onSelectProducts(productsToSend)
        setSelectedProducts(new Set())
        onClose()
    }

    const handleClose = () => {
        setSelectedProducts(new Set())
        onClose()
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    maxHeight: '90vh',
                    height: '90vh',
                },
            }}
        >
            <DialogTitle>
                <Typography variant="h6">Выберите товары</Typography>
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                    <RestaurantSelect />
                    <CategoriesSelect />
                    <FoodSearch />
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box
                    sx={{
                        maxHeight: 'calc(90vh - 300px)',
                        overflow: 'auto',
                    }}
                >
                    {isFetching && !data ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            {data?.data.map((product) => {
                                const isSelected = selectedProducts.has(product.id)
                                const productName = product.product_name || product.name || ''
                                const productImage = product.image || '/placeholder-image.png'
                                let productPrice = product.retail_price ?? product.price ?? 0

                                // Calculate price from variations if available
                                if (product.variations && product.variations.length > 0) {
                                    const prices = product.variations
                                        .map((v: any) => v.sale_price || v.price)
                                        .filter((p: number) => p > 0)
                                    if (prices.length > 0) {
                                        productPrice = Math.min(...prices)
                                    }
                                }

                                return (
                                    <Grid item xs={6} sm={4} key={product.id}>
                                        <Card
                                            sx={{
                                                cursor: 'pointer',
                                                border: isSelected ? '2px solid' : '1px solid',
                                                borderColor: isSelected
                                                    ? 'primary.main'
                                                    : 'divider',
                                                position: 'relative',
                                                '&:hover': {
                                                    boxShadow: 3,
                                                },
                                            }}
                                            onClick={() => handleProductToggle(product.id)}
                                        >
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    zIndex: 1,
                                                }}
                                            >
                                                <Checkbox
                                                    checked={isSelected}
                                                    color="primary"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleProductToggle(product.id)
                                                    }}
                                                />
                                            </Box>
                                            <CardMedia
                                                component="img"
                                                height="120"
                                                image={productImage}
                                                alt={productName}
                                                sx={{ objectFit: 'cover' }}
                                            />
                                            <CardContent>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={600}
                                                    sx={{
                                                        textOverflow: 'ellipsis',
                                                        overflow: 'hidden',
                                                        whiteSpace: 'nowrap',
                                                        mb: 0.5,
                                                    }}
                                                    title={productName}
                                                >
                                                    {productName}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {normalizeNumber(productPrice)} сомони
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    )}
                    {data && data.data.length === 0 && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            textAlign="center"
                            sx={{ py: 4 }}
                        >
                            Товары не найдены
                        </Typography>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={handleClose}>Отмена</Button>
                <Button
                    variant="contained"
                    onClick={handleSend}
                    disabled={selectedProducts.size === 0}
                >
                    Отправить ({selectedProducts.size})
                </Button>
            </DialogActions>
        </Dialog>
    )
}

