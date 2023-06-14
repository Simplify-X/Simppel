// @ts-nocheck
// ** React Imports

import { useState, useRef } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import authRoute from 'src/@core/utils/auth-route'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Snackbar } from '@mui/material'
import { Alert } from '@mui/material'
import { useRouter } from 'next/router'

// import Cookies from 'js-cookie'
import { useTranslation } from 'react-i18next'
import MyEditor from './MyEditor'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'

const AddNotifications = () => {
  // ** States
  const { t } = useTranslation()
  const [editorContent, setEditorContent] = useState('')
  const { post } = useCustomApiHook()
  const router = useRouter()

  const handleEditorChange = content => {
    setEditorContent(content)
  }

  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  function handleSnackbarClose() {
    setOpenSnackbar(false)
  }

  const nameRef = useRef<HTMLInputElement>(null)

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const name = nameRef.current?.value

    const data = {
      title: name,
      description: editorContent
    }

    const r = await post(`/notifications`, data)
    const status = r?.data.status

    if (status === 'OK') {
      setSnackbarMessage('Added Notification')
      setSnackbarSeverity('success')
      setOpenSnackbar(true)

      // Delay the redirection by 2 seconds
      setTimeout(() => {
        router.push('/global-administrator/notifications');
      }, 2000)
    } else {
      setSnackbarMessage('Failed Adding Notification')
      setSnackbarSeverity('success')
      setOpenSnackbar(true)
    }
  }

  return (
    <form onSubmit={submitForm}>
      <Card>
        <CardHeader title='Create Notification' titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          <ToastContainer position={'top-center'} draggable={false} />
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Title'
                inputRef={nameRef}
                required
                helperText='Enter title for notification'
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card style={{ marginTop: '20px' }}>
        <MyEditor handleEditorChange={handleEditorChange} />
      </Card>

      <Button type='submit' variant='contained' size='large' style={{ marginTop: '20px' }}>
        {t('create')}
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
    </form>
  )
}

export default authRoute(AddNotifications)
