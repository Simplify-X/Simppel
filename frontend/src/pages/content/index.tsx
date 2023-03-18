// @ts-nocheck
// ** React Imports

import { useState, useEffect, useRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import authRoute from 'src/@core/utils/auth-route'
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

const Content = () => {
  // ** States
  const [accountId, setAccountId] = useState(null);

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
        setAccountId(data);
      })
      .catch((error) => {
        console.error(error);
        window.location.replace('/pages/login');
      });
  }, []);

  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);


  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = nameRef.current?.value;
    const description = descriptionRef.current?.value;

    const data = {
      name,
      description,
    };

    const config = {
      method: 'post',
      url: `http://localhost:8080/api/advertisements/${accountId}`,
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    };

    axios(config)
      .then(function (response) {
        if (response.data.status === 'FAILED') {
          toast.error('Error', { autoClose: 3000 });
          
          // @ts-ignore
          nameRef?.current?.value = '';
          descriptionRef?.current?.value = '';

        } else {
          toast.success('Advertisement Added', { autoClose: 2000 });
          nameRef?.current?.value = '';
          descriptionRef?.current?.value = '';
        }
      })
      .catch(function (error) {
        toast.error('An error occurred. Please try again later', { autoClose: 3000 });
        console.log(error);
      });
  }

  return (
    <Card>
      <CardHeader title='Create an Ad' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={submitForm}>
        <ToastContainer position={'top-center'} draggable={false}/>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField fullWidth label='Name' placeholder='Leonard Carter' inputRef={nameRef}/>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='text'
                label='Description'
                placeholder='A flying bottle'
                helperText='Enter whatever you want'
                inputRef={descriptionRef}
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  gap: 5,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Button type='submit' variant='contained' size='large'>
                  Create!
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default authRoute(Content)
