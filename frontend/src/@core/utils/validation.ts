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
const passwordRegex = /^(?=.*[A-Z])[@!.,?/\-_$%^&*#()a-zA-Z0-9]{6,}$/
const postalCodeRegex = /^[0-9]+$/
const phoneNumberRegex = /^[0-9]+$/
const cityRegex = /^[A-Za-z\s]+$/

export const validateUserInput = (values: User, id: string) => {
  const error: User = {}

  if (id === 'firstName' && values.firstName === '') error.firstName = 'Firstname is required.'
  if (id === 'lastName' && values.lastName === '') error.lastName = 'Lastname is required.'
  if (id === 'username' && values.username === '') error.username = 'Username is required.'

  if (id === 'email' && !emailRegex.test(String(values.email))) {
    error.email = 'Invalid email address'
  }

  if (id === 'password' && !passwordRegex.test(String(values.password))) {
    error.password = 'Password must be atleast 6 characters long with one upercase.'
  }

  if (id === 'postalCode' && !postalCodeRegex.test(String(values.postalCode))) {
    error.postalCode = 'Postal code only numbers.'
  }

  if (id === 'phoneNumber' && !phoneNumberRegex.test(String(values.phoneNumber))) {
    error.phoneNumber = 'Phone number must be only number.'
  }

  if (id === 'city' && !cityRegex.test(String(values.city))) {
    error.city = 'City/Place should be text.'
  }

  if (id === 'country' && String(values.country).trim() === '') {
    error.country = 'Country name required'
  }

  return error
}
