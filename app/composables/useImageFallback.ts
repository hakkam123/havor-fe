const DEFAULT_IMAGE_FALLBACK = '/images/banner/001.jpg'
const INVALID_IMAGE_VALUES = new Set(['null', 'undefined'])

export const useImageFallback = () => {
  const imageSrc = (src?: string | null, fallback = DEFAULT_IMAGE_FALLBACK) => {
    const value = String(src || '').trim()
    return value && !INVALID_IMAGE_VALUES.has(value.toLowerCase()) ? value : fallback
  }

  const handleImageError = (event: Event, fallback = DEFAULT_IMAGE_FALLBACK) => {
    const image = event.target instanceof HTMLImageElement ? event.target : null
    if (!image) return

    const fallbackSrc = imageSrc(fallback, DEFAULT_IMAGE_FALLBACK)
    if (image.getAttribute('src') === fallbackSrc) return

    image.src = fallbackSrc
  }

  return {
    defaultImageFallback: DEFAULT_IMAGE_FALLBACK,
    imageSrc,
    handleImageError
  }
}
