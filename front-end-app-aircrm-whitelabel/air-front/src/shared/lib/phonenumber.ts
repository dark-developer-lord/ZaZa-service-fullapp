import {
  AsYouType,
  parsePhoneNumber,
  parsePhoneNumberFromString,
} from 'libphonenumber-js'
import * as yup from 'yup'

export const formatPhoneNumber = (phone: string) => {
  const phoneNumber = parsePhoneNumberFromString(phone)

  if (!phoneNumber) {
    return phone
  }

  return new AsYouType().input(phone)
}

export function removeSpaces(str: string) {
  try {
    return str.replace(/\s/g, '')
  } catch (error) {
    return ''
  }
}

function checkPhoneNumber(phone: string): boolean {
  try {
    const phoneNumber = parsePhoneNumber(phone, 'TJ')
    return phoneNumber.isValid()
  } catch (error) {
    return false
  }
}

yup.addMethod(yup.string, 'checkPhone', function (errorMessage) {
  return this.test(`check-phone`, errorMessage, function (value) {
    const { path, createError } = this
    let message = ''
    let isValid = true
    value = value || '1'
    try {
      const phoneNumber = parsePhoneNumber(value, 'TJ')
      if (!(phoneNumber.country === 'TJ' && checkPhoneNumber(value))) {
        message = 'Неверный формат номера телефона или email'
        isValid = false
      }
      if (!value.startsWith('+992')) {
        message = 'Номер телефона должен начинаться с +992'
        isValid = false
      }
    } catch (error) {
      isValid = false
    }

    return isValid || createError({ path, message: errorMessage || message })
  })
})

yup.addMethod(yup.string, 'checkInternationalPhone', function (errorMessage) {
  return this.test(`check-international-phone`, errorMessage, function (value) {
    const { path, createError } = this
    let message = ''
    let isValid = true
    
    if (!value || value.trim() === '') {
      message = errorMessage || 'Номер телефона обязателен для заполнения'
      isValid = false
      return createError({ path, message })
    }

    // Check if phone starts with + (international format)
    if (!value.startsWith('+')) {
      message = errorMessage || 'Номер телефона должен начинаться с + (международный формат)'
      isValid = false
      return createError({ path, message })
    }

    // Validate using libphonenumber-js with any country
    try {
      const phoneNumber = parsePhoneNumberFromString(value)
      if (!phoneNumber || !phoneNumber.isValid()) {
        message = errorMessage || 'Неверный формат международного номера телефона'
        isValid = false
      }
    } catch (error) {
      message = errorMessage || 'Неверный формат международного номера телефона'
      isValid = false
    }

    return isValid || createError({ path, message })
  })
})