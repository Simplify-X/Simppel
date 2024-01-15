// @ts-nocheck
import React, { useState, useEffect } from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import InfoIcon from '@mui/icons-material/Info';

import { CircularProgress, CardMedia, Card, CardContent } from '@mui/material'
import Confetti from 'react-confetti'
import { keyframes } from '@emotion/react'
import { API_BASE_URL } from 'src/config'
import { useRouter } from 'next/router'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`

function Copyright(props) {
  return (
    <Typography variant='body2' color='text.secondary' align='center' {...props}>
      {'Copyright © '}
      <Link color='inherit' href='https://mui.com/'>
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const defaultTheme = createTheme()

function InstructionsComponent() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [imageUrls, setImageUrls] = useState([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [countdown, setCountdown] = useState(15) // 30 seconds for countdown
  const router = useRouter()
  const { id } = router.query
  const { put } = useCustomApiHook()

  const startCountdown = () => {
    const interval = setInterval(() => {
      setCountdown(prevCountdown => {
        if (prevCountdown <= 1) {
          clearInterval(interval)

          return 0
        }

        return prevCountdown - 1
      })
    }, 1000)
  }

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/getImages/fetch/${id}`)
        const imageData = await response.json()
        setImageUrls(imageData.resources)
      } catch (error) {
        console.error('Error fetching images:', error)
      }
    }

    if (id) {
      fetchImages()
    }
  }, [id])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/qr-code/single/${id}`)
      const jsonData = await response.json()
      setData(jsonData)
      setShowConfetti(true)
      setTimeout(() => {
        setShowConfetti(false)
        startCountdown()
      }, 5000)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
    setLoading(false)
  }

  const claimReward = async () => {
    try {
      const data = {
        claimed: true
      }

      await put(`/qr-code/${id}`, data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
    setLoading(false)
  }

  const handleSubmit = event => {
    event.preventDefault()

    // Handle the form submission logic
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Box sx={{ m: 1, width: 200, height: 200, overflow: 'hidden' }}>
            {' '}
            {/* Adjust width and height as needed */}
            {imageUrls.length > 0 && (
              <CardMedia
                component='img'
                image={imageUrls[0].url}
                alt='Company Logo'
                style={{
                  maxWidth: '100%', // Adjust size as needed
                  maxHeight: '100%'
                }}
              />
            )}
          </Box>
          <Typography component='h1' variant='h5'>
            Club Member Instructions
          </Typography>
          {showConfetti && <Confetti />}
          {!loading && !data && (
            <Box component='form' noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <InfoIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary='Club rule 1' secondary='Jan 9, 2014' />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <InfoIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary='Club rule 2' secondary='Jan 7, 2014' />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <InfoIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary='Club rule 3' secondary='July 20, 2014' />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <InfoIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary='Club rule 4' secondary='July 20, 2014' />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <InfoIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary='Club rule 5' secondary='July 20, 2014' />
                </ListItem>
              </List>
              <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }} onClick={fetchData}>
                Open Voucher
              </Button>
            </Box>
          )}

          {loading && <CircularProgress />}
          {!loading && data && (
            <Card
              sx={{
                maxWidth: 345,
                my: 2,
                borderRadius: '15px', // Rounded corners
                boxShadow: '0px 0px 10px #ccc', // Shadow for depth
                backgroundImage: 'url(path-to-ticket-background)', // Optional background image
                backgroundColor: '#f0f0f0', // Or use a background color
                padding: '20px'
              }}
            >
              <CardContent>
                <Typography variant='h4' gutterBottom align='center'>
                  Congratulations!
                </Typography>
                <Typography variant='h6' align='center'>
                  You've won: {data.name ? data.name : 'A Special Prize'}
                </Typography>
                <Typography variant='subtitle1' align='center' sx={{ mb: 2 }}>
                  {data.description ? data.description : 'Enjoy your reward!'}
                </Typography>
                <Box
                  sx={{
                    backgroundColor: '#e0e0e0',
                    padding: '10px',
                    borderRadius: '8px',
                    margin: '10px 0',
                    boxShadow: 'inset 0px 0px 10px #bbb'
                  }}
                >
                  <Typography variant='h5' color='secondary' align='center' sx={{ fontWeight: 'bold' }}>
                    Voucher Value: {data.price ? `$${data.price}` : 'Priceless'}
                  </Typography>
                </Box>
                <Box sx={{ mt: 3 }}>
                  {countdown > 0 ? (
                    <Typography
                      variant='h6'
                      color={countdown <= 10 ? 'error' : 'secondary'}
                      sx={{
                        animation: `${pulse} 1s infinite`,
                        fontWeight: 'bold'
                      }}
                    >
                      Claim within: {countdown} seconds!
                    </Typography>
                  ) : (
                    <Typography variant='h4' color='error'>
                      Time Expired!
                    </Typography>
                  )}
                  {countdown > 0 && countdown <= 15 && (
                    <Button
                      variant='contained'
                      color='error'
                      size='large'
                      sx={{ mt: 2, animation: `${pulse} 1s infinite` }}
                      onClick={() => {
                        claimReward()
                      }}
                    >
                      Claim Now!
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  )
}

InstructionsComponent.getLayout = page => page

export default InstructionsComponent
