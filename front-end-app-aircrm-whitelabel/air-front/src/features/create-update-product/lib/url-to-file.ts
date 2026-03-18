/**
 * Converts an image URL to a File object for use with FileUploader component
 * @param url - The image URL to convert
 * @param filename - The filename to use for the File object
 * @returns Promise<File> - The converted File object
 */
export const urlToFile = async (url: string, filename: string): Promise<File> => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    
    // Create a File object from the blob
    const file = new File([blob], filename, {
      type: blob.type || 'image/jpeg',
      lastModified: Date.now(),
    })
    
    return file
  } catch (error) {
    console.error('Error converting URL to File:', error)
    throw error
  }
}

/**
 * Safely converts an image URL to a File object with error handling
 * @param url - The image URL to convert
 * @param filename - The filename to use for the File object
 * @returns Promise<File | null> - The converted File object or null if failed
 */
export const safeUrlToFile = async (url: string, filename: string): Promise<File | null> => {
  try {
    return await urlToFile(url, filename)
  } catch (error) {
    console.warn('Failed to convert URL to File:', error)
    return null
  }
}
