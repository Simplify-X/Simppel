// ** React Imports
// @ts-nocheck
import { useState, useEffect, ChangeEvent } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import Box from '@mui/material/Box'

// ** Custom Hooks
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import { useUserData } from 'src/@core/hooks/useUserData'

// ** Utils
import * as Sentry from '@sentry/nextjs'

interface Column {
  id: 'id' | 'automationName' | 'automationDescription' | 'automationDate' | 'automationTime'
  label: string
  minWidth?: number
  align?: 'right'
}

const columns: readonly Column[] = [
  { id: 'id', label: 'Id', minWidth: 100 },
  { id: 'automationName', label: 'Product Name', minWidth: 200 },
  { id: 'automationDescription', label: 'Product Description', minWidth: 250 },
  { id: 'automationDate', label: 'Automation Date', minWidth: 170 },
  { id: 'automationTime', label: 'Automation Time', minWidth: 170 },
]

interface Data {
  id: string
  automationName: string
  automationDescription: string
  automationDate: string
  automationTime: string
}

const TableStickyHeader = () => {
  // ** States
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [rows, setRows] = useState<Data[]>([])
  const { error, get } = useCustomApiHook()
  const { userId } = useUserData()
  const router = useRouter()

  useEffect(() => {
    error && Sentry.captureException(error)
  }, [error])

  useEffect(() => {
    userId && handlePostsData()
  }, [userId])

  const handlePostsData = async () => {
    const res = await get(`/posts/${userId}`)
    if (res?.data) {
      setRows(res.data.map(data => ({
        id: data.id,
        automationName: data.automationName,
        automationDescription: data.automationDescription,
        automationDate: data.automationDate,
        automationTime: data.automationTime,
      })))
    }
  }

  const handleClick = async rowData => {
    console.log('here');
    const res = await get(`/advertisements/single/${rowData}`)
    res?.data && router.push(`/content/content?id=${res.data?.id}`)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const addAutomation = () => {
    router.push('/automation')
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                <TableRow 
                  hover 
                  role='checkbox' 
                  tabIndex={-1} 
                  key={row.id} 
                  onClick={() => handleClick(row.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {columns.map(column => {
                    const value = row[column.id]
                    
                  return (
                      <TableCell key={column.id} align={column.align}>
                        {value}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component='div'
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Fab color='primary' aria-label='add' onClick={addAutomation} sx={{ mt: 2 }}>
        <AddIcon />
      </Fab>
    </Box>
  )
}

export default TableStickyHeader
