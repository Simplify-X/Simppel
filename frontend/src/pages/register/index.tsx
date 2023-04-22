// ** React Imports
// @ts-nocheck
import { useState, Fragment, ChangeEvent, MouseEvent, ReactNode, useRef, useEffect } from 'react'

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
import { Snackbar } from '@mui/material'
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
  const { response, loading, error, post } = useCustomApiHook()

  const [open, setOpen] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleCloseError = () => {
    setErrorOpen(false)
  }

  const handleNext = (event: React.FormEvent<HTMLFormElement>) => {
    if (activeStep === steps.length - 1) {
      submitForm(event)
    } else {
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
  const [formInfo, setformInfo] = useState({
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

  const [emailError, setEmailError] = useState('')

  // ** Hook
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

  // const [emailError, setEmailError] = useState(false);

  function validateEmail(email) {
    // use a regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    return emailRegex.test(email)
  }

  function handleEmailChange(e) {
    setformInfo({ ...formInfo, email: e.target.value })
    setEmailError(!validateEmail(e.target.value))
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const isCheck = agreeRef.current?.checked

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/ // regular expression for email validation
    if (!emailRegex.test(formInfo.email!)) {
      setEmailError('Invalid email address')

      return
    }

    if (!isCheck) {
      toast.error('Please agree with the terms', { autoClose: 3000 })

      return
    }

    // Add form validation logic
    if (!formInfo.username || !formInfo.email || !formInfo.password || !formInfo.firstName || !formInfo.lastName) {
      toast.error('Please fill in all the fields', { autoClose: 3000 })

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

    if (isCheck) await post('/users/register', data)
  }

  useEffect(() => {
    const status = response?.data.status
    console.log(response)

    if (status === 'OK') {
      setOpen(true)
      router.push('/')
    }

    status === 'FAILED' &&
      setformInfo({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        address: '',
        country: '',
        postalCode: '',
        city: '',
        phoneNumber: ''
      })

    if (error) {
      setErrorOpen(true)
      Sentry.captureException(error)
    }
  }, [response, error])

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
              height={29}
              version='1.1'
              viewBox='0 0 30 23'
              xmlns='http://www.w3.org/2000/svg'
              xmlnsXlink='http://www.w3.org/1999/xlink'
            >
              <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                <g id='Artboard' transform='translate(-95.000000, -51.000000)'>
                  <g id='logo' transform='translate(95.000000, 50.000000)'>
                    <path
                      id='Combined-Shape'
                      fill={theme.palette.primary.main}
                      d='M30,21.3918362 C30,21.7535219 29.9019196,22.1084381 29.7162004,22.4188007 C29.1490236,23.366632 27.9208668,23.6752135 26.9730355,23.1080366 L26.9730355,23.1080366 L23.714971,21.1584295 C23.1114106,20.7972624 22.7419355,20.1455972 22.7419355,19.4422291 L22.7419355,19.4422291 L22.741,12.7425689 L15,17.1774194 L7.258,12.7425689 L7.25806452,19.4422291 C7.25806452,20.1455972 6.88858935,20.7972624 6.28502902,21.1584295 L3.0269645,23.1080366 C2.07913318,23.6752135 0.850976404,23.366632 0.283799571,22.4188007 C0.0980803893,22.1084381 2.0190442e-15,21.7535219 0,21.3918362 L0,3.58469444 L0.00548573643,3.43543209 L0.00548573643,3.43543209 L0,3.5715689 C3.0881846e-16,2.4669994 0.8954305,1.5715689 2,1.5715689 C2.36889529,1.5715689 2.73060353,1.67359571 3.04512412,1.86636639 L15,9.19354839 L26.9548759,1.86636639 C27.2693965,1.67359571 27.6311047,1.5715689 28,1.5715689 C29.1045695,1.5715689 30,2.4669994 30,3.5715689 L30,3.5715689 Z'
                    />
                    <polygon
                      id='Rectangle'
                      opacity='0.077704'
                      fill={theme.palette.common.black}
                      points='0 8.58870968 7.25806452 12.7505183 7.25806452 16.8305646'
                    />
                    <polygon
                      id='Rectangle'
                      opacity='0.077704'
                      fill={theme.palette.common.black}
                      points='0 8.58870968 7.25806452 12.6445567 7.25806452 15.1370162'
                    />
                    <polygon
                      id='Rectangle'
                      opacity='0.077704'
                      fill={theme.palette.common.black}
                      points='22.7419355 8.58870968 30 12.7417372 30 16.9537453'
                      transform='translate(26.370968, 12.771227) scale(-1, 1) translate(-26.370968, -12.771227) '
                    />
                    <polygon
                      id='Rectangle'
                      opacity='0.077704'
                      fill={theme.palette.common.black}
                      points='22.7419355 8.58870968 30 12.6409734 30 15.2601969'
                      transform='translate(26.370968, 11.924453) scale(-1, 1) translate(-26.370968, -11.924453) '
                    />
                    <path
                      id='Rectangle'
                      fillOpacity='0.15'
                      fill={theme.palette.common.white}
                      d='M3.04512412,1.86636639 L15,9.19354839 L15,9.19354839 L15,17.1774194 L0,8.58649679 L0,3.5715689 C3.0881846e-16,2.4669994 0.8954305,1.5715689 2,1.5715689 C2.36889529,1.5715689 2.73060353,1.67359571 3.04512412,1.86636639 Z'
                    />
                    <path
                      id='Rectangle'
                      fillOpacity='0.35'
                      fill={theme.palette.common.white}
                      transform='translate(22.500000, 8.588710) scale(-1, 1) translate(-22.500000, -8.588710) '
                      d='M18.0451241,1.86636639 L30,9.19354839 L30,9.19354839 L30,17.1774194 L15,8.58649679 L15,3.5715689 C15,2.4669994 15.8954305,1.5715689 17,1.5715689 C17.3688953,1.5715689 17.7306035,1.67359571 18.0451241,1.86636639 Z'
                    />
                  </g>
                </g>
              </g>
            </svg>
            <Typography
              variant='h6'
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important'
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              Adventure starts here 🚀
            </Typography>
            <Typography variant='body2'>Make your app management easy and fun!</Typography>
          </Box>
          <form autoComplete='off' onSubmit={submitForm}>
            {activeStep === 0 ? (
              <>
                <ToastContainer position={'top-center'} draggable={false} />
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <TextField
                      autoFocus
                      fullWidth
                      id='firstName'
                      label='First Name'
                      sx={{ marginBottom: 4 }}
                      value={formInfo.firstName}
                      onChange={e => setformInfo({ ...formInfo, firstName: e.target.value })}
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
                      onChange={e => setformInfo({ ...formInfo, lastName: e.target.value })}
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
                  onChange={e => setformInfo({ ...formInfo, username: e.target.value })}
                  required
                />
                <TextField
                  value={formInfo.email}
                  fullWidth
                  type='email'
                  label='Email'
                  sx={{ marginBottom: 4 }}
                  onChange={handleEmailChange}
                  error={emailError}
                  helperText={emailError ? 'Invalid email' : ''}
                  required
                />
                <FormControl fullWidth>
                  <InputLabel required htmlFor='auth-register-password'>
                    Password
                  </InputLabel>
                  <OutlinedInput
                    label='Password'
                    value={values.password}
                    id='auth-register-password'
                    type={values.showPassword ? 'text' : 'password'}
                    controlledValue={formInfo.password}
                    onChange={e => {
                      handleChange('password')(e) // Call the handleChange function for the controlled component
                      setformInfo({ ...formInfo, password: e.target.value }) // Update the state value
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
                  onChange={e => setformInfo({ ...formInfo, address: e.target.value })}
                  fullWidth
                  id='outlined-basic -1'
                  label='Address Line'
                  variant='outlined'
                  sx={{ marginBottom: 4 }}
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    value={formInfo.postalCode}
                    onChange={e => setformInfo({ ...formInfo, postalCode: e.target.value })}
                    fullWidth
                    id='outlined-basic -1'
                    label='Postal code'
                    variant='outlined'
                    sx={{ marginBottom: 4 }}
                  />
                  <TextField
                    value={formInfo.city}
                    onChange={e => setformInfo({ ...formInfo, city: e.target.value })}
                    fullWidth
                    id='outlined-basic -1'
                    label='City/Place'
                    variant='outlined'
                    sx={{ marginBottom: 4 }}
                  />
                </Box>
                <TextField
                  value={formInfo.phoneNumber}
                  onChange={e => setformInfo({ ...formInfo, phoneNumber: e.target.value })}
                  fullWidth
                  id='outlined-basic -1'
                  label='Phone Number'
                  variant='outlined'
                  sx={{ marginBottom: 4 }}
                />

                <TextField
                  value={formInfo.country}
                  onChange={e => setformInfo({ ...formInfo, country: e.target.value })}
                  fullWidth
                  id='outlined-basic -2'
                  label='Country'
                  variant='outlined'
                  sx={{ marginBottom: 4 }}
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
                  open={open}
                  autoHideDuration={3000}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                  <Alert severity='success'>Registration successful</Alert>
                </Snackbar>
                <Snackbar
                  open={errorOpen}
                  autoHideDuration={3000}
                  onClose={handleCloseError}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                  <Alert severity='error'>Registration Failed</Alert>
                </Snackbar>
              </>
            )}
          </form>

          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button variant='contained' color='inherit' disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
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
    </Box>
  )
}

RegisterPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default RegisterPage