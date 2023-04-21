// @ts-nocheck
import { useState, useEffect } from 'react'
import { Fab, Dialog, DialogTitle, DialogContent, TextField, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import MUIDataTable from 'mui-datatables'
import authRoute from 'src/@core/utils/auth-route'
import { useRouter } from 'next/router'
import * as Sentry from '@sentry/nextjs'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Cookies from 'js-cookie'
import { IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import { toast } from 'react-toastify'
import { useUserData } from 'src/@core/hooks/useUserData'

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
  const [isCreating, setIsCreating] = useState(true)
  const [recordId, setRecordId] = useState('')
  const {response, loading, error , del, get, post , put} = useCustomApiHook();
  const [accountId, userId] = useUserData();
  


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

  async function handleDelete(rowId) {
    await del(`/groups/delete/${rowId}`)
  }


  useEffect(() => {
    const status = response?.data.status

    if (response?.data) {
      const updatedRole = role.filter(data => data.id !== rowId)
      setRole(updatedRole)
    }
    status === 'FAILED' && toast.error('Error', { autoClose: 3000 })
    error && Sentry.captureException(error)

  }, [error])

  

  const handleEdit = rowData => {
    const [selectedData] = role.filter(data => data.id === rowData[0])

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
    accountId && fecthGroupData()
  }, [accountId])

  const fecthGroupData = async () => {
        const res = await get(`/groups/${accountId}`)
        setRole(res?.data)
  }


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
  
    const data = {
      groupName: title,
      description: description,
      advertisementAccess: advertisement,
      copyWritingAccess: copyWriting
    }

    await post(`/groups/create/${accountId}`, data)
  
  }

  useEffect(() => {
    const fetchGroupData = async ()=> {
      const res = await get(`/groups/${accountId}`)
        setRole(res?.data)
    }

    const status = response?.data.status
    if (status !== 'FAILED') {
      accountId && fetchGroupData()
      handleClose()
    }
    
  }, [response])



  
  async function handleEditForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
  
    const data = {
      groupName: title,
      description: description,
      advertisementAccess: advertisement,
      copyWritingAccess: copyWriting
    }

    await put(`/groups/update/${recordId}/${accountId}`, data)

  }


  useEffect(()=>{
    if (response?.data?.status !== 'FAILED') {
      const updatedRole = role.map(data => {
        if (data.id === recordId) {
          return { ...data, groupName: title, description: description }
        } else {
          return data
        }
      })

      setRole(updatedRole)
    }
  },[response])
  
  

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
