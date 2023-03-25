// ** MUI Imports
// @ts-nocheck
import {useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import authRoute from 'src/@core/utils/auth-route';
import MUIDataTable from "mui-datatables";
import { useRouter } from 'next/router';

const Users = () => {
  const [role, setRole] = useState([]);
  const router = useRouter()


  const handleClick = (rowData) => {
    fetch(`http://localhost:8080/api/users/getSingleUser/${rowData}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        router.push(`/users/view-user?id=${data.accountId}`);
      }
      )
      .catch((error) => {
        console.error('Error:', error);
      }
      );
  };

  const columns = [
    {
      name: "accountId",
      label: "Id",
      options: {
       filter: true,
       sort: true,
      }
     },
    {
     name: "firstName",
     label: "First Name",
     options: {
      filter: true,
      sort: true,
     }
    },
    {
     name: "lastName",
     label: "Last Name",
     options: {
      filter: true,
      sort: true,
     }
    },
    {
     name: "username",
     label: "User name",
     options: {
      filter: true,
      sort: false,
     }
    },
    {
     name: "role",
     label: "Role",
     options: {
      filter: true,
      sort: false,
     }
    },
   ];

  const options = {
    filterType: 'checkbox',
    onRowClick: (rowData, rowState) => {
      console.log(rowData, rowState);
      handleClick(rowData[0]);
    },
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      // Token not found, redirect to login page
      window.location.replace('/pages/login');

      return;
    }

    fetch('http://localhost:8080/api/users/getAllUsers')
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
        console.log(data)
        setRole(data);
      })
      .catch((error) => {
        console.error(error);
        window.location.replace('/pages/login');
      });
  }, []);




  return (
  <MUIDataTable 
    title={"Users List"}
    data={role}
    columns={columns}
    options={options}
  />
  )
}

// @ts-ignore
export default authRoute(Users)
