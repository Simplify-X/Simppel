// ** MUI Imports
// @ts-nocheck
import { useEffect, useState } from 'react'
import authRoute from 'src/@core/utils/auth-route'
import MUIDataTable from 'mui-datatables'
import { useRouter } from 'next/router'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'

const Users = () => {
  const [role, setRole] = useState([])
  const router = useRouter()
  const { get } = useCustomApiHook()

  const handleClick = rowData => {
    router.push(`/global-administrator/users/view-user/${rowData}`)
  }

  const columns = [
    {
      name: 'userId',
      label: 'Id',
      options: {
        filter: true,
        sort: true,
        display: 'false'
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
        sort: true
      }
    },
    {
      name: 'role',
      label: 'Role',
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) => (value ? 'Admin' : 'User')
      }
    }
  ]

  const options = {
    filterType: 'dropdown',
    onRowClick: rowData => {
      handleClick(rowData[0])
    }
  }

  useEffect(() => {
    getAllUsers();
  }, [])


  const getAllUsers = async () => {
    const users = await get('/users/getAllUsers');
    setRole(users?.data)
  }

  const sortedArray = [...role].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });


  return <MUIDataTable title={'Users List'} data={sortedArray} columns={columns} options={options} />
}

// @ts-ignore
export default authRoute(Users)
