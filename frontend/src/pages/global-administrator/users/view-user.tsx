// @ts-nocheck
import * as React from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import authRoute from 'src/@core/utils/auth-route'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Card from '@mui/material/Card'
import * as Sentry from '@sentry/nextjs'
import CircularProgress from '@mui/material/CircularProgress'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import { Snackbar } from '@mui/material'

const ViewUsers = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)
  const router = useRouter()
  const { id } = router.query

  const { put, error, get } = useCustomApiHook()

  const handleClose = () => {
    setOpen(false)
  }

  const handleCloseError = () => {
    setErrorOpen(false)
  }

  const fetchSingleUser = async () => {
    const response = await get(`/users/getSingleUser/${id}`)
    response?.data && setData(response.data)
    setLoading(true)
  }

  useEffect(() => {
    if (id) {
      fetchSingleUser()
    }
  }, [id])

  const handleSave = async () => {
    try {
      await put(`/users/users/management/${id}`, JSON.stringify(data))
      setOpen(true)
      console.log(error, 'here')
    } catch (err) {
      setErrorOpen(true)
      Sentry.captureException(err)
    }
  }


  return (
    <Card>
      <CardContent>
        <form>
          <ToastContainer position={'top-center'} draggable={false} />
          {!loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={7}>
              <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography>User Details</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Username'
                  defaultValue={data.username}
                  onChange={event => setData({ ...data, username: event.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Name'
                  defaultValue={data.firstName}
                  onChange={event => setData({ ...data, firstName: event.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Last Name'
                  defaultValue={data.lastName}
                  onChange={event => setData({ ...data, lastName: event.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type='email'
                  label='Email'
                  placeholder='johnDoe@example.com'
                  defaultValue={data.email}
                  onChange={event => setData({ ...data, email: event.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Address Line'
                  defaultValue={data.address}
                  onChange={event => setData({ ...data, address: event.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Postal code'
                  defaultValue={data.postalCode}
                  onChange={event => setData({ ...data, postalCode: event.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='City'
                  defaultValue={data.city}
                  onChange={event => setData({ ...data, city: event.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Country'
                  defaultValue={data.city}
                  onChange={event => setData({ ...data, country: event.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select label='Role' value={data.accountRole}>
                    <MenuItem value='true'>Account Admin</MenuItem>
                    <MenuItem value='false'>User</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Advertisement Limit'
                  defaultValue={data.advertisementLimit}
                  onChange={event => setData({ ...data, advertisementLimit: event.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <Typography variant='subtitle1'>User Status:</Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={data.role}
                      onChange={event => setData({ ...data, role: event.target.checked })}
                    />
                  }
                  label='Is Admin'
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={data.userActive}
                      onChange={event => setData({ ...data, userActive: event.target.checked })}
                    />
                  }
                  label='Is User Active'
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant='subtitle1'>Account Features:</Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={data.advertisementEnabled}
                      onChange={event => setData({ ...data, advertisementEnabled: event.target.checked })}
                    />
                  }
                  label='Advertisement Enabled'
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={data.imageUploadFeatureEnabled}
                      onChange={event => setData({ ...data, imageUploadFeatureEnabled: event.target.checked })}
                    />
                  }
                  label='Image Upload Active'
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={data.advertisementImportEnabled}
                      onChange={event => setData({ ...data, advertisementImportEnabled: event.target.checked })}
                    />
                  }
                  label='Advertisement Import'
                />
              </Grid>

              <Grid item xs={12}>
                <Button variant='contained' sx={{ marginRight: 3.5 }} onClick={handleSave}>
                  Save Changes
                </Button>
              </Grid>
              <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              >
                <Alert severity='success'>User data has been updated successfully</Alert>
              </Snackbar>
              <Snackbar
                open={errorOpen}
                autoHideDuration={3000}
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              >
                <Alert severity='error'>There was an error saving the data, please try again later</Alert>
              </Snackbar>
            </Grid>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

// @ts-ignore
export default authRoute(ViewUsers)
