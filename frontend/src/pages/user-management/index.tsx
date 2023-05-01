// ** MUI Imports
// @ts-nocheck
import { useEffect, useState } from 'react'
import authRoute from 'src/@core/utils/auth-route'
import MUIDataTable from 'mui-datatables'
import { useRouter } from 'next/router'
import { Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import { useUserData } from 'src/@core/hooks/useUserData'

const UserManagement = () => {
  const [role, setRole] = useState([])
  const router = useRouter()
  const { get } = useCustomApiHook()
  const { accountId, userId } = useUserData()

  const handleClick = () => {
    router.push(`/user-management/edit/${userId}`)
  }

  const columns = [
    {
      name: 'userId',
      label: 'Id',
      options: {
        filter: true,
        sort: true,
        display: 'none'
      }
    },
    {
      name: 'firstName',
      label: 'First Name',
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: 'lastName',
      label: 'Last Name',
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: 'username',
      label: 'User name',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'email',
      label: 'Email',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'role',
      label: 'Role',
      options: {
        filter: true,
        sort: false
      }
    }
  ]

  const options = {
    filterType: 'checkbox',
    onRowClick: rowData => {
      handleClick(rowData[0])
    }
  }

  const handleOpen = () => {
    router.push('user-management/new')
  }

  useEffect(() => {
    if (accountId) {
      fetchUserForAccount()
    }
  }, [accountId])

  const fetchUserForAccount = async () => {
    const getUsersForAccount = await get(`/users/getUserForAccount/${accountId}`)
    setRole(getUsersForAccount?.data)
  }

  return (
    <>
      <Fab color='primary' aria-label='add' onClick={handleOpen} style={{ position: 'fixed', bottom: 24, right: 24 }}>
        <AddIcon />
      </Fab>
      <MUIDataTable title={'Users List'} data={role} columns={columns} options={options} />
    </>
  )
}

// @ts-ignore
export default authRoute(UserManagement)
