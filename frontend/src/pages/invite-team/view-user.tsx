
// @ts-nocheck

import { useState, useEffect } from 'react'
import { Fab, Dialog, DialogTitle, DialogContent, TextField, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import MUIDataTable from 'mui-datatables'
import authRoute from 'src/@core/utils/auth-route'
import { useRouter } from 'next/router'
import * as Sentry from '@sentry/nextjs'
import { API_BASE_URL } from 'src/config'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Cookies from 'js-cookie'
import axios from 'axios'
import { IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`
}))

const ViewUserGroup = () => {
  const [open, setOpen] = useState(false)
  const [memberRole, setMemberRole] = useState('')
  const [groupMemberData, setGroupMemberData] = useState([])
  const router = useRouter()
  const [accountId, setAccountId] = useState(null)
  const [getToken, setToken] = useState(Cookies.get('token'))
  const { id } = router.query
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState('')

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedUser('')
    setMemberRole('')
  }

  const handleReset = () => {
    setSelectedUser('')
    setMemberRole('')
  }

  // const handleClick = rowData => {
  //   router.push(`/users/view-user?id=${rowData}`)
  // }

  const columns = [
    {
      name: 'id',
      label: 'Id',
      options: {
        filter: true,
        sort: true,
        display: 'none'
      }
    },
    {
      name: 'username',
      label: 'Username',
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: 'role',
      label: 'Role',
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: 'actions',
      label: 'Actions',
      options: {
        customBodyRender: ( value, tableMeta) => {
          const rowId = tableMeta.rowData[0]

          return (
            <>
              <IconButton onClick={() => handleEdit(tableMeta.rowData)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(rowId)}>
                <DeleteIcon />
              </IconButton>
            </>
          )
        }
      }
    }
  ]

  const handleEdit = rowData => {
    const [selectedData] = groupMemberData.filter(data => data.id === rowData[0]);
  
    setOpen(true);
    setSelectedUser(selectedData.userId);
    setMemberRole(selectedData.role);
  };

  const options = {
    filterType: 'checkbox',
  }

  const handleAddUser = () => {
    router.push('/user-management/new')
  }

  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
      // Token not found, redirect to login page
      window.location.replace('/login')

      return
    } else {
      setToken(token)
    }
  }, [])

  useEffect(() => {
    if (id) {
      fetch(`${API_BASE_URL}/groups/members/${id}`)
        .then(response => response.json())
        .then(data => {
          setGroupMemberData(data)
        })
        .catch(error => {
          Sentry.captureException(error)
        })
    }
  }, [id])

  useEffect(() => {
    fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${getToken}`
      }
    })
      .then(response => {
        if (response.ok) {
          // Get account ID from response body
          return response.json()
        } else {
          // Token not valid, redirect to login page
          throw new Error('Invalid token')
        }
      })
      .then(data => {
        setAccountId(data)
      })
      .catch(error => {
        Sentry.captureException(error)
        window.location.replace('/login')
      })
  }, [getToken])

  useEffect(() => {
    if (accountId) {
      fetch(`${API_BASE_URL}/users/getUserForAccount/${accountId}`)
        .then(response => response.json())
        .then(data => {
          setUsers(data)
        })
        .catch(error => {
          Sentry.captureException(error)
        })
    }
  }, [accountId])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = {
      userId: selectedUser,
      role: memberRole,
      teamGroupId: id
    }

    console.log(data)

    const config = {
      method: 'post',
      url: `${API_BASE_URL}/groups/members/create/${accountId}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data
    }

    axios(config)
      .then(function (response) {
        if (response.data.status === 'FAILED') {
          // handle the error case here
        } else {
          // add the newly created record to the state
          fetch(`${API_BASE_URL}/groups/members/${id}`)
            .then(response => response.json())
            .then(data => {
              setGroupMemberData(data)
            })
            .catch(error => {
              Sentry.captureException(error)
            })
          handleClose()
        }
      })
      .catch(function (error) {
        Sentry.captureException(error)
      })
  }

  console.log(selectedUser)

  return (
    <>
      <Fab color='primary' aria-label='add' onClick={handleOpen} style={{ position: 'fixed', bottom: 24, right: 24 }}>
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Members</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
            <Button onClick={handleAddUser} color='primary' variant='contained'>
              Add New User
            </Button>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
            <InputLabel>or</InputLabel>
          </Box>
          <Box marginTop={5}>
            <InputLabel>User</InputLabel>
            <TextField
              select
              label='Select'
              value={selectedUser}
              onChange={e => setSelectedUser(e.target.value)}
              fullWidth
              margin='normal'
            >
              {users.map(user => (
                <MenuItem key={user?.userId} value={user?.userId}>
                  {user?.username}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box marginTop={2}>
            <InputLabel>Role</InputLabel>
            <TextField
              select
              label='Select'
              value={memberRole}
              onChange={e => setMemberRole(e.target.value)}
              fullWidth
              margin='normal'
            >
              <MenuItem value='member'>Member</MenuItem>
              <MenuItem value='admin'>Admin</MenuItem>
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
            <Button onClick={handleClose} sx={{ marginLeft: 1 }}>
              Cancel
            </Button>
            <Button variant='contained' color='error' onClick={handleReset}>
              Reset
            </Button>
            <Button variant='contained' onClick={handleSubmit} sx={{ marginLeft: 1 }}>
              Save
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <MUIDataTable title={'View Users'} data={groupMemberData} columns={columns} options={options} />
    </>
  )
}

// @ts-ignore
export default authRoute(ViewUserGroup)
