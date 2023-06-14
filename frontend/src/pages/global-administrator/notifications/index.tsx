// ** MUI Imports
// @ts-nocheck
import { useEffect, useState } from 'react'
import authRoute from 'src/@core/utils/auth-route'
import MUIDataTable from 'mui-datatables'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import CircularProgress from '@mui/material/CircularProgress'
import { Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useRouter } from 'next/router'
import { IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

import { Snackbar } from '@mui/material';
import { Alert } from '@mui/material';


const Notification = () => {
  const [showNotifications, setNotification] = useState([])
  const router = useRouter()
  const { get, del } = useCustomApiHook()
  const [loading, setLoading] = useState(false)

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  function handleSnackbarClose() {
    setOpenSnackbar(false);
  }


  const handleClick = rowData => {
    console.log(rowData)
    router.push(`/global-administrator/notifications/edit/${rowData}`)
  }

  const handleOpen = () => {
    router.push('notifications/add/')
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
      name: 'actions',
      label: 'Actions',
      options: {
        customBodyRender: (value, tableMeta) => {
          const rowId = tableMeta.rowData[0]

          return (
            <>
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
  const updatedNotifications = showNotifications.filter(notification => notification.id !== rowId);
  setNotification(updatedNotifications);

  const r = await del(`/notifications/delete/${rowId}`);

  const status = r?.data.status;

  if (status === 'OK') {
    setSnackbarMessage('Notification Deleted');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
  } else {
    setSnackbarMessage('Failed deleting Notification');
    setSnackbarSeverity('error'); // Update the severity to 'error'
    setOpenSnackbar(true);
    
    // If the deletion failed, revert the state back to the original notifications
    setNotification(showNotifications);
  }
}



  const options = {
    filterType: 'checkbox',
    onRowClick: rowData => {
      handleClick(rowData[0])
    }
  }

  async function getNotifications() {
    const getAllNotifications = await get(`/notifications`)
    setNotification(getAllNotifications?.data)
    setLoading(true)
  }

  const sortedArray = [...showNotifications].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at)
  })


  useEffect(() => {
    getNotifications()
  }, [])

  if (!loading) {
    return <CircularProgress />
  }

  return (
    <>
      <Fab color='primary' aria-label='add' onClick={handleOpen} style={{ position: 'fixed', bottom: 24, right: 24 }}>
        <AddIcon />
      </Fab>
      <MUIDataTable title={'Notifications'} data={sortedArray} columns={columns} options={options} />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

// @ts-ignore
export default authRoute(Notification)
