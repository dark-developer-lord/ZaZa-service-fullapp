import { useState, useRef, useEffect, ImgHTMLAttributes } from 'react'
import { Skeleton, Box, SxProps } from '@mui/material'

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  /** Width of the image and its skeleton placeholder */
  width?: number | string
  /** Height of the image and its skeleton placeholder */
  height?: number | string
  /** Aspect ratio maintained when only width or height is given */
  aspectRatio?: string
  sx?: SxProps
  skeletonVariant?: 'rectangular' | 'rounded' | 'circular'
}

/**
 * Drop-in replacement for <img> with:
 * – Native lazy-loading (loading="lazy") for off-screen images
 * – MUI Skeleton placeholder shown until the image loads
 * – IntersectionObserver gate so the network request only starts when near viewport
 */
export const LazyImage = ({
  src,
  alt = '',
  width,
  height,
  aspectRatio,
  sx,
  skeletonVariant = 'rounded',
  style,
  ...rest
}: Props) => {
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const boxStyle: SxProps = {
    width: width ?? '100%',
    height: height ?? 'auto',
    aspectRatio,
    position: 'relative',
    overflow: 'hidden',
    flexShrink: 0,
    ...sx,
  }

  return (
    <Box ref={ref} sx={boxStyle}>
      {!loaded && (
        <Skeleton
          variant={skeletonVariant}
          width="100%"
          height="100%"
          sx={{ position: 'absolute', inset: 0, transform: 'none' }}
        />
      )}
      {inView && src && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)} // hide skeleton even on broken images
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.2s ease',
            ...style,
          }}
          {...rest}
        />
      )}
    </Box>
  )
}
