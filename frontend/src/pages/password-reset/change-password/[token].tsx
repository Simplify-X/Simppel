// @ts-nocheck
// ** React Imports
import { MouseEvent, ReactNode, useEffect, useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icons Imports
import Google from 'mdi-material-ui/Google'
import Github from 'mdi-material-ui/Github'
import Twitter from 'mdi-material-ui/Twitter'
import Facebook from 'mdi-material-ui/Facebook'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import * as Sentry from '@sentry/nextjs'
import { Snackbar } from '@mui/material'
import { Alert } from '@mui/material'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'

interface State {
  password: string
  confirmPassword: string
  showPassword: boolean
  showConfirmPassword: boolean
  passwordMatch: boolean
  passwordError: string
}

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const ChangePassword = () => {
  // ** State
  const [values, setValues] = useState<State>({
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
    passwordMatch: false,
    passwordError: ''
  })

  // ** Hook
  const theme = useTheme()
  const router = useRouter()
  const [tokenValid, setTokenValid] = useState(true)
  const { response, error, post } = useCustomApiHook()
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  const { token } = router.query

  useEffect(() => {
    // Checking if reset token is valid
    token && handleCheckToken()
  }, [token])

  const handleCheckToken = async () => {
    await post(`/users/checkToken?token=${token}`)
  }

  function handleSnackbarClose() {
    setOpenSnackbar(false)
  }

  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    // Update the password match state and error message based on the new value of the password or confirm password field
    if (prop === 'password') {
      setValues({
        ...values,
        password: value,
        passwordMatch: value === values.confirmPassword,
        passwordError: value === values.confirmPassword ? '' : 'Passwords do not match.'
      })
    } else if (prop === 'confirmPassword') {
      setValues({
        ...values,
        confirmPassword: value,
        passwordMatch: value === values.password,
        passwordError: value === values.password ? '' : 'Passwords do not match.'
      })
    }
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleClickShowConfirmPassword = () => {
    setValues({ ...values, showConfirmPassword: !values.showConfirmPassword })
  }

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const returnToLogin = () => {
    router.push('/')
  }

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    // Preventing the page from reloading
    event.preventDefault()

    const password = event.target[0].value

    await post(`/users/reset-password?token=${token}&password=${password}`)
    setSnackbarMessage('Password Changed Successfully')
    setSnackbarSeverity('success')
    setOpenSnackbar(true)

    setTimeout(() => {
      returnToLogin();
    }, 2000)
  }

  useEffect(() => {
    if (response?.data === 'Invalid or expired token') {
      toast.error(response?.data, { autoClose: 3000 })
      setTokenValid(false)
    }
    if (response?.data === 'valid') {
      toast.success(response?.data, { autoClose: 3000 })
      setTokenValid(true)
      router.push('/')
    }
    if (error) {
      Sentry.captureException(error)
      toast.error(response?.data, { autoClose: 3000 })
      setTokenValid(false)
    }
  }, [response, error])

  return (
    <Box className='content-center'>
      {tokenValid ? (
        <Card sx={{ zIndex: 1 }}>
          <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
            <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg
                width={35}
                height={29}
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
                Reset Password
              </Typography>
              <Typography variant='body2'>Please update your password</Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={submitForm}>
              <ToastContainer position={'top-center'} draggable={false} />
              <FormControl fullWidth>
                <InputLabel htmlFor='auth-login-password'>Password</InputLabel>
                <OutlinedInput
                  label='Password'
                  value={values.password}
                  id='auth-login-password'
                  onChange={handleChange('password')}
                  type={values.showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        aria-label='toggle password visibility'
                      >
                        {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>

              <FormControl fullWidth style={{ marginTop: '10px' }}>
                <InputLabel htmlFor='auth-login-password-confirm'>Password</InputLabel>
                <OutlinedInput
                  label='Confirm Password'
                  value={values.confirmPassword}
                  id='auth-login-password-confirm'
                  onChange={handleChange('confirmPassword')}
                  type={values.showConfirmPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        aria-label='toggle password visibility'
                      >
                        {values.showConfirmPassword ? <EyeOutline /> : <EyeOffOutline />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {values.passwordError && (
                  <Typography variant='caption' color='error'>
                    {values.passwordError}
                  </Typography>
                )}
              </FormControl>

              <Button
                fullWidth
                size='large'
                variant='contained'
                sx={{ marginBottom: 7 }}
                type={'submit'}
                style={{ marginTop: '20px' }}
                disabled={!values.passwordMatch}
              >
                Reset Password
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography variant='body2' sx={{ marginRight: 2 }}>
                  Login to your account
                </Typography>
                <Typography variant='body2'>
                  <Link passHref href='/login'>
                    <LinkStyled>here</LinkStyled>
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
            </form>
          </CardContent>
        </Card>
      ) : (
        <Box>
          <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
            Invalid or expired token
          </Typography>
          <Button
            fullWidth
            size='large'
            variant='contained'
            sx={{ marginBottom: 7 }}
            onClick={returnToLogin}
            style={{ marginTop: '20px' }}
          >
            Return To Login
          </Button>
        </Box>
      )}
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
      <FooterIllustrationsV1 />
    </Box>
  )
}

ChangePassword.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default ChangePassword
