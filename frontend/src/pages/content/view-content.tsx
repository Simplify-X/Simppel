// ** MUI Imports
// @ts-nocheck
import {useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Cookies from 'js-cookie';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import authRoute from 'src/@core/utils/auth-route'

const ViewContent = () => {
  const [content, setContent] = useState([]);


  const handleClick = (event: any) => {

    fetch(`http://localhost:8080/api/advertisements/single/${event.row.id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      }
      )
      .catch((error) => {
        console.error('Error:', error);
      }
      );
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 400 },
    {
      field: 'name',
      headerName: 'Name',
      width: 500,
      editable: true,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 500,
      editable: true,
    },
  ];

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      // Token not found, redirect to login page
      window.location.replace('/pages/login');

      return;
    }

    fetch('http://localhost:8080/api/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          // Get account ID from response body
          return response.json();
        } else {
          // Token not valid, redirect to login page
          throw new Error('Invalid token');
        }
      })
      .then((data) => {
        fetch(`http://localhost:8080/api/advertisements/${data}`)
          .then((response) => response.json())
          .then((data) => {
            setContent(data);
          });
      })
      .catch((error) => {
        console.error(error);
        window.location.replace('/pages/login');
      });
  }, []);

  return (
    <Box sx={{ height: 400, width: '100%' }}>
    <DataGrid
    rows={content}
    columns={columns}
    initialState={{
      pagination: {
        paginationModel: {
          pageSize: 5,
        },
      },
    }}
    pageSizeOptions={[5]}
    checkboxSelection
    disableRowSelectionOnClick
    onRowClick={handleClick}
  />
  </Box>
  )
}

// @ts-ignore
export default authRoute(ViewContent)
