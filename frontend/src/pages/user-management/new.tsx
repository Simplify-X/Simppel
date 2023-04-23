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
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Card from '@mui/material/Card'
import CircularProgress from '@mui/material/CircularProgress'
import FormHelperText from '@mui/material/FormHelperText'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import { Snackbar } from '@mui/material'
import { useUserData } from 'src/@core/hooks/useUserData'

const NewUser = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const { accountId } = useUserData()

  const router = useRouter()
  const { id } = router.query
  const { get, post } = useCustomApiHook()
  const [open, setOpen] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleCloseError = () => {
    setErrorOpen(false)
  }

  useEffect(() => {
    if (id) {
      fetchSingleUser()
    }
  }, [id])

  const fetchSingleUser = async () => {
    const getUsers = await get(`/users/getSingleUser/${id}`)
    setData(getUsers?.data)
    setLoading(true)
  }

  const handleSave = async () => {
    if (accountId) {
      try {
        await post(`/users/register/account/${accountId}`, JSON.stringify(data))
        setOpen(true)
        router.push('/user-management/')
      } catch (err) {
        setErrorOpen(true)
        console.log(err)
      }
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
                <FormHelperText style={{ marginTop: '20px' }}>
                  Create a new User for your Account. All users can be managed from your account section
                </FormHelperText>
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
                  type='password'
                  label='Password'
                  defaultValue={data.email}
                  onChange={event => setData({ ...data, password: event.target.value })}
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
                <Alert severity='success'>New User Added</Alert>
              </Snackbar>
              <Snackbar
                open={errorOpen}
                autoHideDuration={3000}
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              >
                <Alert severity='error'>Error while creating user</Alert>
              </Snackbar>
            </Grid>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

// @ts-ignore
export default authRoute(NewUser)
