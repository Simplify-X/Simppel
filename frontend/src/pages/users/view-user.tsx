// @ts-nocheck
import * as React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import authRoute from 'src/@core/utils/auth-route'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

const ViewUsers = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { id } = router.query

  console.log('id:', id)

  useEffect(() => {
    if (id) {
    fetch(`http://localhost:8080/api/users/getSingleUser/${id}`)
      .then(response => response.json())
      .then(data => {
        console.log('dataisherereer:', data)
        setData(data)
        setLoading(true)
      })
      .catch(error => {
        console.error('Error:', error)
      })
    }
  }, [id])

  console.log(data.username, 'what')

  return (
    <div style={{ display: 'flex' }}>
      <Box
        component='form'
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' }
        }}
        noValidate
        autoComplete='off'
      >
        {loading && (
          <FormControl>
            <TextField required id='outlined-required' label='Username' defaultValue={data.username} />
            <TextField id='outlined-password-input' label='Password' type='password' autoComplete='current-password' />

            <TextField disabled id='outlined-disabled' label='First Name' defaultValue={data.firstName} />
            <TextField disabled id='outlined-disabled' label='Last Name' defaultValue={data.lastName} />

            <TextField disabled id='outlined-disabled' label='Email' defaultValue={data.email} />

            <TextField disabled id='outlined-disabled' label='Email' defaultValue={data.email} />

            <Select labelId='demo-simple-select-label' id='demo-simple-select' value={data.role} label='Role'>
              <MenuItem value='Admin'>Admin</MenuItem>
              <MenuItem value='User'>User</MenuItem>
            </Select>
          </FormControl>
        )}
      </Box>

      <Box
        component='form'
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' }
        }}
        noValidate
        autoComplete='off'
      >
        {loading && (
          <FormControl>
            <FormGroup>
              <FormControlLabel control={<Checkbox defaultChecked />} label='Label' />
              <FormControlLabel disabled control={<Checkbox />} label='Disabled' />
            </FormGroup>
            <FormGroup>
              <FormControlLabel control={<Checkbox defaultChecked />} label='Label' />
              <FormControlLabel disabled control={<Checkbox />} label='Disabled' />
            </FormGroup>
          </FormControl>
        )}
      </Box>
    </div>
  )
}

// @ts-ignore
export default authRoute(ViewUsers)
