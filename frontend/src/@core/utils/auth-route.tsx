import CircularProgress from '@mui/material/CircularProgress'
import useAuthenticateUser from '../hooks/useAuthenticateUser'
import { useState } from 'react'

const authRoute = (Component: JSX.IntrinsicAttributes) => {
  return (props: JSX.IntrinsicAttributes) => {
    const [user, setUser] = useState()
    const { loading, authenticated } = useAuthenticateUser()

    if (loading) {
      return <CircularProgress />
    }

    if (authenticated) {
      // @ts-ignore
      return <Component {...props} user={user} />
    }
  }
}

export default authRoute
