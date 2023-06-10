// @ts-nocheck

import { useEffect, useState } from 'react'
import authRoute from 'src/@core/utils/auth-route'
import MUIDataTable from 'mui-datatables'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import CircularProgress from '@mui/material/CircularProgress'
import { Fab, Modal, Box, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useRouter } from 'next/router'
import { IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import Typography from '@mui/material/Typography'

import { Snackbar } from '@mui/material'
import { Alert } from '@mui/material'
import * as XLSX from 'xlsx' // Import XLSX library for parsing Excel files

const DropShippingAdmin = () => {
  const [showDropProduct, setDropProduct] = useState([])
  const router = useRouter()
  const { get, del, post } = useCustomApiHook()
  const [loading, setLoading] = useState(false)
  const [importedData, setImportedData] = useState(null) // State to store the imported data
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')
  const [openModal, setOpenModal] = useState(false)
  function handleSnackbarClose() {
    setOpenSnackbar(false)
  }

  const handleClick = rowData => {
    console.log(rowData)
    router.push(`/global-administrator/dropshipping/edit/${rowData}`)
  }

  const handleOpen = () => {
    router.push('dropshipping/add/')
  }

  const handleDuplicate = async rowData => {
    console.log(rowData)

    const r = await post(`/dropshipping/duplicate/${rowData}`)

    const status = r?.data.status

    if (status === 'OK') {
      setSnackbarMessage('Product duplicated')
      setSnackbarSeverity('success')
      setOpenSnackbar(true)

      // Fetch the updated list of dropshipping products
      getDropshippingProducts()
    } else {
      setSnackbarMessage('Failed duplicating product')
      setSnackbarSeverity('error')
      setOpenSnackbar(true)

      // If the duplication failed, revert the state back to the original notifications
      setDropProduct(showDropProduct)
    }
  }

  // Function to handle the Excel file import
  async function handleImport(file) {
    const reader = new FileReader()
    reader.onload = e => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      setImportedData(jsonData) // Store the imported data in the state
      setOpenModal(true) // Open the modal after importing
    }
    reader.readAsArrayBuffer(file)
  }

  // Function to persist products to the API
  async function persistProducts() {
    try {
      setLoading(true)
      for (let i = 1; i < importedData.length; i++) {
        const [
          title,
          price,
          image,
          category,
          saturation,
          demand,
          profitMargin,
          suppliers,
          similarItems,
          targeting,
          analytics,
          facebookAds,
          description
        ] = importedData[i]

        // Check if the imported row has the expected number of columns
        if (importedData[i].length !== 13) {
          throw new Error('Invalid data format')
        }

        // Perform validation and transformation if necessary
        // Persist the product to your API using the post() function from useCustomApiHook
        await post('/dropshipping', {
          title,
          price,
          image,
          category,
          saturation,
          demand,
          profitMargin,
          suppliers,
          similarItems,
          targeting,
          analytics,
          facebookAds,
          description
        })
      }
      setLoading(false)
      setSnackbarMessage('Products imported successfully')
      setSnackbarSeverity('success')
      setOpenSnackbar(true)

      // Fetch the updated list of dropshipping products
      getDropshippingProducts()
    } catch (error) {
      setLoading(false)
      setSnackbarMessage('Failed to import products')
      setSnackbarSeverity('error')
      setOpenSnackbar(true)
    }
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
        sort: true,
        customBodyRender: value => {
          if (value?.length > 50) {
            return <span>{`${value.substring(0, 50)}...`}</span>
          }

          return <span>{value}</span>
        }
      }
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
    const updatedNotifications = showDropProduct.filter(notification => notification.id !== rowId)
    setDropProduct(updatedNotifications)

    const r = await del(`/dropshipping/delete/${rowId}`)

    const status = r?.data.status

    if (status === 'OK') {
      setSnackbarMessage('Product Deleted')
      setSnackbarSeverity('success')
      setOpenSnackbar(true)
    } else {
      setSnackbarMessage('Failed deleting product')
      setSnackbarSeverity('error') // Update the severity to 'error'
      setOpenSnackbar(true)

      // If the deletion failed, revert the state back to the original notifications
      setDropProduct(showDropProduct)
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

  const handleModalClose = () => {
    setOpenModal(false);
    setImportedData(null);
  };

  if (!loading) {
    return <CircularProgress />
  }

  return (
    <>
      <Button variant='contained' color='primary' onClick={() => setOpenModal(true)} sx={{ mt: 2, mb: 5 }}>
        Import Data
      </Button>
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

      {/* Modal for importing Excel file */}
      <Modal open={openModal} onClose={handleModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            width: 400,
            maxWidth: '90%'
          }}
        >
          <Typography variant='h6' align='center' gutterBottom>
            Import Data
          </Typography>
          <input type='file' accept='.xlsx,.xls' onChange={e => handleImport(e.target.files[0])} />
          {importedData && importedData[0] && importedData[0].length === 13 ? (
            <Button variant='contained' color='primary' onClick={persistProducts} sx={{ mt: 2 }}>
              Import
            </Button>
          ) : (
            importedData && (
              <Alert severity='error' sx={{ mt: 2 }}>
                Invalid data format
              </Alert>
            )
          )}

          <Button variant='contained' color='secondary' onClick={handleModalClose} sx={{ mt: 2 }}>
            Cancel
          </Button>
        </Box>
      </Modal>
    </>
  )
}

// @ts-ignore
export default authRoute(DropShippingAdmin)
