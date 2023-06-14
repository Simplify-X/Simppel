// ** React Imports
// @ts-nocheck
import { useState, Fragment, ChangeEvent, MouseEvent, ReactNode, useRef } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import { FormHelperText, Snackbar } from '@mui/material'
import { Alert } from '@mui/material'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import * as Sentry from '@sentry/nextjs'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import { Step, StepLabel, Stepper } from '@mui/material'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import { validateUserInput } from 'src/@core/utils/validation'
import LoadCountry from 'src/@core/layouts/components/LoadCountry'

interface State {
  password: string
  showPassword: boolean
}

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '35rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(4),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const RegisterPage = () => {
  const steps = ['Account Data', 'Personal Data']
  const [activeStep, setActiveStep] = useState(0)
  const { loading, error, post } = useCustomApiHook()

  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  function handleSnackbarClose() {
    setOpenSnackbar(false)
  }

  const handleNext = (event: React.FormEvent<HTMLFormElement>) => {
    if (activeStep === steps.length - 1) {
      if (formError?.postalCode || formError?.phoneNumber || formError?.city || formError?.country) {
        toast.error('Please fill all required fields.')

        return
      }
      if (!formInfo?.postalCode || !formInfo?.phoneNumber || !formInfo?.city || !formInfo?.country) {
        toast.error('Please fill all required fields.')

        return
      }
      submitForm(event)
    } else {
      if (formError?.firstName || formError?.lastName || formError?.username || formError?.email || formError?.password)
        return
      if (
        !formInfo?.firstName ||
        !formInfo?.lastName ||
        !formInfo?.username ||
        !formInfo?.email ||
        !formInfo?.password
      ) {
        toast.error('Please fill all required fields.')

        return
      }

      setActiveStep(prevActiveStep => prevActiveStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  // ** States
  const [values, setValues] = useState<State>({
    password: '',
    showPassword: false
  })
  const [formInfo, setFormInfo] = useState({
    firstName: '',
    lastName: '',
    password: '',
    username: '',
    email: '',
    address: '',
    country: '',
    postalCode: '',
    city: '',
    phoneNumber: ''
  })
  const passwordRef = useRef<HTMLInputElement>(null)
  const agreeRef = useRef<HTMLInputElement>(false)

  const [formError, setFormError] = useState<object | null>(null)

  const theme = useTheme()
  const router = useRouter()

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleFormInfoChange = e => {
    const formData = { ...formInfo, [e.target.id]: e.target.value }
    setFormError(validateUserInput(formData, e.target.id))
    setFormInfo(formData)
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const isCheck = agreeRef.current?.checked

    if (!isCheck) {
      toast.error('Please agree with the terms', { autoClose: 3000 })

      return
    }

    const data = JSON.stringify({
      firstName: formInfo.firstName,
      lastName: formInfo.lastName,
      username: formInfo.username,
      email: formInfo.email,
      password: formInfo.password,
      address: formInfo.address,
      postalCode: formInfo.postalCode,
      city: formInfo.city,
      phoneNumber: formInfo.phoneNumber,
      country: formInfo.country
    })

    const r = await post('/users/register', data)

    const status = r?.data.status

    if (status === 'OK') {
      setSnackbarMessage('Successfully Registered')
      setSnackbarSeverity('success')
      setOpenSnackbar(true)

      // Delay the redirection by 2 seconds
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }

    status === 'FAILED' &&
      r?.data.message === 'Error' &&
      setFormInfo({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        address: '',
        country: '',
        postalCode: '',
        city: '',
        phoneNumber: '',
        password: ''
      })

    if (r?.data.message === 'Exists') {
      setSnackbarMessage('Username or Email already exists')
      setSnackbarSeverity('error')
      setOpenSnackbar(true)

      // setActiveStep(0)
    }

    if (r?.data.message === 'Error') {
      setSnackbarMessage('Failed to register, please try again later')
      setSnackbarSeverity('error')
      setOpenSnackbar(true)
      Sentry.captureException(error)
    }

    if (error) {
      console.log(error, 'EEEEEEEEE')
      setSnackbarMessage('Failed to register, please try again later')
      setSnackbarSeverity('error')
      setOpenSnackbar(true)
      Sentry.captureException(error)
    }
  }

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Stepper activeStep={activeStep}>
            {steps.map(label => {
              const stepProps: { completed?: boolean } = {}
              const labelProps: {
                optional?: React.ReactNode
              } = {}

              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              )
            })}
          </Stepper>
          <br />

          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg
              width={35}
              height={50}
              version='1.1'
              viewBox='0 0 30 23'
              xmlns='http://www.w3.org/2000/svg'
              xmlnsXlink='http://www.w3.org/1999/xlink'
            >
              <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                <path
                  d='M31.952 14.751a260.51 260.51 0 00-4.359-4.407C23.932 6.734 20.16 3.182 16.171 0c1.634.017 3.21.28 4.692.751 3.487 3.114 6.846 6.398 10.163 9.737.493 1.346.811 2.776.926 4.262zm-1.388 7.883c-2.496-2.597-5.051-5.12-7.737-7.471-3.706-3.246-10.693-9.81-15.736-7.418-4.552 2.158-4.717 10.543-4.96 16.238A15.926 15.926 0 010 16C0 9.799 3.528 4.421 8.686 1.766c1.82.593 3.593 1.675 5.038 2.587 6.569 4.14 12.29 9.71 17.792 15.57-.237.94-.557 1.846-.952 2.711zm-4.505 5.81a56.161 56.161 0 00-1.007-.823c-2.574-2.054-6.087-4.805-9.394-4.044-3.022.695-4.264 4.267-4.97 7.52a15.945 15.945 0 01-3.665-1.85c.366-3.242.89-6.675 2.405-9.364 2.315-4.107 6.287-3.072 9.613-1.132 3.36 1.96 6.417 4.572 9.313 7.417a16.097 16.097 0 01-2.295 2.275z'
                  fill={theme.palette.primary.main} // Use the primary color from theme
                />
              </g>
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
              Start your Registration here
            </Typography>
            <Typography variant='body2'>Make your app management easy and fun!</Typography>
          </Box>
          <form autoComplete='off' onSubmit={submitForm}>
            {activeStep === 0 ? (
              <>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <TextField
                      autoFocus
                      fullWidth
                      id='firstName'
                      label='First Name'
                      sx={{ marginBottom: 4 }}
                      value={formInfo.firstName}
                      onChange={handleFormInfoChange}
                      error={formError?.firstName ? true : false}
                      helperText={formError?.firstName ?? ''}
                      required
                    />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <TextField
                      autoFocus
                      fullWidth
                      id='lastName'
                      label='Last Name'
                      sx={{ marginBottom: 4 }}
                      value={formInfo.lastName}
                      onChange={handleFormInfoChange}
                      error={formError?.lastName ? true : false}
                      helperText={formError?.lastName ?? ''}
                      required
                    />
                  </Box>
                </Box>

                <TextField
                  autoFocus
                  fullWidth
                  id='username'
                  label='Username'
                  sx={{ marginBottom: 4 }}
                  value={formInfo.username}
                  onChange={handleFormInfoChange}
                  error={formError?.username ? true : false}
                  helperText={formError?.username ?? ''}
                  required
                />
                <TextField
                  value={formInfo.email}
                  id='email'
                  fullWidth
                  type='email'
                  label='Email'
                  sx={{ marginBottom: 4 }}
                  onChange={handleFormInfoChange}
                  error={formError?.email ? true : false}
                  helperText={formError?.email ?? ''}
                  required
                />
                <FormControl fullWidth>
                  <InputLabel required htmlFor='auth-register-password'>
                    Password
                  </InputLabel>
                  <OutlinedInput
                    label='Password'
                    value={formInfo.password}
                    id='password'
                    type={values.showPassword ? 'text' : 'password'}
                    controlledValue={formInfo.password}
                    error={formError?.password ? true : false}
                    onChange={e => {
                      handleChange('password')(e) // Call the handleChange function for the controlled component
                      handleFormInfoChange(e)
                    }}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          aria-label='toggle password visibility'
                        >
                          {values.showPassword ? <EyeOutline fontSize='small' /> : <EyeOffOutline fontSize='small' />}
                        </IconButton>
                      </InputAdornment>
                    }
                    inputRef={passwordRef}
                    required
                  />
                  {formError?.password && (
                    <FormHelperText error id='form-error'>
                      {formError.password}
                    </FormHelperText>
                  )}
                </FormControl>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    marginTop: '30px'
                  }}
                >
                  <Typography variant='body2' sx={{ marginRight: 2 }}>
                    Already have an account?
                  </Typography>
                  <Typography variant='body2'>
                    <Link passHref href='/login'>
                      <LinkStyled>Sign in instead</LinkStyled>
                    </Link>
                  </Typography>
                </Box>
                <Divider sx={{ my: 5 }}></Divider>
              </>
            ) : (
              <>
                <TextField
                  value={formInfo.address}
                  fullWidth
                  id='address'
                  label='Address Line'
                  variant='outlined'
                  sx={{ marginBottom: 4 }}
                  onChange={handleFormInfoChange}
                  error={formError?.address ? true : false}
                  helperText={formError?.address ?? ''}
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    value={formInfo.postalCode}
                    fullWidth
                    id='postalCode'
                    label='Postal code'
                    variant='outlined'
                    sx={{ marginBottom: 4 }}
                    onChange={handleFormInfoChange}
                    error={formError?.postalCode ? true : false}
                    helperText={formError?.postalCode ?? ''}
                  />
                  <TextField
                    value={formInfo.city}
                    fullWidth
                    id='city'
                    label='City/Place'
                    variant='outlined'
                    sx={{ marginBottom: 4 }}
                    onChange={handleFormInfoChange}
                    error={formError?.city ? true : false}
                    helperText={formError?.city ?? ''}
                  />
                </Box>
                <TextField
                  value={formInfo.phoneNumber}
                  fullWidth
                  id='phoneNumber'
                  label='Phone Number'
                  variant='outlined'
                  sx={{ marginBottom: 4 }}
                  onChange={handleFormInfoChange}
                  error={formError?.phoneNumber ? true : false}
                  helperText={formError?.phoneNumber ?? ''}
                />

                <LoadCountry
                  searchTerm={formInfo?.country}
                  handleChange={c => setFormInfo({ ...formInfo, country: c })}
                />

                <FormControlLabel
                  control={<Checkbox />}
                  label={
                    <Fragment>
                      <span>I agree to </span>
                      <Link href='/' passHref>
                        <LinkStyled onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                          privacy policy & terms
                        </LinkStyled>
                      </Link>
                    </Fragment>
                  }
                  inputRef={agreeRef}
                  required
                />

                {/* <Button fullWidth size='large' type='submit' variant='contained' sx={{ marginBottom: 7 }}>
                  Sign up
                </Button> */}
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Typography variant='body2' sx={{ marginRight: 2 }}>
                    Already have an account?
                  </Typography>
                  <Typography variant='body2'>
                    <Link passHref href='/login'>
                      <LinkStyled>Sign in instead</LinkStyled>
                    </Link>
                  </Typography>
                </Box>
                <Divider sx={{ my: 5 }}></Divider>
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
              </>
            )}
          </form>

          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button variant='contained' disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Previous Step
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />

            <Button disabled={loading} variant='contained' onClick={handleNext}>
              {activeStep === steps.length - 1 ? (loading ? 'Signing Up...' : 'Sign Up') : 'Next Step'}
            </Button>
          </Box>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />

      <ToastContainer position={'top-center'} draggable={false} />
    </Box>
  )
}

RegisterPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default RegisterPage
