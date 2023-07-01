// ** React Imports
// @ts-nocheck
import { useState, SyntheticEvent, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import * as Sentry from '@sentry/nextjs'
import { useUserData } from 'src/@core/hooks/useUserData'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import { Snackbar } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { RadioGroup, FormControlLabel, Radio, Modal } from '@mui/material'
import { styled } from '@mui/system'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

const ModalContainer = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '1rem',
  borderRadius: '4px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
  width: '1000px',
  height: 'auto',
  maxHeight: '90vh',
  overflowY: 'auto',
  opacity: 1,
  [theme.breakpoints.down('md')]: {
    width: '90%',
    maxWidth: '500px'
  },
  [theme.breakpoints.down('sm')]: {
    width: '90%',
    maxWidth: '300px',
    top: '40%',
    transform: 'translate(-50%, -40%)'
  }
}))

const FirstSettings = () => {
  // ** State
  const [openAlert, setOpenAlert] = useState<boolean>(true)
  const [userData, setUserData] = useState([])
  const [loading, setLoading] = useState(false)
  const { get, put } = useCustomApiHook()
  const { userId } = useUserData()
  const [open, setOpen] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(true)
  const [productFormType, setProductFormType] = useState('')
  const [defaultTabOpen, setDefaultTabOpen] = useState('')
  const [defaultAdvertisementLocation, setDefaultAdvertisementLocation] = useState('')
  const [defaultAdvertisementLanguage, setDefaultAdvertisementLanguage] = useState('')
  const [defaultAdvertisementLength, setDefaultAdvertisementLength] = useState('')
  const [defaultAdvertisementMood, setDefaultAdvertisementMood] = useState('')
  const [defaultCopyTone, setDefaultCopyTone] = useState('')
  const [defaultCopyLength, setDefaultCopyLength] = useState('')
  const [defaultCopyLanguage, setDefaultCopyLanguage] = useState('')
  const [defaultCopyType, setDefaultCopyType] = useState('')

  useEffect(() => {
    // Update the selected values when the userData is fetched
    setProductFormType(userData.productFormType || '')
    setDefaultTabOpen(userData.defaultTabOpen || '')
    setDefaultAdvertisementLocation(userData.defaultAdvertisementLocation || '')
    setDefaultAdvertisementLanguage(userData.defaultAdvertisementLanguage || '')
    setDefaultAdvertisementLength(userData.defaultAdvertisementLength || '')
    setDefaultAdvertisementMood(userData.defaultAdvertisementMood || '')
    setDefaultCopyTone(userData.defaultCopyTone || '')
    setDefaultCopyLength(userData.defaultCopyLength || '')
    setDefaultCopyLanguage(userData.defaultCopyLanguage || '')
    setDefaultCopyType(userData.defaultCopyType || '')
  }, [userData])

  const handleRadioChange = (section, value) => {
    if (section === 'productFormType') {
      setProductFormType(value)
    } else if (section === 'defaultTabOpen') {
      setDefaultTabOpen(value)
    } else if (section === 'defaultAdvertisementLocation') {
      setDefaultAdvertisementLocation(value)
    } else if (section === 'defaultAdvertisementLanguage') {
      setDefaultAdvertisementLanguage(value)
    } else if (section === 'defaultAdvertisementLength') {
      setDefaultAdvertisementLength(value)
    } else if (section === 'defaultAdvertisementMood') {
      setDefaultAdvertisementMood(value)
    } else if (section === 'defaultCopyTone') {
      setDefaultCopyTone(value)
    } else if (section === 'defaultCopyLength') {
      setDefaultCopyLength(value)
    } else if (section === 'defaultCopyLanguage') {
      setDefaultCopyLanguage(value)
    } else if (section === 'defaultCopyType') {
      setDefaultCopyType(value)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleCloseError = () => {
    setErrorOpen(false)
  }

  const handleRedirect = () => {
    window.location.replace('/')
  }

  const fetchSingleUser = async () => {
    const singleUserResult = await get(`/users/getSingleUser/${userId}`)
    setUserData(singleUserResult?.data)
    setLoading(true)
  }

  useEffect(() => {
    userId && fetchSingleUser()
  }, [userId])

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = {
      ...userData,
      productFormType,
      defaultAdvertisementLocation,
      firstTimeLoggedIn: true
    }

    try {
      await put(`/users/users/management/${userId}`, data)
      setOpen(true)
      setModalOpen(false)
      handleRedirect()
    } catch (error) {
      setErrorOpen(true)
      Sentry.captureException(error)
    }
  }

  return (
    <>
      <Modal open={modalOpen} onClose={handleClose}>
        <ModalContainer>
          <CardContent>
            <form onSubmit={submitForm}>
              {!loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container spacing={7}>
                  <Grid item xs={12} sm={12}>
                    <h1>Adjust your account settings</h1>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='Username'
                      defaultValue={userData.username}
                      onChange={e => setUserData({ ...userData, username: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='First Name'
                      defaultValue={userData.firstName}
                      onChange={e => setUserData({ ...userData, firstName: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='Last Name'
                      defaultValue={userData.lastName}
                      onChange={e => setUserData({ ...userData, lastName: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type='email'
                      label='Email'
                      defaultValue={userData.email}
                      disabled
                      onChange={e => setUserData({ ...userData, email: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Role</InputLabel>
                      <Select
                        label='Role'
                        value={userData.role}
                        disabled
                        onChange={e => setUserData({ ...userData, role: e.target.value })}
                      >
                        <MenuItem value='true'>Admin</MenuItem>
                        <MenuItem value='false'>User</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        label='Status'
                        defaultValue='active'
                        onChange={e => setUserData({ ...userData, status: e.target.value })}
                      >
                        <MenuItem value='active'>Active</MenuItem>
                        <MenuItem value='inactive'>Inactive</MenuItem>
                        <MenuItem value='pending'>Pending</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <InputLabel>Default Option</InputLabel>
                    <RadioGroup
                      name='productFormType'
                      value={productFormType}
                      onChange={handleRadioChange}
                      style={{ display: 'block' }}
                    >
                      <FormControlLabel value='amazon' control={<Radio />} label='Amazon' />
                      <FormControlLabel value='dropshipping' control={<Radio />} label='Dropshipping' />
                    </RadioGroup>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <InputLabel>Tab Settings</InputLabel>
                    <RadioGroup
                      name='defaultTabOpen'
                      value={defaultTabOpen}
                      onChange={handleRadioChange}
                      style={{ display: 'block' }}
                    >
                      <FormControlLabel value='true' control={<Radio />} label='Tabs Open By Default' />
                      <FormControlLabel value='false' control={<Radio />} label='Tab Closed By Default' />
                    </RadioGroup>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <InputLabel>Default advertisement location when generating</InputLabel>
                    <RadioGroup
                      name='defaultAdvertisementLocation'
                      value={defaultAdvertisementLocation}
                      onChange={e => setUserData({ ...userData, defaultAdvertisementLocation: e.target.value })}
                      style={{ display: 'block' }}
                    >
                      <FormControlLabel value='facebook' control={<Radio />} label='Facebook' />
                      <FormControlLabel value='instagram' control={<Radio />} label='Instagram' />
                      <FormControlLabel value='tiktok' control={<Radio />} label='Tiktok' />
                      <FormControlLabel value='other' control={<Radio />} label='Other' />
                    </RadioGroup>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <InputLabel>Default copy tone when generating</InputLabel>
                    <RadioGroup
                      name='defaultCopyTone'
                      value={defaultCopyTone}
                      onChange={e => setUserData({ ...userData, defaultCopyTone: e.target.value })}
                      style={{ display: 'block' }}
                    >
                      <FormControlLabel value='formal' control={<Radio />} label='Formal' />
                      <FormControlLabel value='informal' control={<Radio />} label='Informal' />
                      <FormControlLabel value='humorous' control={<Radio />} label='Humorous' />
                      <FormControlLabel value='serious' control={<Radio />} label='Serious' />
                    </RadioGroup>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <InputLabel style={{ marginTop: 2 }}>Default advertisement language when generating</InputLabel>
                    <RadioGroup
                      name='defaultAdvertisementLanguage'
                      value={defaultAdvertisementLanguage}
                      onChange={e => setUserData({ ...userData, defaultAdvertisementLanguage: e.target.value })}
                      style={{ display: 'block' }}
                    >
                      <FormControlLabel value='en' control={<Radio />} label='English' />
                      <FormControlLabel value='fr' control={<Radio />} label='French' />
                      <FormControlLabel value='bg' control={<Radio />} label='Bulgarian' />
                      <FormControlLabel value='it' control={<Radio />} label='Italian' />
                      <FormControlLabel value='es' control={<Radio />} label='Spanish' />
                      <FormControlLabel value='de' control={<Radio />} label='German' />
                    </RadioGroup>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <InputLabel>Default copy length when generating</InputLabel>
                    <RadioGroup
                      name='defaultCopyLength'
                      value={defaultCopyLength}
                      onChange={e => setUserData({ ...userData, defaultCopyLength: e.target.value })}
                      style={{ display: 'block' }}
                    >
                      <FormControlLabel value='short' control={<Radio />} label='Short' />
                      <FormControlLabel value='medium' control={<Radio />} label='Medium' />
                      <FormControlLabel value='long' control={<Radio />} label='Long' />
                      <FormControlLabel value='random' control={<Radio />} label='Random' />
                    </RadioGroup>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <InputLabel style={{ marginTop: 2 }}>Default advertisement length when generating</InputLabel>
                    <RadioGroup
                      name='defaultAdvertisementLength'
                      value={defaultAdvertisementLength}
                      onChange={e => setUserData({ ...userData, defaultAdvertisementLength: e.target.value })}
                      style={{ display: 'block' }}
                    >
                      <FormControlLabel value='short' control={<Radio />} label='Short' />
                      <FormControlLabel value='medium' control={<Radio />} label='Medium' />
                      <FormControlLabel value='long' control={<Radio />} label='Long' />
                    </RadioGroup>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <InputLabel>Default copy language when generating</InputLabel>
                    <RadioGroup
                      name='defaultCopyLanguage'
                      value={defaultCopyLanguage}
                      onChange={e => setUserData({ ...userData, defaultCopyLanguage: e.target.value })}
                      style={{ display: 'block' }}
                    >
                      <FormControlLabel value='en' control={<Radio />} label='English' />
                      <FormControlLabel value='fr' control={<Radio />} label='French' />
                      <FormControlLabel value='bg' control={<Radio />} label='Bulgarian' />
                      <FormControlLabel value='it' control={<Radio />} label='Italian' />
                      <FormControlLabel value='es' control={<Radio />} label='Spanish' />
                      <FormControlLabel value='de' control={<Radio />} label='German' />
                    </RadioGroup>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <InputLabel style={{ marginTop: 2 }}>Default advertisement mood when generating</InputLabel>
                    <RadioGroup
                      name='defaultAdvertisementMood'
                      value={defaultAdvertisementMood}
                      onChange={e => setUserData({ ...userData, defaultAdvertisementMood: e.target.value })}
                      style={{ display: 'block' }}
                    >
                      <FormControlLabel value='sell' control={<Radio />} label='Sell' />
                      <FormControlLabel value='promote' control={<Radio />} label='Promote' />
                      <FormControlLabel value='engage' control={<Radio />} label='Engage' />
                      <FormControlLabel value='traffic' control={<Radio />} label='Traffic' />
                    </RadioGroup>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <InputLabel>Default copy type when generating</InputLabel>
                    <RadioGroup
                      name='defaultCopyType'
                      value={defaultCopyType}
                      onChange={e => setUserData({ ...userData, defaultCopyType: e.target.value })}
                      style={{ display: 'block' }}
                    >
                      <FormControlLabel value='WEBSITE_COPY' control={<Radio />} label='Website' />
                      <FormControlLabel value='SEO_COPY' control={<Radio />} label='SEO' />
                      <FormControlLabel value='B2B_COPY' control={<Radio />} label='B2B' />
                      <FormControlLabel value='B2C_COPY' control={<Radio />} label='B2C' />
                      <FormControlLabel value='DIRECT_COPY' control={<Radio />} label='Direct' />
                      <FormControlLabel value='AD_COPY' control={<Radio />} label='Ad' />
                      <FormControlLabel value='SOCIAL_MEDIA_COPY' control={<Radio />} label='Social Media' />
                    </RadioGroup>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='Default Brand Name'
                      defaultValue={userData.defaultBrandName}
                      onChange={e => setUserData({ ...userData, defaultBrandName: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='Default Brand Description'
                      defaultValue={userData.defaultBrandDescription}
                      onChange={e => setUserData({ ...userData, defaultBrandDescription: e.target.value })}
                    />
                  </Grid>

                  {openAlert ? (
                    <Grid item xs={12} sx={{ mb: 3 }}>
                      <Alert
                        severity='warning'
                        sx={{ '& a': { fontWeight: 400 } }}
                        action={
                          <IconButton
                            size='small'
                            color='inherit'
                            aria-label='close'
                            onClick={() => setOpenAlert(false)}
                          >
                            <Close fontSize='inherit' />
                          </IconButton>
                        }
                      >
                        <AlertTitle>Your email is not confirmed. Please check your inbox.</AlertTitle>
                        <Link href='/' onClick={(e: SyntheticEvent) => e.preventDefault()}>
                          Resend Confirmation
                        </Link>
                      </Alert>
                    </Grid>
                  ) : null}

                  <Grid item xs={12}>
                    <Button variant='contained' sx={{ marginRight: 3.5 }} type='submit'>
                      Save Changes
                    </Button>
                  </Grid>
                  <Snackbar
                    open={open}
                    autoHideDuration={3000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    style={{ marginBottom: '-200px' }}
                  >
                    <Alert severity='success'>User Data Saved</Alert>
                  </Snackbar>
                  <Snackbar
                    open={errorOpen}
                    autoHideDuration={3000}
                    onClose={handleCloseError}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    style={{ marginBottom: '-200px' }}
                  >
                    <Alert severity='error'>Error while saving data</Alert>
                  </Snackbar>
                </Grid>
              )}
            </form>
          </CardContent>
        </ModalContainer>
      </Modal>
    </>
  )
}

export default FirstSettings
