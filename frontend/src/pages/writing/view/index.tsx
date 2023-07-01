// ** MUI Imports
// @ts-nocheck
import { useEffect, useState } from 'react'
import authRoute from 'src/@core/utils/auth-route'
import MUIDataTable from 'mui-datatables'
import { useRouter } from 'next/router'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import { useUserData } from 'src/@core/hooks/useUserData'
import Loader from 'src/@core/components/ui/Loader'

//import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'

const Copy = () => {
  const [copy, setCopy] = useState([])
  const router = useRouter()
  const {  get } = useCustomApiHook()
  const [loading, setLoading] = useState(true)
  const { userId } = useUserData()



  //const { get } = useCustomApiHook()

  const handleClick = rowData => {
    router.push(`/writing/view/${rowData}`)
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
      name: 'title',
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
      name: 'formType',
      label: 'Form Type',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'languageText',
      label: 'Language',
      options: {
        filter: true,
        sort: false,
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
    userId && getAllUsers();
  }, [userId])


  const getAllUsers = async () => {
    const copyWritingData = await get(`/copyWriting/${userId}`);
    setCopy(copyWritingData.data)
    setLoading(false)
  }

  const sortedArray = [...copy].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  if (loading) {
    return <Loader />
  }

  return <MUIDataTable title={'Copy List'} data={sortedArray} columns={columns} options={options} />
}

// @ts-ignore
export default authRoute(Copy)
