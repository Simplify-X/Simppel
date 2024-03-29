// @ts-nocheck
import { useEffect, useState } from 'react'

import * as React from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import ClearIcon from '@mui/icons-material/Clear'
import LaunchIcon from '@mui/icons-material/Launch'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { useUserData } from 'src/@core/hooks/useUserData'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import { useRouter } from 'next/router'
import { Snackbar } from '@mui/material'
import { Alert } from '@mui/material'

interface Column {
  id: 'image' | 'totalRatings' | 'sellerRatings' | 'pricePerUnit'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  { id: 'image', label: 'Title', minWidth: 170 },
  {
    id: 'totalRatings',
    label: 'Total Ratings',
    minWidth: 170
  },
  {
    id: 'sellerRatings',
    label: 'Seller Rating',
    minWidth: 170
  },
  {
    id: 'pricePerUnit',
    label: 'Price Per Unit',
    minWidth: 100
  }
]

export default function Tracker() {
  const [page, setPage] = React.useState(0)
  const [product, setProduct] = React.useState([])
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const { get, del } = useCustomApiHook()
  const { userId } = useUserData()
  const router = useRouter()
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  function handleSnackbarClose() {
    setOpenSnackbar(false)
  }

  const getSavedProduct = async () => {
    const product = await get(`/product/tracker/${userId}`)
    console.log(product)

    // Sorting the product array based on the created_at property
    product?.data.sort((a, b) => {
      const dateA = new Date(a.created_at)
      const dateB = new Date(b.created_at)

      return dateB - dateA
    })

    setProduct(product?.data)
  }

  useEffect(() => {
    userId && getSavedProduct()
  }, [userId])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleRemoveProduct = async (e: any, rowData: any) => {
    e.preventDefault()
    e.stopPropagation()

    // Handle click event here with rowData
    await del(`/product/tracker/delete/${rowData.id}`)

    // Update the product state after successful deletion
    setProduct(prevProduct => prevProduct.filter(product => product.id !== rowData.id))
    setSnackbarMessage('Removed product from the product tracker')
    setSnackbarSeverity('success')
    setOpenSnackbar(true)
  }

  const handleSupplierButtonClick = (e: any, rowData: any) => {
    e.preventDefault()
    e.stopPropagation()

    const productName = rowData.title // Extract the product name from the rowData
    const url = `https://www.alibaba.com/trade/search?fsb=y&IndexArea=product_en&CatId=&SearchText=${encodeURIComponent(
      productName
    )}`

    // Open the URL in a new window/tab
    window.open(url, '_blank')
  }

  const handleCopyClick = text => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log('Text copied to clipboard:', text)

        // You can show a success message or perform any other action here
      })
      .catch(error => {
        console.error('Error copying text:', error)

        // You can show an error message or handle the error as needed
      })
  }

  const renderTitleCell = (value: string, columnId: string, rowId: string, rowData: any) => {
    if (columnId === 'image') {
      return (
        <TableCell key={columnId} align={columns[0].align}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '10px', display: 'grid' }}>
              <a
                href='#'
                onClick={e => handleRemoveProduct(e, rowData)}
                className='plus-icon'
                style={{ color: '#808080' }}
              >
                <ClearIcon />
              </a>
              <a
                href='#'
                onClick={e => handleSupplierButtonClick(e, rowData)}
                className='plus-icon'
                style={{ color: '#808080' }}
              >
                <LaunchIcon />
              </a>
            </div>
            <img src={value} alt='Image' width='130' height='130' />
            <div style={{ marginLeft: '10px', width: 'auto', display: 'grid' }}>
              <span title={rowData.title} style={{ fontWeight: 'bold' }}>
                {rowData?.title?.slice(0, 15)}
                <ContentCopyIcon
                  style={{ marginLeft: '5px', verticalAlign: 'middle', cursor: 'pointer', fontSize: '1rem' }}
                  onClick={() => handleCopyClick(rowData.title)}
                />
              </span>
              <span title={rowData.asin}>
                ASIN:{rowData.asin}
                <ContentCopyIcon
                  style={{ marginLeft: '5px', verticalAlign: 'middle', cursor: 'pointer', fontSize: '1rem' }}
                  onClick={() => handleCopyClick(rowData.asin)}
                />
              </span>
            </div>
          </div>
        </TableCell>
      )
    } else {
      return (
        <TableCell key={columnId} align={columns[0].align}>
          {value}
        </TableCell>
      )
    }
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {product?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align='center'>
                  No data to display
                </TableCell>
              </TableRow>
            ) : (
              product?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any, index: any) => {
                const rowId = `${row.code}-${index}`

                const handleRowClick = () => {
                  router.push(`/product/view/${row.asin}`)
                  console.log('Row clicked!', row) // Log the clicked row data
                }

                return (
                  <TableRow hover role='checkbox' tabIndex={-1} key={row.code} onClick={handleRowClick}>
                    {columns.map(column => (
                      <React.Fragment key={column.id}>
                        {renderTitleCell(row[column.id], column.id, rowId, row)}
                      </React.Fragment>
                    ))}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={product?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

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
    </Paper>
  )
}
