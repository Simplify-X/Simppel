// ** MUI Imports
// @ts-nocheck
import Grid from '@mui/material/Grid'
import authRoute from 'src/@core/utils/auth-route'
import { useEffect, useState } from 'react'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import Loader from 'src/@core/components/ui/Loader'

interface UserData {
  role?: string,
  advertisementEnabled?: boolean,
  accountId?: string
}

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData>({
    role: '',
    advertisementEnabled: false
  })
  const { error, get } = useCustomApiHook()
  const router = useRouter();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
      window.location.replace('/login')

      return
    }

    token && handleGetUser(token)
  }, [])

  const handleGetUser = async (token: string) => {
    const userData = await get(`/users/role`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    userData?.data && setUserData(userData?.data as UserData)
  }

  useEffect(() => {
    if (error) {
      // Sentry.captureException(error)
    }
  }, [error])

  if(!userData?.accountId) return <Loader/>

  if (userData?.role) {
    router.push("/global-administrator/users")
    
    return <Loader/>
  } else {

  return (
      <Grid container spacing={6}>
        <h1>Comming Soon...</h1>
        </Grid>
  )
}}

export default authRoute(Dashboard);
