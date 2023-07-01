// ** MUI Imports
// @ts-nocheck
import { useEffect, useState } from 'react'
import authRoute from 'src/@core/utils/auth-route'
import MUIDataTable from 'mui-datatables'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import Loader from 'src/@core/components/ui/Loader'

const Logs = () => {
  const [role, setRole] = useState([])
  const { get } = useCustomApiHook()
  const [isDataFetched, setDataFetched] = useState(true)


  const columns = [
    {
      name: 'userEmail',
      label: 'Email',
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: 'userIp',
      label: 'User IP',
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: 'userAgent',
      label: 'User Agent',
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: 'loginTime',
      label: 'Log in Time',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
            const formattedDateTime = new Date(value).toLocaleString();

            return formattedDateTime;
          }
      }
    },
    {
      name: 'created_at',
      label: 'Created At',
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) => {
            const formattedDateTime = new Date(value).toLocaleString();

            return formattedDateTime;
          }
      }
    },
    {
        name: 'updated_at',
        label: 'Updated At',
        options: {
          filter: true,
          sort: false,
          customBodyRender: (value) => {
              const formattedDateTime = new Date(value).toLocaleString();

              return formattedDateTime;
            }
        }
      }
  ]

  const options = {
    filterType: 'checkbox',
  }

  async function getLogs() {
    const getLogs = await get(`/login-logs`)
    setRole(getLogs?.data)
    setDataFetched(false)
  }



  const sortedArray = [...role].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });


  useEffect(() => {
    getLogs()
  }, [])

  console.log(role)
  
  

  if (isDataFetched) {
    return <Loader />
  }

  return <MUIDataTable title={'Login Logs'} data={sortedArray} columns={columns} options={options} />
}

// @ts-ignore
export default authRoute(Logs)
