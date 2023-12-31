// @ts-nocheck

import { useState, useEffect } from 'react'
import { Fab, Dialog, DialogTitle, DialogContent, TextField, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import MUIDataTable from 'mui-datatables'
import authRoute from 'src/@core/utils/auth-route'
import { useRouter } from 'next/router'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useUserData } from 'src/@core/hooks/useUserData'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'

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
  const { id } = router.query
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState('')
  const { response, get, post, del } = useCustomApiHook()
  const { accountId, userId } = useUserData()

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
      name: 'userId',
      label: 'UserId',
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
        customBodyRender: (value, tableMeta) => {
          const rowId = tableMeta.rowData[0]
          const userIdMember = tableMeta.rowData[1]

          return (
            <>
              <IconButton onClick={() => handleEdit(tableMeta.rowData)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(rowId, userIdMember)}>
                <DeleteIcon />
              </IconButton>
            </>
          )
        }
      }
    }
  ]

  const handleEdit = rowData => {
    const [selectedData] = groupMemberData.filter(data => data.id === rowData[0])

    setOpen(true)
    setSelectedUser(selectedData.userId)
    setMemberRole(selectedData.role)
  }

  async function handleDelete(rowId, userIdMember) {
    await del(`/groups/members/delete/${rowId}/${userIdMember}`)
  }

  const options = {
    filterType: 'checkbox'
  }

  const handleAddUser = () => {
    router.push('/user-management/new')
  }

  useEffect(() => {
    const fetchGroupMemberData = async () => {
      const res = await get(`/groups/members/${id}`)
      res?.data && setGroupMemberData(res.data)
    }

    id && fetchGroupMemberData()
  }, [id])

  useEffect(() => {
    const fetchUserForAccount = async () => {
      const res = await get(`/users/getUserForAccount/${accountId}/${userId}`)
      res?.data && setUsers(res.data)
    }
    userId && accountId && fetchUserForAccount()
  }, [accountId, open, userId])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = {
      userId: selectedUser,
      role: memberRole,
      teamGroupId: id
    }

    await post(`/groups/members/create/${accountId}`, data)
  }

  useEffect(() => {
    const fetchGroupMembersData = async () => {
      const res = await get(`/groups/members/${id}`)
      res?.data && setGroupMemberData(res.data)
    }

    const status = response?.data.status
    if (status !== 'FAILED') {
      id && fetchGroupMembersData()
      handleClose()
    }
  }, [response])

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
              {users.length === 0 ? (
                <MenuItem value='' disabled>
                  No Users
                </MenuItem>
              ) : (
                users.map(user => (
                  <MenuItem key={user?.userId} value={user?.userId}>
                    {user?.username}
                  </MenuItem>
                ))
              )}
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
