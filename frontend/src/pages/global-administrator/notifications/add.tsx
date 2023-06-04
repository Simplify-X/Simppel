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

// import Cookies from 'js-cookie'
import { useTranslation } from 'react-i18next'
import MyEditor from './MyEditor';



const AddNotifications = () => {
  // ** States
  const { t } = useTranslation()
  const [editorContent, setEditorContent] = useState('');




  const handleEditorChange = (content) => {
    setEditorContent(content);
  };


  const nameRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLInputElement>(null)

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = nameRef.current?.value
    const description = descriptionRef.current?.value

    console.log(editorContent)

    const data = {
        title: name,
        description: description,
    }
    // await post(`/posts/${userId}/${accountId}`, data)
  }

  return (
    <form onSubmit={submitForm}>
      <Card>
        <CardHeader title="Create Notification" titleTypographyProps={{ variant: 'h6' }} />
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='text'
                label={t('automation_description')}
                placeholder='A flying bottle'
                helperText={t('automation_description')}
                inputRef={descriptionRef}
                required
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
    </form>
  )
}

export default authRoute(AddNotifications)
