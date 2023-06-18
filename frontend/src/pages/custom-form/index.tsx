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
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { CircularProgress } from '@mui/material'

// import Cookies from 'js-cookie'
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

const CustomFormTable = () => {
  const [open, setOpen] = useState(false)
  const [formName, setFormName] = useState('')
  const [formType, setFormType] = useState('')
  const [role, setRole] = useState([])
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(true)
  const [recordId, setRecordId] = useState('')
  const { response, error, del, get, post, put } = useCustomApiHook()
  const { accountId } = useUserData()
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading] = useState(true)

  const handleOpen = () => {
    setOpen(true)
    setIsCreating(false)
  }

  const handleClose = () => {
    setOpen(false)
    setFormName('')
    setFormType('')
    setIsActive(false)
  }

  const handleReset = () => {
    setFormName('')
    setFormType('')
    setIsActive(false)
  }

  const handleClick = rowData => {
    router.push(`/custom-form/${rowData}`)
  }

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
      name: 'formName',
      label: 'Form Name',
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: 'formType',
      label: 'Access',
      options: {
        filter: true,
        sort: true,
        customBodyRender: value => {
          if (value === 'ADMIN') {
            return 'Admin can only view'
          } else if (value === 'ALL') {
            return 'Everyone can view'
          } else {
            return ''
          }
        }
      }
    },
    {
      name: 'isActive',
      label: 'Active',
      options: {
        filter: true,
        sort: true,
        customBodyRender: value => {
          return value ? 'Active' : 'Inactive'
        }
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
              <IconButton
                onClick={e => {
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
    await del(`/customForm/delete/${rowId}`)
  }

  const handleCheckboxChange = event => {
    setIsActive(event.target.checked)
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
    setFormName(selectedData.formName)
    setFormType(selectedData.formType)
    setIsActive(selectedData.isActive)
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
    accountId && fetchCustomForm()
  }, [accountId])

  const fetchCustomForm = async () => {
    const res = await get(`/customForm/${accountId}`)
    setRole(res?.data)
    setLoading(false)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log(isActive)
    const data = {
      formName,
      formType,
      isActive
    }

    await post(`/customForm/create/${accountId}`, data)
  }

  useEffect(() => {
    const fetchGroupData = async () => {
      const res = await get(`/customForm/${accountId}`)
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

    console.log(isActive)

    const data = {
      formName,
      formType,
      isActive
    }

    await put(`/customForm/update/${recordId}/${accountId}`, data)
  }

  useEffect(() => {
    if (response?.data?.status !== 'FAILED') {
      const updatedRole = role.map(data => {
        if (data.id === recordId) {
          return { ...data, formName: formName, formType: formType }
        } else {
          return data
        }
      })

      setRole(updatedRole)
    }
  }, [response])

  if (loading) {
    return <CircularProgress />
  }

  return (
    <>
      <Fab color='primary' aria-label='add' onClick={handleOpen} style={{ position: 'fixed', bottom: 24, right: 24 }}>
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a custom form</DialogTitle>
        <DialogContent>
          <InputLabel>Mandatory fields are marked with (*)</InputLabel>
          <TextField
            label='Form Name*'
            value={formName}
            onChange={e => setFormName(e.target.value)}
            fullWidth
            margin='normal'
          />
          <Box marginTop={2}>
            <InputLabel>Field Active</InputLabel>
            <FormControlLabel
              control={<Checkbox checked={isActive} onChange={handleCheckboxChange} name='isActive' color='primary' />}
              label='Is Active'
            />
          </Box>
          <Box marginTop={2}>
            <InputLabel>Access</InputLabel>
            <TextField
              select
              label='Select'
              value={formType}
              onChange={e => setFormType(e.target.value)}
              fullWidth
              margin='normal'
            >
              <MenuItem value='ADMIN'>Only Account Admin</MenuItem>
              <MenuItem value='ALL'>Anyone</MenuItem>
            </TextField>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
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
      <MUIDataTable title={'Extra Fields'} data={role} columns={columns} options={options} />
    </>
  )
}

// @ts-ignore
export default authRoute(CustomFormTable)
