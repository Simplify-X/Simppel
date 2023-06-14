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
  const [selectedValue, setSelectedValue] = useState('')

  const handleRadioChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
    setUserData((prevUserData) => ({
      ...prevUserData,
      productFormType: value,
    }));
  };

  useEffect(() => {
    // Update the selectedValue when the userData is fetched
    setSelectedValue(userData.productFormType || '');
  }, [userData]);

  const handleClose = () => {
    setOpen(false)
  }

  const handleCloseError = () => {
    setErrorOpen(false)
  }

  const fetchSingleUser = async () => {
    const singleUserResult = await get(`/users/getSingleUser/${userId}`)
    console.log(singleUserResult)
    setUserData(singleUserResult?.data)
    setLoading(true)
  }

  useEffect(() => {
    userId && fetchSingleUser()
  }, [userId])

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = JSON.stringify(userData)
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

            <Grid item xs={12} sm={6}>
            <InputLabel>Default Option</InputLabel>
              <RadioGroup
                disabled={!editable}
                name='productFormType'
                value={selectedValue}
                onChange={handleRadioChange}
                style={{ display: 'block' }}
              >
                <FormControlLabel disabled={!editable} value='amazon' control={<Radio />} label='Amazon' />
                <FormControlLabel disabled={!editable} value='dropshipping' control={<Radio />} label='Dropshipping' />
              </RadioGroup>
            </Grid>

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
