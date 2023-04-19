// ** MUI Imports
// @ts-nocheck
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import authRoute from 'src/@core/utils/auth-route'
import MUIDataTable from 'mui-datatables'
import { useRouter } from 'next/router'
import * as Sentry from '@sentry/nextjs'
import { API_BASE_URL } from 'src/config'
import { Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

const UserManagement = () => {
  const [role, setRole] = useState([])
  const router = useRouter()
  const [accountId, setAccountId] = useState(null)

  const handleClick = rowData => {
    fetch(`${API_BASE_URL}/users/getAccountUser/${rowData}`)
      .then(response => response.json())
      .then(data => {
        router.push(`/user-management/edit?id=${data.userId}`)
      })
      .catch(error => {
        Sentry.captureException(error)
      })
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
    const token = Cookies.get('token')
    if (!token) {
      window.location.replace('/login')

      return
    }

    fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
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
  }, [])

  useEffect(() => {
    if (accountId) {
      fetch(`${API_BASE_URL}/users/getUserForAccount/${accountId}`)
        .then(response => response.json())
        .then(data => {
          setRole(data)
        })
        .catch(error => {
          Sentry.captureException(error)
        })
    }
  }, [accountId])

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
