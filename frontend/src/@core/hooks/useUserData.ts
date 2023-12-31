// @ts-nocheck
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import * as Sentry from '@sentry/react'
import useCustomApiHook from './useCustomApiHook'

interface UserData {
  accountId?: string
}

type UserType = 'me' | 'my'

export const useUserData = () => {
  const [accountId, setAccountId] = useState<UserData | undefined>()
  const [userId, setUserId] = useState<UserData | undefined>()
  const [token, setToken] = useState<string>('')
  const { error, get } = useCustomApiHook()

  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
      // Token not found, redirect to login page
      window.location.replace('/login')

      return
    }

    setToken(token)

    const fetchUserData = async (type: UserType, token: string) => {
      const response = await get(`/users/${type}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response?.data) {
        type === 'me' && setAccountId(response?.data)
        type === 'my' && setUserId(response?.data)
      } else {
        window.location.replace('/login')
        throw new Error('Invalid token')
      }
    }

    token && fetchUserData('me', token)
    token && fetchUserData('my', token)
  }, [])

  useEffect(() => {
    if (error) {
      Sentry.captureException(error)

      // window.location.replace('/login')
    }
  }, [error])


  return {accountId, userId, token};
}
