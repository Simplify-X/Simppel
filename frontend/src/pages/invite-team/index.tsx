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

const InviteTeam = () => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [advertisement, setAdvertisement] = useState('')
  const [copyWriting, setCopyWriting] = useState('')
  const [role, setRole] = useState([])
  const router = useRouter()
  const [accountId, setAccountId] = useState(null)
  const [getToken, setToken] = useState(Cookies.get('token'))
  const [isCreating, setIsCreating] = useState(true)
  const [recordId, setRecordId] = useState('')
  


  const handleOpen = () => {
    setOpen(true)
    setIsCreating(false)
  }

  const handleClose = () => {
    setOpen(false)
    setTitle('')
    setDescription('')
  }

  const handleReset = () => {
    setTitle('')
    setDescription('')
    setAdvertisement('')
    setCopyWriting('')
  }

  const handleClick = rowData => {
    router.push(`/invite-team/view-user?id=${rowData}`)
  }

  const columns = [
    {
      name: 'id',
      label: 'Id',
      options: {
        filter: true,
        sort: true,
        display: 'none',
      }
    },
    {
      name: 'groupName',
      label: 'Group Name',
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: 'description',
      label: 'Group Description',
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: 'actions',
      label: 'Actions',
      options: {
        customBodyRender: (value, tableMeta) => {
          const rowId = tableMeta.rowData[0]

          return (
            <>
              <IconButton
                onClick={e => {
                  e.stopPropagation() // stop click event propagation
                  handleEdit(tableMeta.rowData)
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton onClick={(e) => {
                    e.stopPropagation() 
                    handleDelete(rowId)
                }}
                >
                <DeleteIcon />
              </IconButton>
            </>
          )
        }
      }
    }
  ]

  function handleDelete(rowId) {
    const config = {
      method: 'delete',
      url: `${API_BASE_URL}/groups/delete/${rowId}`,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  
    axios(config)
      .then(function (response) {
        if (response.data.status === 'FAILED') {
          // handle the error case here
        } else {
          // remove the deleted record from the state
          const updatedRole = role.filter(data => data.id !== rowId)
          setRole(updatedRole)
        }
      })
      .catch(function (error) {
        Sentry.captureException(error)
      })
  }
  

  const handleEdit = rowData => {
    const [selectedData] = role.filter(data => data.id === rowData[0])

    console.log(data.id);
    console.log(rowData[0])

    setOpen(true)
    setTitle(selectedData.groupName)
    setDescription(selectedData.description)
    setAdvertisement(selectedData.advertisementAccess)
    setCopyWriting(selectedData.copyWritingAccess)
    setIsCreating(true) 
    setRecordId(rowData[0])
  }

  const options = {
    filterType: 'checkbox',
    onRowClick: (rowData: any) => {
      handleClick(rowData[0])
    }
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
        fetch(`${API_BASE_URL}/groups/${data}`)
          .then(response => response.json())
          .then(data => {
            setRole(data)
          })
      })
      .catch(error => {
        Sentry.captureException(error)
        window.location.replace('/login')
      })
  }, [getToken])


  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
  
    const data = {
      groupName: title,
      description: description,
      advertisementAccess: advertisement,
      copyWritingAccess: copyWriting
    }
  
    const config = {
      method: 'post',
      url: `${API_BASE_URL}/groups/create/${accountId}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data
    }
  
    axios(config)
      .then(function (response) {
        if (response.data.status === 'FAILED') {
        } else {
          // add the newly created record to the state
          fetch(`${API_BASE_URL}/groups/${accountId}`)
            .then(response => response.json())
            .then(data => {
              setRole(data)
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
  
  function handleEditForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
  
    const data = {
      groupName: title,
      description: description,
      advertisementAccess: advertisement,
      copyWritingAccess: copyWriting
    }
  
    const config = {
      method: 'put',
      url: `${API_BASE_URL}/groups/update/${recordId}/${accountId}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data
    }
  
    axios(config)
      .then(function (response) {
        if (response.data.status === 'FAILED') {
        } else {
          // update the existing record in the state with the new data
          const updatedRole = role.map(data => {
            if (data.id === recordId) {
              return { ...data, groupName: title, description: description }
            } else {
              return data
            }
          })
          fetch(`${API_BASE_URL}/groups/${accountId}`)
            .then(response => response.json())
            .then(data => {
              setRole(updatedRole)
              console.log(data)
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
  
  

  return (
    <>
      <Fab color='primary' aria-label='add' onClick={handleOpen} style={{ position: 'fixed', bottom: 24, right: 24 }}>
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Team</DialogTitle>
        <DialogContent>
          <InputLabel>Mandatory fields are marked with (*)</InputLabel>
          <TextField
            label='Team Name*'
            value={title}
            onChange={e => setTitle(e.target.value)}
            fullWidth
            margin='normal'
          />
          <TextField
            label='Team Description*'
            value={description}
            onChange={e => setDescription(e.target.value)}
            fullWidth
            margin='normal'
          />
          <Box marginTop={2}>
            <InputLabel>Advertisement</InputLabel>
            <TextField
              select
              label='Select'
              value={advertisement}
              onChange={e => setAdvertisement(e.target.value)}
              fullWidth
              margin='normal'
            >
              <MenuItem value='VIEW'>Can Only View</MenuItem>
              <MenuItem value='ADD'>Can Only Read</MenuItem>
              <MenuItem value='BOTH'>Full Access</MenuItem>
            </TextField>
          </Box>
          <Box marginTop={2}>
            <InputLabel>Copy Writing</InputLabel>
            <TextField
              select
              label='Select'
              value={copyWriting}
              onChange={e => setCopyWriting(e.target.value)}
              fullWidth
              margin='normal'
            >
              <MenuItem value='VIEW'>Can Only View</MenuItem>
              <MenuItem value='ADD'>Can Only Read</MenuItem>
              <MenuItem value='BOTH'>Full Access</MenuItem>
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
            <Button onClick={handleClose} sx={{ marginLeft: 1 }}>
              Cancel
            </Button>
            <Button variant='contained' color='error' onClick={handleReset}>
              Reset
            </Button>
            <Button variant='contained' onClick={isCreating ? handleEditForm : handleSubmit} sx={{ marginLeft: 1 }}>
              {isCreating ? 'Edit' : 'Save'}
          </Button>

          </Box>
        </DialogContent>
      </Dialog>
      <MUIDataTable title={'Users List'} data={role} columns={columns} options={options} />
    </>
  )
}

// @ts-ignore
export default authRoute(InviteTeam)
