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
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

// import Cookies from 'js-cookie'
import { IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import { toast } from 'react-toastify'

const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`
}))

const supportedFieldTypes = ['Radio', 'TextField', 'TextArea', 'Image', 'Checkbox', 'Select', 'AutoComplete', 'Tracker']

const DynamicExtraFields = () => {
  const [open, setOpen] = useState(false)
  const [formName, setFormName] = useState('')
  const [role, setRole] = useState([])
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(true)
  const [recordId, setRecordId] = useState('')
  const { response, error, del, get, post, put } = useCustomApiHook()
  const [isActive, setIsActive] = useState(false)
  const [fieldType, setFieldType] = useState('')

  const { id } = router.query

  const handleOpen = () => {
    setOpen(true)
    setIsCreating(false)
  }

  const handleClose = () => {
    setOpen(false)
    setFormName('')
    setFieldType('')
    setIsActive(false)
  }

  const handleReset = () => {
    setFormName('')
    setFieldType('')
    setIsActive(false)
  }

  const handleClick = rowData => {
    router.push(`/invite-team/user/${rowData}`)
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
      name: 'fieldName',
      label: 'Field Name',
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: 'fieldType',
      label: 'Field Type',
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

  const handleFieldTypeChange = event => {
    setFieldType(event.target.value)
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
    setFormName(selectedData.fieldName)
    setFieldType(selectedData.fieldType)
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
    if (response?.data?.status !== 'FAILED') {
      const updatedRole = role.map(data => {
        if (data.id === recordId) {
          return { ...data, fieldName: formName, fieldType: fieldType }
        } else {
          return data
        }
      })

      setRole(updatedRole)
    }
  }, [response])

  useEffect(() => {
    id && fetchCustomForm()
  }, [id])

  const fetchCustomForm = async () => {
    const res = await get(`/customFields/${id}`)
    setRole(res?.data)
  }

  useEffect(() => {
    const fetchGroupData = async () => {
      const res = await get(`/customFields/${id}`)
      setRole(res?.data)
    }

    const status = response?.data.status
    if (status !== 'FAILED') {
      id && fetchGroupData()
      handleClose()
    }
  }, [response])


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log(isActive)
    const data = {
      fieldName: formName,
      fieldType
    }

    await post(`/customFields/create/${id}`, data)
  }

  async function handleEditForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = {
      fieldName: formName,
      fieldType
    }

    await put(`/customFields/update/${recordId}`, data)
  }

  return (
    <>
      <Fab color='primary' aria-label='add' onClick={handleOpen} style={{ position: 'fixed', bottom: 24, right: 24 }}>
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add custom fields</DialogTitle>
        <DialogContent>
          <InputLabel>Mandatory fields are marked with (*)</InputLabel>
          <TextField
            label='Form Name*'
            value={formName}
            onChange={e => setFormName(e.target.value)}
            fullWidth
            margin='normal'
          />

          <FormControl fullWidth margin='normal'>
            <InputLabel>Field Type*</InputLabel>
            <Select value={fieldType} onChange={handleFieldTypeChange}>
              {supportedFieldTypes.map(type => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
      <MUIDataTable title={'Custom Form'} data={role} columns={columns} options={options} />
    </>
  )
}

// @ts-ignore
export default authRoute(DynamicExtraFields)
