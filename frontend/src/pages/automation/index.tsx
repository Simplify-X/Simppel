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
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// import Cookies from 'js-cookie'
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
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import { useUserData } from 'src/@core/hooks/useUserData'

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
  const router = useRouter()
  const [selectedLocation, setSelectedLocation] = useState('')
  const [data, setData] = useState([])
  const { t } = useTranslation()

  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  
  const { response, loading, error , get, post } = useCustomApiHook();
  const [accountId, userId] = useUserData();

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
    if (userId) fetchSingleUser()
  }, [userId])

  const fetchSingleUser=async()=>{
   const response = await get(`/users/getSingleUser/${userId}`)
   response?.data &&  setData(response.data)
  }


  const nameRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLInputElement>(null)
  const targetAudienceRef = useRef<HTMLInputElement>(null)

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
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
    await post(`/posts/${userId}/${accountId}`, data)
 
  }


  useEffect(() => {
    const status = response?.data.status

    if (response?.data) {
      toast.success('Advertisement Added', { autoClose: 2000 })
      nameRef?.current?.value = ''
      descriptionRef?.current?.value = ''
      router.push('/content/view-content')
    }

    if (status === 'FAILED') {
      toast.error('Error', { autoClose: 3000 })
      
      // @ts-ignore
      nameRef?.current?.value = ''
      descriptionRef?.current?.value = ''
    }

    if (error) {
      Sentry.captureException(error)
      toast.error('An error occurred. Please try again later', { autoClose: 3000 })
    }
  }, [response, error])


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
