// @ts-nocheck
// ** React Imports
import { MouseEvent, ReactNode, useEffect, useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'

// ** Icons Imports
import Google from 'mdi-material-ui/Google'
import Github from 'mdi-material-ui/Github'
import Twitter from 'mdi-material-ui/Twitter'
import Facebook from 'mdi-material-ui/Facebook'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import Cookies from 'js-cookie'
import { Snackbar } from '@mui/material'
import { Alert } from '@mui/material'

import themeConfig from 'src/configs/themeConfig'

import BlankLayout from 'src/@core/layouts/BlankLayout'
import FormField from 'src/@core/components/FormField'
import { useForm } from 'react-hook-form'

import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import jwt_decode from 'jwt-decode'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import { useTranslation } from 'react-i18next'


// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const LoginPage = () => {
  const { response, loading, post } = useCustomApiHook()
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)

  // ... [existing code]

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const { handleSubmit, errors, control } = useForm()

  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
    } else {
      const decodedToken = jwt_decode(token)
      if (decodedToken.exp * 1000 < Date.now()) {
        Cookies.remove('token')
      } else {
        router.push('/')
      }
    }
  })

  function handleSnackbarClose() {
    setOpenSnackbar(false)
  }

  // ** Hook
  const theme = useTheme()
  const router = useRouter()


  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const submitForm = async formData => {
    const { email, password, remember } = formData

    console.log(formData)

    const data = JSON.stringify({
      email,
      password,
      rememberMe: remember
    })
    await post('/users/login/', data)
  }

  useEffect(() => {
    const status = response?.data.status

    if (status === 'OK') {
      Cookies.set('token', response.data.token)
      setSnackbarMessage('Login successful')
      setSnackbarSeverity('success')
      setOpenSnackbar(true)
      router.push('/')
    } else if (status === 'FAILED') {
      setSnackbarMessage('Email or password is incorrect')
      setSnackbarSeverity('error')
      setOpenSnackbar(true)
    }

    // error && Sentry.captureException(error)
  }, [response])

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg
              width={35}
              height={50}
              version='1.1'
              viewBox='0 0 30 23'
              xmlns='http://www.w3.org/2000/svg'
              xmlnsXlink='http://www.w3.org/1999/xlink'
            >
              <path
                d='M31.952 14.751a260.51 260.51 0 00-4.359-4.407C23.932 6.734 20.16 3.182 16.171 0c1.634.017 3.21.28 4.692.751 3.487 3.114 6.846 6.398 10.163 9.737.493 1.346.811 2.776.926 4.262zm-1.388 7.883c-2.496-2.597-5.051-5.12-7.737-7.471-3.706-3.246-10.693-9.81-15.736-7.418-4.552 2.158-4.717 10.543-4.96 16.238A15.926 15.926 0 010 16C0 9.799 3.528 4.421 8.686 1.766c1.82.593 3.593 1.675 5.038 2.587 6.569 4.14 12.29 9.71 17.792 15.57-.237.94-.557 1.846-.952 2.711zm-4.505 5.81a56.161 56.161 0 00-1.007-.823c-2.574-2.054-6.087-4.805-9.394-4.044-3.022.695-4.264 4.267-4.97 7.52a15.945 15.945 0 01-3.665-1.85c.366-3.242.89-6.675 2.405-9.364 2.315-4.107 6.287-3.072 9.613-1.132 3.36 1.96 6.417 4.572 9.313 7.417a16.097 16.097 0 01-2.295 2.275z'
                fill={theme.palette.primary.main} // Use the primary color from theme
              />
            </svg>
            <Typography
              variant='h6'
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important',
                marginTop: '10px'
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              Welcome to {themeConfig.templateName}! 👋🏻
            </Typography>
            <Typography variant='body2'>Please sign-in to your account and start the adventure</Typography>
          </Box>
          <form onSubmit={handleSubmit(submitForm)}>
            <ToastContainer position={'top-center'} draggable={false} />
            <FormField
              as={TextField}
              name='email'
              control={control}
              errors={errors}
              variant='outlined'
              label={t('email')}
              margin='normal'
              required
              fullWidth
            />

            <FormField
              as={
                <TextField
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          aria-label='toggle password visibility'
                        >
                          {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              }
              name='password'
              control={control}
              errors={errors}
              variant='outlined'
              label={t('password')}
              margin='normal'
              type={showPassword ? 'text' : 'password'}
              required
              fullWidth
            />
            <Box
              sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
            >
              <FormControlLabel
                key='remember'
                control={
                  <FormField
                    as={Checkbox}
                    name='remember'
                    control={control}
                    errors={errors}
                    margin='normal'
                    variant='outlined'
                  />
                }
                label={t('remember_me')}
              />

              <Link passHref href='/password-reset'>
                <LinkStyled>Forgot Password?</LinkStyled>
              </Link>
            </Box>
            <Button
              disabled={loading}
              fullWidth
              size='large'
              variant='contained'
              sx={{ marginBottom: 7 }}
              type={'submit'}
            >
              {loading ? 'Loading...' : 'Login'}
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                New on our platform?
              </Typography>
              <Typography variant='body2'>
                <Link passHref href='/register'>
                  <LinkStyled>Create an account</LinkStyled>
                </Link>
              </Typography>
            </Box>
            <Divider sx={{ my: 5 }}>or</Divider>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Link href='/' passHref>
                <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                  <Facebook sx={{ color: '#497ce2' }} />
                </IconButton>
              </Link>
              <Link href='/' passHref>
                <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                  <Twitter sx={{ color: '#1da1f2' }} />
                </IconButton>
              </Link>
              <Link href='/' passHref>
                <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                  <Github
                    sx={{ color: theme => (theme.palette.mode === 'light' ? '#272727' : theme.palette.grey[300]) }}
                  />
                </IconButton>
              </Link>
              <Link href='/' passHref>
                <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                  <Google sx={{ color: '#db4437' }} />
                </IconButton>
              </Link>
            </Box>
            <Snackbar
              open={openSnackbar}
              autoHideDuration={2000}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              onClose={handleSnackbarClose}
            >
              <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </form>
        </CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 2,
            marginRight: 10,
            marginBottom: 2
          }}
        >
          <Button href='/terms-and-conditions' variant='text' size='small' sx={{ marginRight: 1 }}>
            Terms and Conditions
          </Button>
          <Typography variant='body2' sx={{ marginRight: 1 }}>
            |
          </Typography>
          <Button href='/privacy-policy' variant='text' size='small'>
            Privacy Policy
          </Button>
        </Box>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default LoginPage
