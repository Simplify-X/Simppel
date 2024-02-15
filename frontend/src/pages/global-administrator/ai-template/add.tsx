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
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import Tooltip from '@mui/material/Tooltip'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import { useUserData } from 'src/@core/hooks/useUserData'
import { Helmet } from 'react-helmet'
import Loader from 'src/@core/components/ui/Loader'
import UploadViewer from 'src/@core/components/UploadViewer'
import Uppy from '@uppy/core'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import FormField from 'src/@core/components/FormField'


export default function Content({ loadedData }: { loadedData: any }) {
  // ** States
  const router = useRouter()
  const [data, setData] = useState([])
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const { get, post, put } = useCustomApiHook()
  const { userId } = useUserData()
  const [teamGroupMember, setTeamGroupMember] = useState([])
  const [teamData, setTeamData] = useState([])
  const [uppy, setUppy] = useState(null)

  const validationSchema = Yup.object().shape({
    templateName: Yup.string().required(t('product_name_required')),
    templateDescription: Yup.string().required(t('description_required')),
    templateType: Yup.string().required(t('this_field_is_required')),
  })


  const defaultStatus = loadedData ? loadedData?.isTemplateActive : "";

  const { register, handleSubmit, errors, control } = useForm({
    mode: 'onBlur',
    criteriaMode: 'all',
    shouldUnregister: true,
    resolver: yupResolver(validationSchema),
    defaultValues: {
      isTemplateActive: defaultStatus
    }
  })


  const typeOfContent = [
    { value: true, label: t('yes') },
    { value: false, label: t('no') },
  ]


  const handleDiscard = () => {
    router.push('/writing/view/')
  }


  const theme = useTheme()


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
      restrictions: {
        maxNumberOfFiles: 10,
        allowedFileTypes: ['image/*', '.jpg', '.jpeg', '.png', '.gif']
      }
    })

    uppyInstance.on('file-added', () => {
      // Just add the file, do not upload yet
    })

    setUppy(uppyInstance)

    return () => uppyInstance.close()
  }, [])

  useEffect(() => {
    userId && fetchSingleUser()
  }, [userId])

  const fetchSingleUser = async () => {
    const response = await get(`/users/getSingleUser/${userId}`)
    if (response?.data) {
      setData(response.data)
    }
  }


  async function submitForm(formData) {
    console.log(formData)

    const { templateName, templateDescription, isTemplateActive, templateType } = formData


    const data = {
        templateName,
        templateDescription,
        isTemplateActive: isTemplateActive,
        templateType,
    }

    if (loadedData) {
      await put(`/ai-template/${loadedData?.id}`, data)
      toast.success('AI Template Edited', { autoClose: 2000 })
      router.push('/global-administrator/ai-template/view')
    } else {

    const adResponse = await post(`/ai-template`, data)
    console.log(adResponse)
    if(adResponse.data.status === "OK") {
        toast.success('Advertisement Added', { autoClose: 2000 })

        router.push('/global-administrator/ai-template/view')
    }
    if (adResponse.data.id) {
      if (uppy.getFiles().length > 0) {
        const adId = adResponse.data.id
        await uploadImagesToCloudinary(uppy.getFiles(), adId)
      }


    } else {
      toast.error('Error', { autoClose: 3000 })
    }
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
        <title>Simppel - Create AI Template</title>
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
            {loadedData ?  "Edit AI template ": "Create AI template"}
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
            <CardContent>
              <ToastContainer position={'top-center'} draggable={false} />
              <Grid container spacing={5}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label={t('product_name')}
                    name='templateName'
                    inputRef={register}
                    error={!!errors.templateName}
                    helperText={errors.templateName?.message}
                    defaultValue={loadedData ? loadedData?.templateName : ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name='targetAudience'
                    inputRef={register}
                    error={!!errors.targetAudience}
                    helperText={errors.targetAudience?.message}
                    label={t('target_audience')}
                    placeholder='Gym Rats, Soccer Moms, etc.'
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    name='templateDescription'
                    label={t('description')}
                    inputRef={register}
                    error={!!errors.templateDescription}
                    helperText={errors.templateDescription?.message}
                    placeholder='A flying bottle'
                    defaultValue={loadedData ? loadedData?.templateDescription : ""}
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


            <CardHeader title="Is Template Active" titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
              <Grid container spacing={5}>
              <Grid item xs={12}>
                  <FormLabel component='legend'>{t('type_of_content')}</FormLabel>
                  <FormField as={RadioGroup} name='isTemplateActive' control={control} errors={errors} row>
                    {typeOfContent.map(option => (
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

                <Grid item xs={4}>
                <TextField
                    fullWidth
                    label={t('tempalte_type')}
                    name='templateType'
                    inputRef={register}
                    error={!!errors.templateType}
                    helperText={errors.templateType?.message}
                    defaultValue={loadedData ? loadedData?.templateType : ""}
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
                <CardHeader title={t('images')} titleTypographyProps={{ variant: 'h6' }} />
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

              <Tooltip arrow>
                <span>
                  <Button
                    type='submit'
                    variant='contained'
                    size='large'
                    sx={{ textTransform: 'none' }}
                    startIcon={<AddIcon />}
                  >
                    {t('create')}
                  </Button>
                </span>
              </Tooltip>
            </Box>
          </Card>
        </>
      )}
    </form>
  )
}
