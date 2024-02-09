// @ts-nocheck
// ** React Imports

import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { ToastContainer, toast } from 'react-toastify'
import Divider from '@mui/material/Divider'
import 'react-toastify/dist/ReactToastify.css'

// import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import { useUserData } from 'src/@core/hooks/useUserData'
import { Helmet } from 'react-helmet'
import Loader from 'src/@core/components/ui/Loader'
import UploadViewer from 'src/@core/components/UploadViewer'
import Uppy from '@uppy/core'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { useForm } from 'react-hook-form'
import FormField from 'src/@core/components/FormField'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

// import FormDatePicker from 'src/@core/components/DatePicker'

export default function DynamicQRGenertation({ loadedData }: { loadedData: any }) {
  const theme = useTheme()
  const router = useRouter()
  const [data, setData] = useState([])
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const { get, post, put } = useCustomApiHook()
  const { userId } = useUserData()
  const [teamGroupMember, setTeamGroupMember] = useState([])
  const [teamData, setTeamData] = useState([])
  const [uppy, setUppy] = useState(null)
  const defaultStatus = loadedData ? loadedData.status : ''

  const status = [
    { value: 'offline', label: t('offline') },
    { value: 'online', label: t('online') }
  ]

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('this_field_is_required')),
    price: Yup.string().required(t('this_field_is_required')),
    clientEmail: Yup.string().required(t('this_field_is_required')),
    clientPhone: Yup.string().required(t('this_field_is_required')),
    clientWebsite: Yup.string().required(t('this_field_is_required')),
    industry: Yup.string().required(t('this_field_is_required')),
    location: Yup.string().required(t('this_field_is_required'))
  })

  const { control, handleSubmit, errors } = useForm({
    mode: 'onBlur',
    criteriaMode: 'all',
    shouldUnregister: true,
    resolver: yupResolver(validationSchema),
    defaultValues: {
      status: defaultStatus
    }
  })

  const handleDiscard = () => {
    router.push('/qr-code/view/')
  }

  useEffect(() => {
    userId && fetchTeamGroupMember()
  }, [userId])

  useEffect(() => {
    teamGroupMember?.teamGroupId && fetchTeamData()
  }, [teamGroupMember?.teamGroupId])

  const fetchTeamGroupMember = async () => {
    const response = await get(`/groups/members/list/${userId}`)
    if (response?.data) {
      setTeamGroupMember(response.data)
    } else {
      setLoading(false)
    }
  }

  const fetchTeamData = async () => {
    const getTeamData = await get(`/groups/list/${teamGroupMember?.teamGroupId}`)
    if (getTeamData?.data) {
      setTeamData(getTeamData.data)
      setLoading(false)
    } else {
      setLoading(false)
    }
  }

  useEffect(() => {
    const uppyInstance = new Uppy({
      autoProceed: false,
      maxNumberOfFiles: 2,
      allowedFileTypes: ['image/*']
    })

    uppyInstance.on('file-added', () => {
      // Just add the file, do not upload yet
    })

    setUppy(uppyInstance)

    return () => uppyInstance.close()
  }, [])

  useEffect(() => {
    userId && fetchSingleUser()
    userId && fetchAdvertisements()
  }, [userId])

  const fetchSingleUser = async () => {
    const response = await get(`/users/getSingleUser/${userId}`)
    if (response?.data) {
      setData(response.data)
      const advertisementLimit = response.data?.advertisementLimit
      advertisementLimit
    }
  }

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await get(`getImages/fetch/${loadedData.id}`)
        const imageData = response?.data

        imageData.resources.forEach(image => {
          uppy.addFile({
            name: image.public_id,
            type: `image/${image.format}`,
            remote: {
              url: image.url,
              companionUrl: ''
            },
            data: {},
            isRemote: true
          })
        })
      } catch (error) {
        console.error('Error fetching images:', error)
      }
    }

    if (loadedData?.id) {
      fetchImages()
    }
  }, [loadedData, uppy])

  const fetchAdvertisements = async () => {
    const response = await get(`/advertisements/${userId}`)
    response?.advertisements && setAdCount(response.advertisements?.length)
  }

  async function submitForm(formData) {
    console.log(formData)

    const {
      name,
      price,
      description,
      clientEmail,
      clientPhone,
      clientWebsite,
      industry,
      location,
      meeting_date,
      starting_date,
      status,
      firstRule,
      secondRule,
      thirdRule,
      fourthRule
    } = formData

    const data = {
      name,
      price,
      description,
      clientEmail,
      clientPhone,
      clientWebsite,
      industry,
      location,
      meeting_date,
      starting_date,
      status,
      firstRule,
      secondRule,
      thirdRule,
      fourthRule
    }

    if (loadedData) {
      await put(`/qr-code/${loadedData?.id}`, data)
      toast.success('QR Code Edited', { autoClose: 2000 })

      if (loadedData.id) {
        await uploadImages(loadedData.id)
      } else {
        toast.error('Error', { autoClose: 3000 })
      }

      router.push('/qr-code/view')
    } else {
      const adResponse = await post(`/qr-code/${userId}`, data)

      if (adResponse.data.id) {
        await uploadImages(adResponse.data.id)
        router.push('/qr-code/view')
      } else {
        toast.error('Error', { autoClose: 3000 })
      }
    }
  }

  const uploadImages = async id => {
    if (id) {
      await uploadImagesToCloudinary(uppy.getFiles(), id)
    }
  }

  const uploadImagesToCloudinary = async (files, adId) => {
    for (const file of files) {
      const formData = new FormData()
      formData.append('upload_preset', 'v31206aa')
      formData.append('file', file.data)
      formData.append('folder', adId)

      try {
        const response = await fetch('https://api.cloudinary.com/v1_1/dovfsnzn8/image/upload', {
          method: 'POST',
          body: formData
        })
        const responseData = await response.json()
        console.log('Uploaded file data:', responseData)
      } catch (error) {
        console.error('Upload error:', error)
      }
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <Helmet>
        <title>Simppel - Create QR Code</title>
      </Helmet>
      {teamData.advertisementAccess === 'VIEW' ? (
        <Card style={{ padding: 15, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CardContent>
            <Typography variant='h6' component='div' align='center'>
              You do not have the rights to create an advertisement.
              <br />
              Please contact your Organization admin to enable it.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <>
          <Typography
            variant='h4'
            id='h1-header'
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              '@media (min-width:1440px)': {
                maxWidth: '1200px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }
            }}
          >
            {loadedData ? t('edit_qr_code') : t('create_qr_code')}
          </Typography>

          <Typography
            variant='subtitle1'
            gutterBottom
            sx={{
              color: theme.palette.text.secondary,
              '@media (min-width:1440px)': {
                maxWidth: '1200px',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginBottom: '18px'
              }
            }}
          >
            Mandatory fields are marked with asterisk (*)
          </Typography>

          <Card
            sx={{
              padding: 2,
              margin: 'auto',
              '@media (min-width:1440px)': {
                maxWidth: '1200px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }
            }}
          >
            <CardHeader title={t('client_data')} titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
              <ToastContainer position={'top-center'} draggable={false} />
              <Grid container spacing={5}>
                <Grid item xs={4}>
                  <FormField
                    as={<TextField />}
                    name='name'
                    control={control}
                    defaultValue={loadedData ? loadedData?.name : ''}
                    label={t('company_name')}
                    margin='normal'
                    errors={errors}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormField
                    as={<TextField />}
                    name='industry'
                    defaultValue={loadedData ? loadedData?.industry : ''}
                    control={control}
                    label={t('industry')}
                    errors={errors}
                    margin='normal'
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormField
                    as={<TextField />}
                    name='location'
                    defaultValue={loadedData ? loadedData?.location : ''}
                    control={control}
                    label={t('location')}
                    margin='normal'
                    errors={errors}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormField
                    as={<TextField />}
                    name='description'
                    defaultValue={loadedData ? loadedData?.description : ''}
                    control={control}
                    label={t('description')}
                    margin='normal'
                    errors={errors}
                    fullWidth
                    multiline
                    rows={4}
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
                  ></Box>
                </Grid>
              </Grid>
            </CardContent>

            <Grid item xs={12}>
              {' '}
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Divider sx={{ width: '94%', my: 2 }} />
              </Box>
            </Grid>

            <CardHeader title={t('qr_data')} titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
              <ToastContainer position={'top-center'} draggable={false} />
              <Grid container spacing={5}>
                <Grid item xs={6}>
                  <FormField
                    as={<TextField />}
                    name='price'
                    defaultValue={loadedData ? loadedData?.price : ''}
                    control={control}
                    label={t('discount')}
                    errors={errors}
                    margin='normal'
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormField
                    as={<TextField />}
                    name='clientEmail'
                    defaultValue={loadedData ? loadedData?.clientEmail : ''}
                    control={control}
                    label={t('client_email')}
                    margin='normal'
                    errors={errors}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormField
                    as={<TextField />}
                    name='clientPhone'
                    defaultValue={loadedData ? loadedData?.clientPhone : ''}
                    control={control}
                    label={t('client_phone')}
                    margin='normal'
                    errors={errors}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormField
                    as={<TextField />}
                    name='clientWebsite'
                    defaultValue={loadedData ? loadedData?.clientWebsite : ''}
                    control={control}
                    label={t('client_website')}
                    margin='normal'
                    errors={errors}
                    fullWidth
                    required
                  />
                </Grid>
                {/* <Grid item xs={6}>
                  <FormDatePicker
                    name='starting_date'
                    control={control}
                    label={t('starting_date')}
                    errors={errors}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormDatePicker
                    name='meeting_date'
                    control={control}
                    label={t('meeting_date')}
                    errors={errors}
                    fullWidth
                    required
                  />
                </Grid> */}

                <Grid item xs={12}>
                  <FormLabel component='legend'>{t('qr_status')}</FormLabel>
                  <FormField as={RadioGroup} margin='normal' name='status' control={control} errors={errors} row>
                    {status.map(option => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio color='primary' />}
                        label={option.label}
                        labelPlacement='end'
                      />
                    ))}
                  </FormField>
                </Grid>

                <Grid item xs={12}>
                  <FormLabel component='legend'>{t('club_rules')}</FormLabel>
                </Grid>
                <Grid item xs={6}>
                  <FormField
                    as={<TextField />}
                    name='firstRule'
                    defaultValue={loadedData ? loadedData?.firstRule : ''}
                    control={control}
                    label={t('first_rule')}
                    margin='normal'
                    errors={errors}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormField
                    as={<TextField />}
                    name='secondRule'
                    defaultValue={loadedData ? loadedData?.secondRule : ''}
                    control={control}
                    label={t('second_rule')}
                    margin='normal'
                    errors={errors}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormField
                    as={<TextField />}
                    name='thirdRule'
                    defaultValue={loadedData ? loadedData?.thirdRule : ''}
                    control={control}
                    label={t('third_rule')}
                    margin='normal'
                    errors={errors}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormField
                    as={<TextField />}
                    name='fourthRule'
                    defaultValue={loadedData ? loadedData?.fourthRule : ''}
                    control={control}
                    label={t('fourth_rule')}
                    margin='normal'
                    errors={errors}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </CardContent>

            <Grid item xs={12}>
              {' '}
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Divider sx={{ width: '94%', my: 2 }} />
              </Box>
            </Grid>

            {data.imageUploadFeatureEnabled && (
              <>
                <CardHeader title={t('upload_logo')} titleTypographyProps={{ variant: 'h6' }} />
                <CardContent>
                  <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <UploadViewer uppy={uppy} />
                    </Box>
                  </Grid>
                </CardContent>
              </>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', gap: '8px' }}>
              <Button
                type='button'
                variant='outlined'
                size='large'
                sx={{ textTransform: 'none' }}
                startIcon={<CloseIcon />}
                onClick={handleDiscard}
              >
                {t('discard')}
              </Button>

              <span>
                <Button
                  type='submit'
                  variant='contained'
                  size='large'
                  sx={{ textTransform: 'none' }}
                  startIcon={<AddIcon />}
                >
                  {loadedData ? t('edit') : t('create')}
                </Button>
              </span>
            </Box>
          </Card>
        </>
      )}
    </form>
  )
}
