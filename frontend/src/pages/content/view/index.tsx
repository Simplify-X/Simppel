// ** MUI Imports
// @ts-nocheck
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import authRoute from 'src/@core/utils/auth-route'
import MUIDataTable from 'mui-datatables'
import { useRouter } from 'next/router'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import Box from '@mui/material/Box'
import * as Sentry from '@sentry/nextjs'
import { API_BASE_URL } from 'src/config'
import { CircularProgress } from '@mui/material'

const ViewContent = () => {
  const [content, setContent] = useState([])
  const router = useRouter()
  const [loading, setLoading] = useState(true)

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
      name: 'name',
      label: 'Product Name',
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: 'description',
      label: 'Product Description',
      options: {
        filter: true,
        sort: false
      }
    },

    {
      name: 'targetAudience',
      label: 'Target Audience',
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

  const goToAddContent = () => {
    router.push('add')
  }

  const handleClick = rowData => {
    fetch(`${API_BASE_URL}/advertisements/single/${rowData}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        router.push(`/content/view/${data.id}`)
      })
      .catch(error => {
        Sentry.captureException(error)
      })
  }

  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
      // Token not found, redirect to login page
      window.location.replace('/login')

      return
    }

    fetch(`${API_BASE_URL}/users/my`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.ok) {
          // Get account ID from response body
          return response.json()
        } else {
          // Token not valid, redirect to login page
          window.location.replace('/login')
          throw new Error('Invalid token')
        }
      })
      .then(data => {
        fetch(`${API_BASE_URL}/advertisements/${data}`)
          .then(response => response.json())
          .then(data => {
            setContent(data)
            setLoading(false)
          })
      })
      .catch(error => {
        Sentry.captureException(error)
        window.location.replace('/login')
      })
  }, [])

  const sortedArray = [...content].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  if (loading) {
    return <CircularProgress />
  }

  return (
    <Box sx={{ width: '100%' }}>
      <MUIDataTable title={'Content List'} data={sortedArray} columns={columns} options={options} />

      <Fab color='primary' aria-label='add' style={{ marginTop: '10px' }} onClick={goToAddContent}>
        <AddIcon />
      </Fab>
    </Box>
  )
}

// @ts-ignore
export default authRoute(ViewContent)
