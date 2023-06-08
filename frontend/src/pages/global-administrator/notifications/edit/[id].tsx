// @ts-nocheck
// ** React Imports
import { useState, useRef, useEffect } from 'react';

// ** MUI Imports
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import authRoute from 'src/@core/utils/auth-route';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Snackbar } from '@mui/material';
import { Alert } from '@mui/material';
import { useRouter } from 'next/router';

// import Cookies from 'js-cookie'
import { useTranslation } from 'react-i18next';
import MyEditor from '../MyEditor';
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook';
import CircularProgress from '@mui/material/CircularProgress';

const EditNotifications = () => {
  // ** States
  const { t } = useTranslation();
  const [editorContent, setEditorContent] = useState('');
  const { put, get } = useCustomApiHook();
  const router = useRouter();
  const { id } = router.query; // Get the ID from the router query

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  function handleSnackbarClose() {
    setOpenSnackbar(false);
  }

  const nameRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false); // Add a loading state

  useEffect(() => {
    async function fetchNotification() {
      try {
        setIsLoading(true); // Set loading state to true before fetching data

        const response = await get(`/notifications/${id}`);
        const notification = response.data;

        nameRef.current.value = notification.title;
        setEditorContent(notification.description);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false); // Set loading state to false after fetching data
      }
    }

    if (id) {
      fetchNotification();
    }
  }, [id]);

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = nameRef.current?.value;

    const data = {
      title: name,
      description: editorContent,
    };

    const r = await put(`/notifications/${id}`, data); // Update the notification with the given ID
    const status = r?.data.status;

    if (status === 'OK') {
      setSnackbarMessage('Notification Updated');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      // Delay the redirection by 2 seconds
      setTimeout(() => {
        router.push('/global-administrator/notifications');
      }, 2000);
    } else {
      setSnackbarMessage('Failed Updating Notification');
      setSnackbarSeverity('error'); // Update the severity to 'error'
      setOpenSnackbar(true);
    }
  }

  return (
    <form onSubmit={submitForm}>
      <Card>
        <CardHeader title="Edit Notification" titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          <ToastContainer position={'top-center'} draggable={false} />
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                inputRef={nameRef}
                required
                helperText="Enter title for notification"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card style={{ marginTop: '20px' }}>
        <MyEditor handleEditorChange={handleEditorChange} initialValue={editorContent} />
      </Card>

      <Button type="submit" variant="contained" size="large" style={{ marginTop: '20px' }}>
        {t('update')}
      </Button>
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
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <CircularProgress />
        </div>
      ) : null}
    </form>
  );
};

export default authRoute(EditNotifications);
