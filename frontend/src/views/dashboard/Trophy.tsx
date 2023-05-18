// @ts-nocheck
import { useState, useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import * as Sentry from '@sentry/nextjs'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { API_BASE_URL } from 'src/config'

// Styled component for the triangle shaped background image
const TriangleImg = styled('img')({
  right: 0,
  bottom: 0,
  height: 170,
  position: 'absolute'
})

// Styled component for the trophy image
const TrophyImg = styled('img')({
  right: 36,
  bottom: 20,
  height: 98,
  position: 'absolute'
})

const Trophy = () => {
  // ** Hook
  const theme = useTheme()
  const [userData, setUserData] = useState([])
  const [content, setContent] = useState([])
  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
      // Token not found, redirect to login page
      window.location.replace('/login')

      return
    }

    fetch(`${API_BASE_URL}/users/my`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.ok) {
          // Get account ID from response body
          return response.json()
        } else {
          // Sentry.throwError('Invalid token')
          throw new Error('Invalid token')
        }
      })
      .then(data => {
        // Fetch user data
        return fetch(`${API_BASE_URL}/users/getSingleUser/${data}`).then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error('Error fetching user data')
          }
        })
      })
      .then(userData => {
        // Set user data in state
        setUserData(userData)

        // Fetch advertisements for user
        return fetch(`${API_BASE_URL}/advertisements/${userData.userId}`).then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error('Error fetching advertisements')
          }
        })
      })
      .then(advertisements => {
        // Set advertisements in state
        setContent(advertisements)
      })
      .catch(error => {
        Sentry.captureException(error)
        console.error(error)
      })
  }, [])

  const goToAdverts = () => {
    router.push('/content/view-content')
  }

  const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png'

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        <Typography variant='h6'>Welcome {userData?.firstName} ! 🥳</Typography>
        <Typography variant='body2' sx={{ letterSpacing: '0.25px' }}>
          All created Advertisements
        </Typography>
        <Typography variant='h5' sx={{ my: 4, color: 'primary.main' }}>
          {content.length}
        </Typography>
        <Button size='small' variant='contained' onClick={goToAdverts}>
          View Adverts
        </Button>
        <TriangleImg alt='triangle background' src={`/images/misc/${imageSrc}`} />
        <TrophyImg alt='trophy' src='/images/misc/trophy.png' />
      </CardContent>
    </Card>
  )
}

export default Trophy
