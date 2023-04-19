// ** MUI Imports
// @ts-nocheck
import {useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import authRoute from 'src/@core/utils/auth-route';
import MUIDataTable from "mui-datatables";
import { useRouter } from 'next/router';
import * as Sentry from "@sentry/nextjs"
import { API_BASE_URL } from 'src/config'


const Users = () => {
  const [role, setRole] = useState([]);
  const router = useRouter()


  const handleClick = (rowData) => {
    fetch(`${API_BASE_URL}/users/getSingleUser/${rowData}`)
      .then((response) => response.json())
      .then((data) => {
        router.push(`/global-administrator/users/view-user?id=${data.userId}`);
      }
      )
      .catch((error) => {
        Sentry.captureException(error);
      }
      );
  };

  const columns = [
    {
      name: "userId",
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
    onRowClick: (rowData) => {
      handleClick(rowData[0]);
    },
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      // Token not found, redirect to login page
      window.location.replace('/login');

      return;
    }

    fetch(`${API_BASE_URL}/users/getAllUsers`)
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
        setRole(data);
      })
      .catch((error) => {
        Sentry.captureException(error);
        window.location.replace('/login');
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
