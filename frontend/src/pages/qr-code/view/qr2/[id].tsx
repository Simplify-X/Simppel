// @ts-nocheck
import React, { useState, useEffect } from 'react'

// import Avatar from '@mui/material/Avatar'

import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'

// import Link from '@mui/material/Link'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'

// import List from '@mui/material/List'
// import ListItem from '@mui/material/ListItem'
// import ListItemText from '@mui/material/ListItemText'
// import ListItemAvatar from '@mui/material/ListItemAvatar'
// import InfoIcon from '@mui/icons-material/Info';

import { CardMedia } from '@mui/material'

import Confetti from 'react-confetti'

// import { keyframes } from '@emotion/react'
import { API_BASE_URL } from 'src/config'
import { useRouter } from 'next/router'

// import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'

// const pulse = keyframes`
//   0% { transform: scale(1); }
//   50% { transform: scale(1.1); }
//   100% { transform: scale(1); }
// `

// function Copyright(props) {
//   return (
//     <Typography variant='body2' color='text.secondary' align='center' {...props}>
//       {'Copyright © '}
//       <Link color='inherit' href='https://mui.com/'>
//         Your Website
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   )
// }
// linear-gradient(90deg, #081012 1.64%, #1F2427 99.75%)',
const defaultTheme = createTheme({
  palette: {
    background: {
      default: '#081012'
    },
    typography: {
      fontFamily: 'Sora, sans-serif'
    },
    text: {
      primary: '#ffffff' // Add your color here
    }
  }
})

function ClaimYourGift({ setClaimed, data, logoUrl }) {
  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center' }}>
        <Typography
          variant='h4'
          fontFamily='Sora'
          color='#A9A9A9'
          gutterBottom
          align='center'
          sx={{ fontSize: '14px', opacity: '0.8' }}
        >
          Welcome to
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center' }}>
        <Typography
          variant='h4'
          fontFamily='Sora'
          gutterBottom
          align='left'
          sx={{ fontSize: '27px', fontWeight: '600', letterSpacing: '0.27px' }}
        >
          Lux.Club{' '}
          <Typography
            fontFamily='Sora'
            component='span'
            color='#9C6932 '
            sx={{ fontSize: '27px', fontWeight: '600', letterSpacing: '0.27px' }}
          >
            Elite benefits
          </Typography>{' '}
          for selected personal
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center' }}>
        <Typography
          variant='h4'
          fontFamily='Sora'
          color='#A9A9A9'
          gutterBottom
          align='start'
          sx={{ fontSize: '14px', opacity: '0.6', textAlign: 'justify' }}
        >
          {data?.description}
        </Typography>
      </Box>

      <Box
        sx={{
          ml: -3,
          mt: 6,
          px: 3,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'start',
          alignItems: 'center'
        }}
      >
        <CardMedia
          component='img'
          image='/images/car1.png'
          alt='Company Logo'
          style={{
            width: '188px',
            height: '117px'
          }}
        />

        <CardMedia
          component='img'
          image='/images/car2.png'
          alt='Company Logo'
          sx={{
            ml: -15,
            width: '272px',
            height: '172px'
          }}
        />

        <CardMedia
          component='img'
          image='/images/car3.png'
          alt='Company Logo'
          sx={{
            ml: -15,
            mt: 6,
            width: '200px',
            height: '117px'
          }}
        />
      </Box>

      <Box sx={{ mt: 6, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography
          color='#9C6932 '
          fontFamily='Sora'
          sx={{ fontSize: '27px', fontWeight: '600', letterSpacing: '0.27px' }}
        >
          Conditions
        </Typography>

        {logoUrl.length > 0 && (
          <CardMedia
            component='img'
            image={logoUrl[0].url}
            alt='Company Logo'
            style={{
              width: '130px',
              height: '30px'
            }}
          />
        )}
      </Box>
      <Box sx={{ mt: 6, display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center' }}>
        <Typography
          variant='h4'
          fontFamily='Sora'
          color='#A9A9A9'
          gutterBottom
          align='start'
          sx={{ fontSize: '14px', opacity: '0.6', textAlign: 'justify' }}
        >
          A. {data?.firstRule}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center' }}>
        <Typography
          variant='h4'
          fontFamily='Sora'
          color='#A9A9A9'
          gutterBottom
          align='start'
          sx={{ fontSize: '14px', opacity: '0.6', textAlign: 'justify' }}
        >
          B. {data?.secondRule}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center' }}>
        <Typography
          variant='h4'
          fontFamily='Sora'
          color='#A9A9A9'
          gutterBottom
          align='start'
          sx={{ fontSize: '14px', opacity: '0.6', textAlign: 'justify' }}
        >
          C. {data?.thirdRule}
        </Typography>
      </Box>

      <Box sx={{ px: 1, pd: 3 }}>
        <Button
          onClick={() => setClaimed(true)}
          variant='contained'
          sx={{
            mt: 3,
            background:
              'linear-gradient(292deg, #4A3228 1.28%, #9C6932 7.15%, #A97C3B 11.06%, #EFDD87 21.81%, #E0C776 25.72%, #C8A25A 32.56%, #B98B48 39.4%, #B48342 43.31%, #EBBF68 53.09%, #B48342 66.77%, #B0803D 75.57%, #E5B863 87.3%, #B1813E 92.19%, #8F5C25 95.12%, #4A3228 99.03%)',
            color: '#000',
            width: '100%',
            height: '70px',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}
        >
          <Typography fontFamily='Sora' sx={{ fontWeight: '600' }}>
            Claim Your Gift
          </Typography>
        </Button>
      </Box>
    </Box>
  )
}

function Gift({ setPrizeOpened, data, logoUrl }) {
  const [scratched, setScratched] = useState(false)
  const [showGiftComponent, setShowGiftComponent] = useState(false)

  const handleClick = () => {
    setScratched(true)
    setTimeout(() => {
      setShowGiftComponent(true)
    }, 1000)
  }

  return (
    <>
      {showGiftComponent && (
        <>
          {' '}
          <Confetti /> <Congratulations data={data} logoUrl={logoUrl} />{' '}
        </>
      )}
      {!showGiftComponent && (
        <Box sx={{ mt: 3, fontFamily: 'Sora' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {logoUrl.length > 0 && (
              <CardMedia
                component='img'
                image={logoUrl[0].url}
                alt='Company Logo'
                style={{
                  width: '149px',
                  height: '42px'
                }}
              />
            )}
          </Box>

          <Box
            sx={{
              mt: 3,
              px: 3,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'start',
              alignItems: 'center'
            }}
          >
            <Typography
              variant='h4'
              fontFamily='Sora'
              gutterBottom
              align='left'
              sx={{ fontSize: '27px', fontWeight: '600', letterSpacing: '0.27px' }}
            >
              Scratch & Reveal Your{' '}
              <Typography
                component='span'
                color='#9C6932 '
                sx={{
                  fontSize: '27px',
                  fontWeight: '600',
                  letterSpacing: '0.27px'
                }}
              >
                Exclusive Gift
              </Typography>
            </Typography>
          </Box>

          <Box
            sx={{
              px: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {!scratched ? (
              <Button
                onClick={handleClick}
                variant='contained'
                sx={{
                  mt: 3,
                  background:
                    'linear-gradient(292deg, #4A3228 1.28%, #9C6932 7.15%, #A97C3B 11.06%, #EFDD87 21.81%, #E0C776 25.72%, #C8A25A 32.56%, #B98B48 39.4%, #B48342 43.31%, #EBBF68 53.09%, #B48342 66.77%, #B0803D 75.57%, #E5B863 87.3%, #B1813E 92.19%, #8F5C25 95.12%, #4A3228 99.03%)',
                  color: '#000',
                  width: '100%',
                  height: '315px',
                  borderRadius: '50px',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              ></Button>
            ) : (
              <Box sx={{ position: 'relative', mt: 3 }}>
                <CardMedia
                  onClick={() => setPrizeOpened(true)}
                  component='img'
                  image='/images/scratched.png'
                  alt='Company Logo'
                  style={{
                    position: 'relative',
                    height: '315px',
                    width: '100%',
                    zIndex: 1
                  }}
                />

                <Typography
                  sx={{ position: 'absolute', top: '40%', px: '5%' }}
                  fontFamily='Sora'
                  variant='h6'
                  align='center'
                >
                  Voucher Value:10$ + free delivery in Dubai
                </Typography>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              mt: 10,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'start',
              alignItems: 'center'
            }}
          >
            <Typography
              variant='h4'
              fontFamily='Sora'
              color='#A9A9A9'
              gutterBottom
              align='start'
              sx={{ fontSize: '14px', opacity: '0.6', textAlign: 'justify' }}
            >
              Terms & Conditions Apply. Made possible by Lux Club - the luxurious way to save.
            </Typography>
          </Box>
        </Box>
      )}
    </>
  )
}

function Congratulations({ data, logoUrl }) {
  return (
    <Box sx={{ mt: 3, fontFamily: 'Sora' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {logoUrl.length > 0 && (
          <CardMedia
            component='img'
            image={logoUrl[0].url}
            alt='Company Logo'
            style={{
              width: '149px',
              height: '42px'
            }}
          />
        )}
      </Box>

      <Box sx={{ p: 1 }}>
        <Box
          sx={{
            mt: 3,
            p: 3,
            border: '2px solid',
            borderColor: '#9C6932',
            borderRadius: '20px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            alignItems: 'start'
          }}
        >
          <Typography
            component='span'
            color='#9C6932 '
            sx={{
              fontSize: '27px',
              fontWeight: '600',
              letterSpacing: '0.27px'
            }}
          >
            Congratulations!
          </Typography>

          <Typography sx={{ mt: 3, px: 1, textAlign: 'justify' }} fontFamily='Sora' variant='body'>
            You've won:{data?.name}
          </Typography>

          <Typography
            sx={{ mt: 3, px: 1, textAlign: 'justify' }}
            color='#F8F8F8'
            fontFamily='Sora'
            variant='body'
            align='center'
          >
            {data.description}
          </Typography>
          <Box sx={{ mt: 3, px: 1 }}>
            <Typography
              sx={{ mt: 3, px: 1, fontWeight: '600' }}
              color='#F8F8F8'
              fontFamily='Sora'
              variant='h5'
              align='center'
            >
              Voucher Value: {data?.price} %
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: 1, pb: 3 }}>
        <Button
          variant='contained'
          sx={{
            mt: 3,
            background:
              'linear-gradient(292deg, #4A3228 1.28%, #9C6932 7.15%, #A97C3B 11.06%, #EFDD87 21.81%, #E0C776 25.72%, #C8A25A 32.56%, #B98B48 39.4%, #B48342 43.31%, #EBBF68 53.09%, #B48342 66.77%, #B0803D 75.57%, #E5B863 87.3%, #B1813E 92.19%, #8F5C25 95.12%, #4A3228 99.03%)',
            color: '#000',
            width: '100%',
            height: '70px',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}
        >
          <Typography fontFamily='Sora' color='#1A2023' sx={{ fontWeight: '600' }}>
            Claim Your Gift
          </Typography>
        </Button>
      </Box>
    </Box>
  )
}

function InstructionsComponent() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)

  const [imageUrls, setImageUrls] = useState([])

  // const [showConfetti, setShowConfetti] = useState(false);
  // const [countdown,] = useState(15); // 30 seconds for countdown
  const router = useRouter()
  const { id } = router.query
  
  // const { put } = useCustomApiHook()
  const [claimed, setClaimed] = useState(false)
  const [prizeOpened, setPrizeOpened] = useState(false)

  // const startCountdown = () => {
  //   const interval = setInterval(() => {
  //     setCountdown((prevCountdown) => {
  //       if (prevCountdown <= 1) {
  //         clearInterval(interval);

  //         return 0;
  //       }

  //       return prevCountdown - 1;
  //     });
  //   }, 1000);
  // };

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
      fetchData()
    }
  }, [id])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/qr-code/single/${id}`)
      const jsonData = await response.json()
      setData(jsonData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
    setLoading(false)
  }


  // const claimReward = async () => {
  //   try {
  //     const data = {
  //       claimed: true
  //     }

  //     await put(`/qr-code/${id}`, data)
  //   } catch (error) {
  //     console.error('Error fetching data:', error)
  //   }
  //   setLoading(false)
  // }

  // const handleSubmit = event => {
  //   event.preventDefault()

  //   // Handle the form submission logic
  // }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component='main' maxWidth='xs' sx={{ overflowX: 'hidden' }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 3,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box
            sx={{
              m: 1,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {' '}
            {/* Adjust width and height as needed */}
            <CardMedia
              component='img'
              image='/images/lux-club.png'
              alt='Company Logo'
              style={{
                width: '62.15px',
                height: '70px'
              }}
            />
          </Box>

          {/* {showConfetti && <Confetti />} */}

          {/* first componetn */}
          {
            !loading &&
              data &&
              (!claimed && !prizeOpened ? (
                <ClaimYourGift claimed={claimed} setClaimed={setClaimed} data={data} logoUrl={imageUrls} />
              ) : claimed && !prizeOpened ? (
                <Gift setPrizeOpened={setPrizeOpened} data={data} logoUrl={imageUrls} />
              ) : (
                <Congratulations data={data} logoUrl={imageUrls} />
              ))

            // <Congratulations/>
          }
        </Box>
        {/* <Copyright sx={{ mt: 5 }} /> */}
      </Container>
    </ThemeProvider>
  )
}

InstructionsComponent.getLayout = page => page

export default InstructionsComponent
