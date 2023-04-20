import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import * as Sentry from '@sentry/react'
import useCustomApiHook from './useCustomApiHook'

interface UserData {
}

type UserType = 'me' | 'my'

export const useUserData = (): [UserData | undefined, UserData | undefined] => {
  const [accountId, setAccountId] = useState<UserData | undefined>()
  const [userId, setUserId] = useState<UserData | undefined>()
  const { loading, error, get } = useCustomApiHook()

  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
      // Token not found, redirect to login page
      window.location.replace('/login')
      return
    }

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


  return [accountId, userId]
}
