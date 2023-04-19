// @ts-nocheck
// ** React Imports

import { useState, useEffect, useRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button, { ButtonProps } from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import authRoute from 'src/@core/utils/auth-route'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import * as Sentry from '@sentry/nextjs'
import { useTranslation } from 'react-i18next'
import DatePickerField from './DatePicker'
import TimePickerField from './TimePicker'
import dayjs from 'dayjs'
import { API_BASE_URL } from 'src/config'



const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const Automation = () => {
  // ** States
  const [accountId, setAccountId] = useState(null)
  const [userId, setUserId] = useState(null)
  const router = useRouter()
  const [selectedLocation, setSelectedLocation] = useState('')
  const [data, setData] = useState([])
  const { t } = useTranslation()

  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  console.log(selectedLocation)




  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader()
    const files = event.target.files
    if (files && files.length !== 0) {
      const newImages = []
      for (let i = 0; i < files.length; i++) {
        reader.onload = () => {
          newImages.push(reader.result as string)
          if (newImages.length === files.length) {
            setImgSrc(newImages)
          }
        }
        reader.readAsDataURL(files[i])
      }
    }
  }


  const handleLocationChange = event => {
    setSelectedLocation(event.target.value)
  }



  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
      // Token not found, redirect to login page
      window.location.replace('/login')

      return
    }

    fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.ok) {
          // Get account ID from response body
          return response.json()
        } else {
          // Token not valid, redirect to login page
          throw new Error('Invalid token')
        }
      })
      .then(data => {
        setAccountId(data)
      })
      .catch(error => {
        Sentry.captureException(error)
        window.location.replace('/login')
      })
  }, [])

  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
      // Token not found, redirect to login page
      window.location.replace('/login')

      return
    }

    fetch(`${API_BASE_URL}/users/my`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.ok) {
          // Get account ID from response body
          return response.json()
        } else {
          // Token not valid, redirect to login page
          throw new Error('Invalid token')
        }
      })
      .then(data => {
        setUserId(data)
      })
      .catch(error => {
        Sentry.captureException(error)
        window.location.replace('/login')
      })
  }, [])

  console.log(userId)

  useEffect(() => {
    if (userId) {
      fetch(`${API_BASE_URL}/users/getSingleUser/${userId}`)
        .then(response => response.json())
        .then(data => {
          setData(data)
        })
        .catch(error => {
          Sentry.captureException(error)
        })
    }
  }, [userId])

  const nameRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLInputElement>(null)
  const targetAudienceRef = useRef<HTMLInputElement>(null)

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = nameRef.current?.value
    const description = descriptionRef.current?.value
    const targetAudience = targetAudienceRef.current?.value

    const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
    const formattedTime = dayjs(selectedTime).format('HH:mm:ss');

    const data = {
      automationName: name,
      automationDescription: description,
      targetAudience: targetAudience,
      postLocation: selectedLocation,
      automationDate: formattedDate,
      automationTime: formattedTime,

    }

    const config = {
      method: 'post',
      url: `${API_BASE_URL}/posts/${userId}/${accountId}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data
    }

    axios(config)
      .then(function (response) {
        if (response.data.status === 'FAILED') {
          toast.error('Error', { autoClose: 3000 })

          // @ts-ignore
          nameRef?.current?.value = ''
          descriptionRef?.current?.value = ''
        } else {
          toast.success('Advertisement Added', { autoClose: 2000 })
          nameRef?.current?.value = ''
          descriptionRef?.current?.value = ''
          router.push('/content/view-content')
        }
      })
      .catch(function (error) {
        Sentry.captureException(error)
        toast.error('An error occurred. Please try again later', { autoClose: 3000 })
      })
  }

  return (
    <form onSubmit={submitForm}>
      <Card>
        <CardHeader title={t('create_automation')} titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          <ToastContainer position={'top-center'} draggable={false} />
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('automation_name')}
                inputRef={nameRef}
                required
                helperText={t('enter_product_name')}
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
            <Grid item xs={6}>
              <FormControl>
                <FormLabel id='demo-row-radio-buttons-group-label'>{t('post_location')}</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby='demo-row-radio-buttons-group-label'
                  name='row-radio-buttons-group'
                  value={selectedLocation}
                  onChange={handleLocationChange}
                >
                  <FormControlLabel disabled value='facebook' control={<Radio />} label='Facebook' />
                  <FormControlLabel value='instagram' control={<Radio />} label='Instagram' />
                  <FormControlLabel disabled value='linkedin' control={<Radio />} label='Linkedin' />
                  <FormControlLabel disabled value='twitter' control={<Radio />} label='Twitter' />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
                <DatePickerField onChange={setSelectedDate} />
            </Grid>
            <Grid item xs={3}>
              <TimePickerField onChange={setSelectedTime} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {data.imageUploadFeatureEnabled && (
        <Card style={{ marginTop: '20px' }}>
          <CardHeader title={t('images')} titleTypographyProps={{ variant: 'h6' }} />
          <CardContent>
            <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ImgStyled src={imgSrc} alt='Profile Pic' />
                <Box>
                  <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                    Upload New Photo
                    <input
                      hidden
                      type='file'
                      onChange={onChange}
                      accept='image/png, image/jpeg'
                      id='account-settings-upload-image'
                      multiple
                    />
                  </ButtonStyled>
                  <ResetButtonStyled
                    color='error'
                    variant='outlined'
                    onClick={() => setImgSrc('/images/avatars/1.png')}
                  >
                    Reset
                  </ResetButtonStyled>
                  <Typography variant='body2' sx={{ marginTop: 5 }}>
                    Allowed PNG or JPEG. Max size of 800K.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </CardContent>
        </Card>
      )}

      <Button type='submit' variant='contained' size='large' style={{ marginTop: '20px' }}>
        {t('create')}
      </Button>
    </form>
  )
}

export default authRoute(Automation)
