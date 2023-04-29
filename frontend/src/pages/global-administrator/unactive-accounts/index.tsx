// ** MUI Imports
// @ts-nocheck
import { useEffect, useState } from 'react'
import authRoute from 'src/@core/utils/auth-route'
import MUIDataTable from 'mui-datatables'
import { useRouter } from 'next/router'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import CircularProgress from '@mui/material/CircularProgress'

const UnactiveAccounts = () => {
  const [role, setRole] = useState([])
  const router = useRouter()
  const { get } = useCustomApiHook()
  const [accountLoading, setAccountLoading] = useState(true);

  const handleClick = rowData => {
      router.push(`/global-administrator/users/view-user?id=${rowData}`)
  }

  const columns = [
    {
      name: 'accountId',
      label: 'Id',
      options: {
        filter: true,
        sort: true
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
      name: 'accountRole',
      label: 'Role',
      options: {
        filter: true,
        sort: false,
        customBodyRender: value => {
          return value === 0 ? 'User' : 'Account Admin'
        }
      }
    }
  ]

  const options = {
    filterType: 'checkbox',
    onRowClick: rowData => {
      handleClick(rowData[0])
    }
  }

  useEffect(() => {
    fetchUnactiveAccounts()
  }, [])

  const fetchUnactiveAccounts = async () => {
    const fetchAccounts = await get('/users/getInactiveUsers');
    setRole(fetchAccounts?.data);
    setAccountLoading(false);
  }

  
  if (accountLoading) {
    return <CircularProgress />
  }

  return <MUIDataTable title={'Unactive User List'} data={role} columns={columns} options={options} />
}

// @ts-ignore
export default authRoute(UnactiveAccounts)
