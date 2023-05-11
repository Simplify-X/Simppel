interface User {
  firstName?: string
  lastName?: string
  username?: string
  address?: string
  email?: string
  password?: string
  postalCode?: number | string
  phoneNumber?: number | string
  city?: string
  country?: string
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^(?=.*[A-Z])[a-zA-Z0-9]{6,}$/
const postalCodeRegex = /^[0-9]+$/
const phoneNumberRegex = /^[0-9]+$/

export const validateUserInput = (values: User, id: string) => {
  const error: User = {}

  console.log("object");

  if (values.firstName === '') error.firstName = 'Firstname is required.'
  if (values.lastName === '') error.lastName = 'Lastname is required.'
  if (values.username === '') error.username = 'Username is required.'

  if (!emailRegex.test(String(values.email))) {
    error.email = 'Invalid email address'
  }

  if (!passwordRegex.test(String(values.password))) {
    error.password = 'Password must be atleast 6 characters long with one upercase.'
  }

  if (!postalCodeRegex.test(String(values.postalCode))) {
    error.postalCode = 'Postal code only numbers.'
  }

  if (!phoneNumberRegex.test(String(values.phoneNumber))) {
    error.phoneNumber = 'Phone number must be only number.'
  }

  if (String(values.city).trim() === '') {
    error.city = 'City/Place should be text.'
  }

  if (String(values.country).trim() === '') {
    error.country = "Country name isn't correct"
  }

  return error
}
