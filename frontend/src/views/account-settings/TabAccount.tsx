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
import EditIcon from '@mui/icons-material/Edit'
import CircularProgress from '@mui/material/CircularProgress'
import { RadioGroup, FormControlLabel, Radio } from '@mui/material'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

const TabAccount = () => {
  // ** State
  const [openAlert, setOpenAlert] = useState<boolean>(true)
  const [userData, setUserData] = useState([])
  const [loading, setLoading] = useState(false)
  const { get, put } = useCustomApiHook()
  const { userId } = useUserData()
  const [editable, setEditable] = useState(false)
  const [open, setOpen] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)

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
      defaultAdvertisementLocation
    }

    try {
      await put(`/users/users/management/${userId}`, data)
      setOpen(true)
    } catch (error) {
      setErrorOpen(true)
      Sentry.captureException(error)
    }
  }

  return (
    <CardContent>
      <form onSubmit={submitForm}>
        {!loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={7}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Username'
                defaultValue={userData.username}
                disabled={!editable}
                onChange={e => setUserData({ ...userData, username: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='First Name'
                defaultValue={userData.firstName}
                disabled={!editable}
                onChange={e => setUserData({ ...userData, firstName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Last Name'
                defaultValue={userData.lastName}
                disabled={!editable}
                onChange={e => setUserData({ ...userData, lastName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type='email'
                label='Email'
                disabled={!editable}
                defaultValue={userData.email}
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
                  disabled={!editable}
                  onChange={e => setUserData({ ...userData, status: e.target.value })}
                >
                  <MenuItem value='active'>Active</MenuItem>
                  <MenuItem value='inactive'>Inactive</MenuItem>
                  <MenuItem value='pending'>Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {userData.advertisementEnabled ? (
              <>
                <Grid item xs={12} sm={6}>
                  <InputLabel>Default Option</InputLabel>
                  <RadioGroup
                    disabled={!editable}
                    name='productFormType'
                    value={productFormType}
                    onChange={e => setUserData({ ...userData, productFormType: e.target.value })}
                    style={{ display: 'block' }}
                  >
                    <FormControlLabel disabled={!editable} value='amazon' control={<Radio />} label='Amazon' />
                    <FormControlLabel
                      disabled={!editable}
                      value='dropshipping'
                      control={<Radio />}
                      label='Dropshipping'
                    />
                  </RadioGroup>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <InputLabel>Tab Settings</InputLabel>
                  <RadioGroup
                    disabled={!editable}
                    name='defaultTabOpen'
                    value={defaultTabOpen}
                    onChange={handleRadioChange}
                    style={{ display: 'block' }}
                  >
                    <FormControlLabel
                      disabled={!editable}
                      value='true'
                      control={<Radio />}
                      label='Tabs Open By Default'
                    />
                    <FormControlLabel
                      disabled={!editable}
                      value='false'
                      control={<Radio />}
                      label='Tab Closed By Default'
                    />
                  </RadioGroup>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <InputLabel>Default advertisement location when generating</InputLabel>
                  <RadioGroup
                    disabled={!editable}
                    name='defaultAdvertisementLocation'
                    value={defaultAdvertisementLocation}
                    onChange={e => setUserData({ ...userData, defaultAdvertisementLocation: e.target.value })}
                    style={{ display: 'block' }}
                  >
                    <FormControlLabel disabled={!editable} value='facebook' control={<Radio />} label='Facebook' />
                    <FormControlLabel disabled={!editable} value='instagram' control={<Radio />} label='Instagram' />
                    <FormControlLabel disabled={!editable} value='tiktok' control={<Radio />} label='Tiktok' />
                    <FormControlLabel disabled={!editable} value='other' control={<Radio />} label='Other' />
                  </RadioGroup>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <InputLabel>Default copy tone when generating</InputLabel>
                  <RadioGroup
                    disabled={!editable}
                    name='defaultCopyTone'
                    value={defaultCopyTone}
                    onChange={e => setUserData({ ...userData, defaultCopyTone: e.target.value })}
                    style={{ display: 'block' }}
                  >
                    <FormControlLabel disabled={!editable} value='formal' control={<Radio />} label='Formal' />
                    <FormControlLabel disabled={!editable} value='informal' control={<Radio />} label='Informal' />
                    <FormControlLabel disabled={!editable} value='humorous' control={<Radio />} label='Humorous' />
                    <FormControlLabel disabled={!editable} value='serious' control={<Radio />} label='Serious' />
                  </RadioGroup>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <InputLabel style={{ marginTop: 2 }}>Default advertisement language when generating</InputLabel>
                  <RadioGroup
                    disabled={!editable}
                    name='defaultAdvertisementLanguage'
                    value={defaultAdvertisementLanguage}
                    onChange={e => setUserData({ ...userData, defaultAdvertisementLanguage: e.target.value })}
                    style={{ display: 'block' }}
                  >
                    <FormControlLabel disabled={!editable} value='en' control={<Radio />} label='English' />
                    <FormControlLabel disabled={!editable} value='fr' control={<Radio />} label='French' />
                    <FormControlLabel disabled={!editable} value='bg' control={<Radio />} label='Bulgarian' />
                    <FormControlLabel disabled={!editable} value='it' control={<Radio />} label='Italian' />
                    <FormControlLabel disabled={!editable} value='es' control={<Radio />} label='Spanish' />
                    <FormControlLabel disabled={!editable} value='de' control={<Radio />} label='German' />
                  </RadioGroup>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <InputLabel>Default copy length when generating</InputLabel>
                  <RadioGroup
                    disabled={!editable}
                    name='defaultCopyLength'
                    value={defaultCopyLength}
                    onChange={e => setUserData({ ...userData, defaultCopyLength: e.target.value })}
                    style={{ display: 'block' }}
                  >
                    <FormControlLabel disabled={!editable} value='short' control={<Radio />} label='Short' />
                    <FormControlLabel disabled={!editable} value='medium' control={<Radio />} label='Medium' />
                    <FormControlLabel disabled={!editable} value='long' control={<Radio />} label='Long' />
                    <FormControlLabel disabled={!editable} value='random' control={<Radio />} label='Random' />
                  </RadioGroup>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <InputLabel style={{ marginTop: 2 }}>Default advertisement length when generating</InputLabel>
                  <RadioGroup
                    disabled={!editable}
                    name='defaultAdvertisementLength'
                    value={defaultAdvertisementLength}
                    onChange={e => setUserData({ ...userData, defaultAdvertisementLength: e.target.value })}
                    style={{ display: 'block' }}
                  >
                    <FormControlLabel disabled={!editable} value='short' control={<Radio />} label='Short' />
                    <FormControlLabel disabled={!editable} value='medium' control={<Radio />} label='Medium' />
                    <FormControlLabel disabled={!editable} value='long' control={<Radio />} label='Long' />
                  </RadioGroup>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <InputLabel>Default copy language when generating</InputLabel>
                  <RadioGroup
                    disabled={!editable}
                    name='defaultCopyLanguage'
                    value={defaultCopyLanguage}
                    onChange={e => setUserData({ ...userData, defaultCopyLanguage: e.target.value })}
                    style={{ display: 'block' }}
                  >
                    <FormControlLabel disabled={!editable} value='en' control={<Radio />} label='English' />
                    <FormControlLabel disabled={!editable} value='fr' control={<Radio />} label='French' />
                    <FormControlLabel disabled={!editable} value='bg' control={<Radio />} label='Bulgarian' />
                    <FormControlLabel disabled={!editable} value='it' control={<Radio />} label='Italian' />
                    <FormControlLabel disabled={!editable} value='es' control={<Radio />} label='Spanish' />
                    <FormControlLabel disabled={!editable} value='de' control={<Radio />} label='German' />
                  </RadioGroup>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <InputLabel style={{ marginTop: 2 }}>Default advertisement mood when generating</InputLabel>
                  <RadioGroup
                    disabled={!editable}
                    name='defaultAdvertisementMood'
                    value={defaultAdvertisementMood}
                    onChange={e => setUserData({ ...userData, defaultAdvertisementMood: e.target.value })}
                    style={{ display: 'block' }}
                  >
                    <FormControlLabel disabled={!editable} value='sell' control={<Radio />} label='Sell' />
                    <FormControlLabel disabled={!editable} value='promote' control={<Radio />} label='Promote' />
                    <FormControlLabel disabled={!editable} value='engage' control={<Radio />} label='Engage' />
                    <FormControlLabel disabled={!editable} value='traffic' control={<Radio />} label='Traffic' />
                  </RadioGroup>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <InputLabel>Default copy type when generating</InputLabel>
                  <RadioGroup
                    disabled={!editable}
                    name='defaultCopyType'
                    value={defaultCopyType}
                    onChange={e => setUserData({ ...userData, defaultCopyType: e.target.value })}
                    style={{ display: 'block' }}
                  >
                    <FormControlLabel disabled={!editable} value='WEBSITE_COPY' control={<Radio />} label='Website' />
                    <FormControlLabel disabled={!editable} value='SEO_COPY' control={<Radio />} label='SEO' />
                    <FormControlLabel disabled={!editable} value='B2B_COPY' control={<Radio />} label='B2B' />
                    <FormControlLabel disabled={!editable} value='B2C_COPY' control={<Radio />} label='B2C' />
                    <FormControlLabel disabled={!editable} value='DIRECT_COPY' control={<Radio />} label='Direct' />
                    <FormControlLabel disabled={!editable} value='AD_COPY' control={<Radio />} label='Ad' />
                    <FormControlLabel
                      disabled={!editable}
                      value='SOCIAL_MEDIA_COPY'
                      control={<Radio />}
                      label='Social Media'
                    />
                  </RadioGroup>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Default Brand Name'
                    defaultValue={userData.defaultBrandName}
                    disabled={!editable}
                    onChange={e => setUserData({ ...userData, defaultBrandName: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Default Brand Description'
                    disabled={!editable}
                    defaultValue={userData.defaultBrandDescription}
                    onChange={e => setUserData({ ...userData, defaultBrandDescription: e.target.value })}
                  />
                </Grid>
              </>
            ) : null}

            {openAlert ? (
              <Grid item xs={12} sx={{ mb: 3 }}>
                <Alert
                  severity='warning'
                  sx={{ '& a': { fontWeight: 400 } }}
                  action={
                    <IconButton size='small' color='inherit' aria-label='close' onClick={() => setOpenAlert(false)}>
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
              <Button variant='contained' sx={{ marginRight: 3.5 }} disabled={!editable} type='submit'>
                Save Changes
              </Button>
              <Button
                type='reset'
                sx={{ marginRight: 3.5 }}
                variant='outlined'
                color='secondary'
                disabled={!editable}
                onClick={() => setEditable(false)}
              >
                Cancel
              </Button>

              <Button
                type='reset'
                style={{ display: editable ? 'none' : '' }}
                startIcon={<EditIcon />}
                variant='contained'
                onClick={() => setEditable(true)}
              >
                Edit Profile
              </Button>
            </Grid>
            <Snackbar
              open={open}
              autoHideDuration={3000}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert severity='success'>User Data Saved</Alert>
            </Snackbar>
            <Snackbar
              open={errorOpen}
              autoHideDuration={3000}
              onClose={handleCloseError}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert severity='error'>Error while saving data</Alert>
            </Snackbar>
          </Grid>
        )}
      </form>
    </CardContent>
  )
}

export default TabAccount
