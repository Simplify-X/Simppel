// ** MUI Imports
// @ts-nocheck
import {useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import authRoute from 'src/@core/utils/auth-route';
import MUIDataTable from "mui-datatables";
import { useRouter } from 'next/router';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box'
import * as Sentry from "@sentry/nextjs"
import { API_BASE_URL } from 'src/config'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook';
import { useUserData } from 'src/@core/hooks/useUserData';

const ViewAutomation = () => {
  const [content, setContent] = useState([]);
  const router = useRouter()

  const { response, loading, error , get, post } = useCustomApiHook();
  const [accountId, userId, token] = useUserData();

  const columns = [
    {
     name: "id",
     label: "Id",
     options: {
      filter: true,
      sort: true,
     }
    },
    {
     name: "automationName",
     label: "Product Name",
     options: {
      filter: true,
      sort: true,
     }
    },
    {
     name: "automationDescription",
     label: "Product Description",
     options: {
      filter: true,
      sort: false,
     }
    },

    {
      name: "automationDate",
      label: "Automation Date",
      options: {
       filter: true,
       sort: false,
      }
     },

     {
        name: "automationTime",
        label: "Automation Time",
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



  const handleClick = async (rowData) => {
    const res = await get(`/advertisements/single/${rowData}`)
    res?.data && router.push(`/content/content?id=${res.data?.id}`);
  };  


  useEffect(()=>{
   error && Sentry.captureException(error);
  },[error])


  useEffect(() => {
    
    userId && handlePostsData()
    // Sentry.captureException(error);
    // window.location.replace('/login');

  }, [userId]);

  const handlePostsData = async ()=>{
    const res = await get(`/posts/${userId}`)
    res?.data && setContent(res?.data);
  }

  const addAutomation = () => {
    router.push('/automation');
  }

  return (
    <Box sx={{ width: '100%' }}>
        <MUIDataTable 
            title={"Content List"}
            data={content}
            columns={columns}
            options={options}
        />

        <Fab color="primary" aria-label="add" onClick={addAutomation} style={{marginTop: "10px"}}>
            <AddIcon />
        </Fab>

     </Box>

  )
}

// @ts-ignore
export default authRoute(ViewAutomation)
