import { FormEvent, useState, useEffect, useMemo, useRef, useCallback } from "react"
import { Board } from "@shared/ui"
import { Box, CircularProgress, Divider, IconButton, InputAdornment, TextField, Typography } from "@mui/material"
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import toast from 'react-hot-toast'

import MenuIcon from '@icons/menu-chat.svg?react'
import ImgIcon from '@icons/send-image-chat.svg?react'
import SendIcon from '@icons/send-message-chat.svg?react'
import { useStore } from "../model/store"
import { useGetChatBySender } from "../api/get-chat-by-sender"
import dayjs from "dayjs"
import { useProfile } from "@shared/auth"
import { useMutation } from "react-query"
import { postQuery, queryClient } from "@shared/api"
import { useChannelStore, useGetChannels } from "@widgets/channels"
import { LastSeenStorage } from "../lib/last-seen-storage"
import { useMarkMessagesSeen } from "../api/mark-messages-seen"
import { ProductSelectionModal } from "./product-selection-modal"
import { Food } from "@entities/products/model/food"


// File validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

// Validate file
const validateFile = (file: File): string | null => {
    // Check file type by MIME type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return 'Неподдерживаемый тип файла. Разрешены только изображения (JPG, PNG, GIF, WEBP)'
    }

    // Check file extension
    const fileName = file.name.toLowerCase()
    const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext))
    if (!hasValidExtension) {
        return 'Неподдерживаемое расширение файла. Разрешены только .jpg, .jpeg, .png, .gif, .webp'
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return `Размер файла превышает лимит ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    }

    // Check for potentially malicious file names
    const maliciousPatterns = [
        /\.\./, // Path traversal
        /[<>:"|?*]/, // Invalid characters
        /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i, // Reserved Windows names
    ]
    
    for (const pattern of maliciousPatterns) {
        if (pattern.test(file.name)) {
            return 'Недопустимое имя файла'
        }
    }

    // Additional check: verify it's actually an image by checking file signature (magic numbers)
    // This is a basic check - for production, you might want to use a library
    return null
}

export const Dialogue = () => {
    const channel = useChannelStore(state => state.activeChannel)
    const [message, setMessage] = useState("")
    const [headerImageError, setHeaderImageError] = useState(false)
    const [productModalOpen, setProductModalOpen] = useState(false)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const messagesContainerRef = useRef<HTMLDivElement>(null)
    const messageRefs = useRef<Map<number, HTMLDivElement>>(new Map())
    const lastMarkedMessageId = useRef<number>(0)
    const markSeenTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const senderId = useStore(state => state.sender)
    const platform = channel?.platform || 'instagram'
    const {data, isFetching} = useGetChatBySender(senderId, platform, true) // true = isActive chat
    const { profile } = useProfile();
    const { data: allChannels } = useGetChannels({ enabled: true })
    const { mutate: markMessagesSeen } = useMarkMessagesSeen(senderId, platform)

    // Get contact profile from channels list immediately (before API loads)
    const contactProfile = useMemo(() => {
        if (!senderId || !allChannels || !Array.isArray(allChannels)) return null
        
        for (const ch of allChannels) {
            const contact = ch.contacts?.find(c => c.sender_id === senderId)
            if (contact) {
                return contact.profile
            }
        }
        return null
    }, [senderId, allChannels])

    // Use contact profile if available, otherwise use data from API
    const displayProfile = data?.profile || contactProfile

    // Reset image error when sender changes
    useEffect(() => {
        setHeaderImageError(false)
    }, [senderId])

    // Автоматическая прокрутка к последнему сообщению
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
    }

    // Функция для определения видимых сообщений и отметки их как прочитанных
    const checkVisibleMessages = useCallback(() => {
        if (!messagesContainerRef.current || !data?.messages || !senderId) return

        const container = messagesContainerRef.current
        const containerRect = container.getBoundingClientRect()
        const visibleMessageIds: number[] = []

        // Проверяем каждое входящее сообщение на видимость
        data.messages.forEach((msg) => {
            if (msg.direction === 'in' && msg.id > 0) {
                const messageElement = messageRefs.current.get(msg.id)
                if (messageElement) {
                    const messageRect = messageElement.getBoundingClientRect()
                    // Сообщение видимо, если оно находится в пределах контейнера
                    if (
                        messageRect.top >= containerRect.top &&
                        messageRect.bottom <= containerRect.bottom
                    ) {
                        visibleMessageIds.push(msg.id)
                    }
                }
            }
        })

        if (visibleMessageIds.length > 0) {
            // Находим максимальный ID видимого входящего сообщения
            const maxVisibleId = Math.max(...visibleMessageIds)

            // Отмечаем как прочитанные только если это новый максимум
            if (maxVisibleId > lastMarkedMessageId.current) {
                lastMarkedMessageId.current = maxVisibleId

                // Дебаунсим запросы - ждем 500ms после последнего скролла
                if (markSeenTimeoutRef.current) {
                    clearTimeout(markSeenTimeoutRef.current)
                }

                markSeenTimeoutRef.current = setTimeout(() => {
                    markMessagesSeen(maxVisibleId)
                }, 500)
            }
        }
    }, [data?.messages, senderId, markMessagesSeen])

    // Прокрутка при изменении сообщений или смене отправителя
    useEffect(() => {
        if (data?.messages && data.messages.length > 0) {
            // Небольшая задержка для рендеринга DOM
            setTimeout(() => {
                scrollToBottom()
                // После прокрутки проверяем видимые сообщения и отмечаем их как прочитанные
                setTimeout(() => {
                    checkVisibleMessages()
                }, 200)
            }, 100)
        }
    }, [data?.messages, senderId, checkVisibleMessages])

    // Обновляем last seen когда открываем чат или получаем новые сообщения
    useEffect(() => {
        if (senderId && data?.messages && Array.isArray(data.messages) && data.messages.length > 0) {
            // Сохраняем последний просмотренный ID сообщения
            LastSeenStorage.updateLastSeen(senderId, data.messages)
        }
    }, [senderId, data?.messages])

    // Добавляем обработчик скролла
    useEffect(() => {
        const container = messagesContainerRef.current
        if (!container) return

        container.addEventListener('scroll', checkVisibleMessages)
        
        // Также проверяем при загрузке сообщений
        const checkInterval = setInterval(() => {
            checkVisibleMessages()
        }, 1000)

        return () => {
            container.removeEventListener('scroll', checkVisibleMessages)
            if (markSeenTimeoutRef.current) {
                clearTimeout(markSeenTimeoutRef.current)
            }
            clearInterval(checkInterval)
        }
    }, [checkVisibleMessages])

    // Сбрасываем lastMarkedMessageId при смене отправителя
    useEffect(() => {
        lastMarkedMessageId.current = 0
        messageRefs.current.clear()
    }, [senderId])

    if(!profile){
        return null
    }

    const chatQueryKey = [`/messengers/getChatBySender/${senderId}?store_id=${profile?.id}&platform=${platform}`]
    
    const { mutate } = useMutation({
        mutationKey: [`/messengers/listChats?store_id=${profile?.id}&platform=${platform}`],
        mutationFn: postQuery('/messengers/sendReply'),
        onMutate: async (formData: FormData) => {
            if (!senderId) return

            // Отменяем только основной запрос, но не polling запрос
            await queryClient.cancelQueries(chatQueryKey)

            const previousChatData = queryClient.getQueryData(chatQueryKey)

            queryClient.setQueryData(chatQueryKey, (old: any) => {
                if (!old || !old.messages) return old
                
                const messageText = formData.get('message') as string || ''
                const imageFile = formData.get('image') as File | null
                
                // Используем отрицательный ID для временных сообщений, чтобы их легко отличить
                const newMessage: any = {
                    id: -Date.now(), // Отрицательный ID для временных сообщений
                    text: messageText,
                    direction: 'out' as const,
                    sent_at: new Date().toISOString(),
                    is_seen: false,
                    media_type: imageFile ? 'image' : null,
                    media_url: imageFile ? URL.createObjectURL(imageFile) : null,
                    media_id: null
                }

                return {
                    ...old,
                    messages: [...old.messages, newMessage]
                }
            })

            // Прокрутка после оптимистичного обновления
            setTimeout(() => {
                scrollToBottom()
            }, 50)

            return { previousChatData }
        },
        onError: (_err, _formData, context) => {
            if (context?.previousChatData) {
                queryClient.setQueryData(chatQueryKey, context.previousChatData)
            }
        },
        onSuccess: () => {
            queryClient.refetchQueries([`/messengers/listChats?store_id=${profile?.id}&platform=instagram`])
            queryClient.refetchQueries([`/messengers/listChats?store_id=${profile?.id}&platform=whatsapp`])
            queryClient.refetchQueries([`/messengers/listChats?store_id=${profile?.id}&platform=messenger`])
            
            // После успешной отправки, обновляем данные и удаляем временные сообщения
            queryClient.refetchQueries([chatQueryKey]).then(() => {
                // Удаляем временные сообщения (с отрицательными ID) после получения реальных данных
                const currentData = queryClient.getQueryData<any>(chatQueryKey)
                if (currentData?.messages) {
                    const realMessages = currentData.messages.filter((m: any) => m.id > 0)
                    queryClient.setQueryData(chatQueryKey, {
                        ...currentData,
                        messages: realMessages
                    })
                }
                // Прокрутка после получения реальных данных
                setTimeout(() => {
                    scrollToBottom()
                }, 100)
            })
        },
    })

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file
        const error = validateFile(file)
        if (error) {
            toast.error(error)
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
            return
        }

        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
        setSelectedImage(file)
    }

    const handleRemoveImage = () => {
        setSelectedImage(null)
        setImagePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleImageIconClick = () => {
        fileInputRef.current?.click()
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        // Allow sending if there's either a message or an image
        if (!message.trim() && !selectedImage) return

        const formData = new FormData()
        
        // Add message if exists
        if (message.trim()) {
            formData.append('message', message.trim())
        }
        
        // Add image if selected
        if (selectedImage) {
            formData.append('image', selectedImage)
        }
        
        if(channel?.account_id){
            formData.append('account_id', channel?.account_id.toString())
        }
        if(senderId){
            formData.append('sender_id', senderId.toString())
            formData.append('recipient_id', senderId.toString())
        }
        
        // Clear inputs immediately for better UX
        setMessage("")
        setSelectedImage(null)
        setImagePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        
        mutate(formData)
        
        // Прокрутка после отправки сообщения
        setTimeout(() => {
            scrollToBottom()
        }, 200)
    }

    const handleSelectProducts = async (products: Food[]) => {
        if (!senderId || products.length === 0) return

        // Send each product as a separate message
        for (const product of products) {
            const productName = product.product_name || product.name || 'Товар'
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

            const priceText = productPrice > 0 ? `${productPrice} сомони` : 'Цена не указана'
            const imageText = product.image ? `\n📷 ${product.image}` : ''
            const messageText = `🛍️ ${productName}\n💰 ${priceText}${imageText}`

            const formData = new FormData()
            formData.append('message', messageText)
            if(channel?.account_id){
                formData.append('account_id', channel?.account_id.toString())
            }
            if(senderId){
                formData.append('sender_id', senderId.toString())
                formData.append('recipient_id', senderId.toString())
            }

            // Send each product message sequentially
            await new Promise((resolve) => {
                mutate(formData, {
                    onSuccess: () => resolve(undefined),
                    onError: () => resolve(undefined),
                })
            })
        }
    }

    return (
        <Board
            sx={{
                height: { xs: '600px', mobile: '100%' },
                maxHeight: { xs: '600px', mobile: 'calc(100vh - 200px)' },
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: '12px'
                }}
            >
                <Box sx={{display: 'flex', alignItems: 'center', gap: '10px'}} >
                    {senderId && (
                        <>
                            <Box
                                component="img"
                                src={!headerImageError && displayProfile?.profile_pic ? displayProfile.profile_pic : "/icons/ava-grey.png"}
                                alt="avatar"
                                width={50}
                                height={50}
                                onError={() => setHeaderImageError(true)}
                                onClick={() => {
                                    if (displayProfile?.link) {
                                        window.open(displayProfile.link, '_blank')
                                    }
                                }}
                                sx={{
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    cursor: displayProfile?.link ? 'pointer' : 'default',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': displayProfile?.link ? { 
                                        opacity: 0.85,
                                        transform: 'scale(1.05)'
                                    } : {}
                                }}
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column' }} >
                                <Typography
                                    variant="h6"
                                    component="h3"
                                    onClick={() => {
                                        if (displayProfile?.link) {
                                            window.open(displayProfile.link, '_blank')
                                        }
                                    }}
                                    sx={{
                                        cursor: displayProfile?.link ? 'pointer' : 'default',
                                        color: displayProfile?.link ? 'primary.main' : 'inherit',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': displayProfile?.link ? { 
                                            opacity: 0.8,
                                            transform: 'translateX(2px)'
                                        } : {}
                                    }}
                                >
                                    @{displayProfile?.username || senderId}
                                </Typography>
                            </Box>
                        </>
                    )}
                </Box>
                    <IconButton>
                        <MenuIcon/>
                    </IconButton>
            </Box>
            <Divider sx={{mb: '10px'}} />
            <Box
                ref={messagesContainerRef}
                sx={{
                    flex: 1,
                    overflow: 'auto',
                    minHeight: 0,
                    mb: '80px'
                }}
            >
            { isFetching && !data && <CircularProgress />}
                {data && data.messages?.map(message => {
                    const hasImage = message.media_type === 'image' && message.media_url
                    const hasText = message.text && message.text.trim() !== ''
                    
                    if (message.direction === "in") {
                        return (
                            <Box
                                key={message.id}
                                ref={(el: HTMLDivElement | null) => {
                                    if (el && message.id > 0) {
                                        messageRefs.current.set(message.id, el)
                                    } else if (!el && message.id > 0) {
                                        messageRefs.current.delete(message.id)
                                    }
                                }}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    gap: '5px',
                                    m: '12px 0px'
                                }}
                            >
                                <Box
                                    component="img"
                                    src={displayProfile?.profile_pic || "/icons/ava-grey.png"}
                                    alt="avatar"
                                    width={40}
                                    height={40}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.src = "/icons/ava-grey.png"
                                    }}
                                    sx={{
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        flexShrink: 0
                                    }}
                                />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: hasImage && hasText ? '8px' : 0,
                                        maxWidth: '70%'
                                    }}
                                >
                                    {hasImage && (
                                        <Box
                                            component="img"
                                            src={message.media_url || ''}
                                            alt="Message image"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement
                                                target.style.display = 'none'
                                            }}
                                            sx={{
                                                maxWidth: '100%',
                                                height: 'auto',
                                                borderRadius: '12px',
                                                border: '1px solid #F9FAFB',
                                                objectFit: 'contain',
                                                maxHeight: '400px'
                                            }}
                                        />
                                    )}
                                    {hasText && (
                                        <Typography
                                            component="p"
                                            sx={{
                                                fontSize: '15px',
                                                border: '1px solid #F9FAFB',
                                                borderRadius: hasImage ? '12px' : '16px',
                                                backgroundColor: '#F9FAFB',
                                                p: '10px 10px',
                                                wordBreak: 'break-word'
                                            }}
                                        >
                                            {message.text}
                                        </Typography>
                                    )}
                                </Box>
                                <Typography
                                    component="p"
                                    fontSize={12}
                                    sx={{ flexShrink: 0 }}
                                >
                                    {dayjs(message.sent_at).format("HH:MM")}
                                </Typography>
                            </Box>
                        )
                    }
                    return (
                        <Box
                            key={message.id}
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-end',
                                gap: '5px',
                                m: '12px 0px',
                                justifyContent: 'end'
                            }}
                            >
                            <Typography
                                component="p"
                                fontSize={12}
                                sx={{ flexShrink: 0 }}
                            >
                                {dayjs(message.sent_at).format("HH:MM")}
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: hasImage && hasText ? '8px' : 0,
                                    maxWidth: '70%'
                                }}
                            >
                                {hasImage && (
                                    <Box
                                        component="img"
                                        src={message.media_url || ''}
                                        alt="Message image"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement
                                            target.style.display = 'none'
                                        }}
                                        sx={{
                                            maxWidth: '100%',
                                            height: 'auto',
                                            borderRadius: '12px',
                                            border: '1px solid #84E1BC',
                                            objectFit: 'contain',
                                            maxHeight: '400px'
                                        }}
                                    />
                                )}
                                {hasText && (
                                    <Typography
                                        component="p"
                                        sx={{
                                            fontSize: '15px',
                                            border: '1px solid #84E1BC',
                                            borderRadius: hasImage ? '12px' : '16px',
                                            backgroundColor: '#84E1BC',
                                            p: '10px 10px',
                                            wordBreak: 'break-word'
                                        }}
                                    >
                                        {message.text}
                                    </Typography>
                                )}
                            </Box>
                            </Box>
                    )
                })}
                
                {/* Невидимый элемент для прокрутки к последнему сообщению */}
                <div ref={messagesEndRef} />

                {/* Image preview */}
                {imagePreview && selectedImage && (
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: '100px',
                            left: '24px',
                            right: '24px',
                            zIndex: 10,
                            p: 1,
                            bgcolor: 'background.paper',
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <Box
                            component="img"
                            src={imagePreview}
                            alt="Preview"
                            sx={{
                                width: 60,
                                height: 60,
                                objectFit: 'cover',
                                borderRadius: 1,
                            }}
                        />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" noWrap>
                                {selectedImage.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {(selectedImage.size / 1024).toFixed(1)} KB
                            </Typography>
                        </Box>
                        <IconButton
                            size="small"
                            onClick={handleRemoveImage}
                            sx={{ color: 'error.main' }}
                        >
                            <Box component="span" sx={{ fontSize: '1.2rem' }}>×</Box>
                        </IconButton>
                    </Box>
                )}

                <form onSubmit={handleSubmit} style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', zIndex: 10 }}>
                    <TextField
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        id="outlined-basic"
                        label='Написать сообщение'
                        variant="outlined"
                        multiline
                        minRows={1}
                        maxRows={5}
                        fullWidth
                        sx={{
                            '& .MuiInputBase-root': {
                                alignItems: 'center'
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconButton
                                        size="small"
                                        onClick={handleImageIconClick}
                                        sx={{ p: 0.5 }}
                                    >
                                        <ImgIcon/>
                                    </IconButton>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                        style={{ display: 'none' }}
                                        onChange={handleImageSelect}
                                    />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() => setProductModalOpen(true)}
                                        sx={{ mr: 0.5 }}
                                    >
                                        <ShoppingCartOutlinedIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton type="submit" size="small">
                                        <SendIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </form>
            </Box>

            <ProductSelectionModal
                open={productModalOpen}
                onClose={() => setProductModalOpen(false)}
                onSelectProducts={handleSelectProducts}
            />
        </Board>
    )
}