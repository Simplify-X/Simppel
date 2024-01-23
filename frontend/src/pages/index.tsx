// ** MUI Imports
// @ts-nocheck

import Typography from '@mui/material/Typography'
import authRoute from 'src/@core/utils/auth-route'
import { useEffect, useState } from 'react'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import Loader from 'src/@core/components/ui/Loader'
import FirstSettings from '../views/modal-templates/firstSettings'
import { useTheme } from '@mui/material/styles'
import themeConfig from 'src/configs/themeConfig'

interface UserData {
  role?: string
  advertisementEnabled?: boolean
  accountId?: string
}

const svgHeight = '80'
const svgWidth = '60'

const Dashboard = () => {
  const theme = useTheme()
  const [userData, setUserData] = useState<UserData>({
    role: '',
    advertisementEnabled: false
  })
  const { error, get } = useCustomApiHook()
  const router = useRouter()

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
      window.location.replace('/login')

      return
    }

    token && handleGetUser(token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (!userData?.accountId) return <Loader />

  if (userData?.role) {
    router.push('/global-administrator/users')

    return <Loader />
  } else if (!userData?.firstTimeLoggedIn) {
    return <FirstSettings />
  } else {
    return (
      <>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: '100%',
            overflow: 'hidden'
          }}
        >
          <svg
            width={svgWidth}
            height={svgHeight}
            version='1.1'
            viewBox='0 0 30 23'
            xmlns='http://www.w3.org/2000/svg'
            xmlnsXlink='http://www.w3.org/1999/xlink'
          >
            <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
              <path
                d='M31.952 14.751a260.51 260.51 0 00-4.359-4.407C23.932 6.734 20.16 3.182 16.171 0c1.634.017 3.21.28 4.692.751 3.487 3.114 6.846 6.398 10.163 9.737.493 1.346.811 2.776.926 4.262zm-1.388 7.883c-2.496-2.597-5.051-5.12-7.737-7.471-3.706-3.246-10.693-9.81-15.736-7.418-4.552 2.158-4.717 10.543-4.96 16.238A15.926 15.926 0 010 16C0 9.799 3.528 4.421 8.686 1.766c1.82.593 3.593 1.675 5.038 2.587 6.569 4.14 12.29 9.71 17.792 15.57-.237.94-.557 1.846-.952 2.711zm-4.505 5.81a56.161 56.161 0 00-1.007-.823c-2.574-2.054-6.087-4.805-9.394-4.044-3.022.695-4.264 4.267-4.97 7.52a15.945 15.945 0 01-3.665-1.85c.366-3.242.89-6.675 2.405-9.364 2.315-4.107 6.287-3.072 9.613-1.132 3.36 1.96 6.417 4.572 9.313 7.417a16.097 16.097 0 01-2.295 2.275z'
                fill={theme.palette.primary.main}
              />
            </g>
          </svg>
          <Typography
            variant='h6'
            sx={{
              ml: 3,
              lineHeight: 1,
              fontWeight: 600,
              fontSize: '80px !important',
              fontFamily: 'Helvetica, Arial, sans-serif',
              marginTop: '10px',
              color: theme.palette.primary.main
            }}
          >
            {themeConfig.templateName}
          </Typography>
        </div>
      </>
    )
  }
}

export default authRoute(Dashboard)
