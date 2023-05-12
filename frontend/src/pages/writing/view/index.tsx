// ** MUI Imports
// @ts-nocheck
import { useEffect, useState } from 'react'
import authRoute from 'src/@core/utils/auth-route'
import MUIDataTable from 'mui-datatables'
import { useRouter } from 'next/router'

//import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'

const Copy = () => {
  const [role, setRole] = useState([])
  const router = useRouter()

  //const { get } = useCustomApiHook()

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
        display: 'none',
      }
    },
    {
      name: 'name',
      label: 'Title',
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: 'description',
      label: 'Description',
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: 'targetAudience',
      label: 'Target Audience',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'purpose',
      label: 'Purpose',
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) => (value ? 'Admin' : 'User')
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
    getAllUsers();
  }, [])


  const getAllUsers = async () => {
    // const users = await get('/users/getAllUsers');
    setRole([])
  }

  const sortedArray = [...role].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });


  return <MUIDataTable title={'Copy List'} data={sortedArray} columns={columns} options={options} />
}

// @ts-ignore
export default authRoute(Copy)
