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
import FileCopyIcon from '@mui/icons-material/FileCopy'

import { Snackbar } from '@mui/material';
import { Alert } from '@mui/material';


const DropShippingAdmin = () => {
  const [showDropProduct, setDropProduct] = useState([])
  const router = useRouter()
  const { get, del, post } = useCustomApiHook()
  const [loading, setLoading] = useState(false)

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  function handleSnackbarClose() {
    setOpenSnackbar(false);
  }


  const handleClick = rowData => {
    console.log(rowData)
    router.push(`/global-administrator/dropshipping/edit/${rowData}`)
  }

  const handleOpen = () => {
    router.push('dropshipping/add/')
  }

  const handleDuplicate = async (rowData) => {
    console.log(rowData);
  
    const r = await post(`/dropshipping/duplicate/${rowData}`);
  
    const status = r?.data.status;
  
    if (status === 'OK') {
      setSnackbarMessage('Product duplicated');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
  
      // Fetch the updated list of dropshipping products
      getDropshippingProducts();
    } else {
      setSnackbarMessage('Failed duplicating product');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
  
      // If the duplication failed, revert the state back to the original notifications
      setDropProduct(showDropProduct);
    }
  };
  

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
        sort: true,
        customBodyRender: (value) => {
          if (value.length > 50) {
            return <span>{`${value.substring(0, 50)}...`}</span>;
          }
          
          return <span>{value}</span>;
        },
      },
    },
    {
      name: 'price',
      label: 'Price',
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: 'profitMargin',
      label: 'Profit Margin',
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
              <IconButton
                onClick={e => {
                  e.stopPropagation()
                  handleDuplicate(rowId)
                }}
              >
                <FileCopyIcon />
              </IconButton>
            </>
          )
        }
      }
    }
  ]

  async function handleDelete(rowId) {
    const updatedNotifications = showDropProduct.filter(notification => notification.id !== rowId);
    setDropProduct(updatedNotifications);

    const r = await del(`/dropshipping/delete/${rowId}`);

    const status = r?.data.status;

    if (status === 'OK') {
      setSnackbarMessage('Product Deleted');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } else {
      setSnackbarMessage('Failed deleting product');
      setSnackbarSeverity('error'); // Update the severity to 'error'
      setOpenSnackbar(true);
      
      // If the deletion failed, revert the state back to the original notifications
      setDropProduct(showDropProduct);
    }
  }

  const options = {
    filterType: 'checkbox',
    onRowClick: rowData => {
      handleClick(rowData[0])
    }
  }

  async function getDropshippingProducts() {
    const getAllDropshippingProducts = await get(`/dropshipping`)
    setDropProduct(getAllDropshippingProducts?.data)
    setLoading(true)
  }

  const sortedArray = [...showDropProduct].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at)
  })


  useEffect(() => {
    getDropshippingProducts()
  }, [])

  if (!loading) {
    return <CircularProgress />
  }

  return (
    <>
      <Fab color='primary' aria-label='add' onClick={handleOpen} style={{ position: 'fixed', bottom: 24, right: 24 }}>
        <AddIcon />
      </Fab>
      <MUIDataTable title={'Dropshipping products'} data={sortedArray} columns={columns} options={options} />
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
export default authRoute(DropShippingAdmin)
