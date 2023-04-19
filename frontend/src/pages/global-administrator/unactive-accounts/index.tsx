// ** MUI Imports
// @ts-nocheck
import {useEffect, useState } from 'react'
import authRoute from 'src/@core/utils/auth-route';
import MUIDataTable from "mui-datatables";
import { useRouter } from 'next/router';
import * as Sentry from "@sentry/nextjs"
import { API_BASE_URL } from 'src/config'


const UnactiveAccounts = () => {
  const [role, setRole] = useState([]);
  const router = useRouter()


  const handleClick = (rowData) => {
    fetch(`${API_BASE_URL}/users/getSingleUser/${rowData}`)
      .then((response) => response.json())
      .then((data) => {
        router.push(`/global-administrator/users/view-user?id=${data.accountId}`);
      }
      )
      .catch((error) => {
        Sentry.captureException(error);
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
        name: "accountRole",
        label: "Role",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (value) => {
            return value === 0 ? "User" : "Account Admin";
          },
        },
      },
   ];

  const options = {
    filterType: 'checkbox',
    onRowClick: (rowData) => {
      handleClick(rowData[0]);
    },
  };

  useEffect(() => {

    fetch(`${API_BASE_URL}/users/getInactiveUsers`)
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
    title={"Unactive User List"}
    data={role}
    columns={columns}
    options={options}
  />
  )
}

// @ts-ignore
export default authRoute(UnactiveAccounts)
