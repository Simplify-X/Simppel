// @ts-nocheck
// ** React Imports

import { useState, useEffect, useRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import authRoute from 'src/@core/utils/auth-route'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/router'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'

// import SelectChangeEvent from '@mui/material/Select'

import * as Sentry from '@sentry/nextjs'
import { useTranslation } from 'react-i18next'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import { useUserData } from 'src/@core/hooks/useUserData'
import Divider from '@mui/material/Divider'
import AdditionalFeatures from './view/AdditionalFeatures'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import Loader from 'src/@core/components/ui/Loader'
import UploadViewer from 'src/@core/components/UploadViewer'
import Uppy from '@uppy/core'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const Writing = () => {
  // ** States
  const router = useRouter()
  const { t } = useTranslation()
  const { userId } = useUserData()
  const [data, setData] = useState([])
  const [selectedMood, setSelectedMood] = useState('')
  const [selectedCopyType, setSelectedCopyType] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedTextLength, setSelectedTextLength] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [selectedValue, setSelectedValue] = useState('create')
  const { error, get, post } = useCustomApiHook()
  const [teamGroupMember, setTeamGroupMember] = useState([])
  const [teamData, setTeamData] = useState([])
  const [loading, setLoading] = useState(true)
  const [uppy, setUppy] = useState(null)
  const theme = useTheme()

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(t('product_name_required')),
    description: Yup.string().required(t('description_required')),
    targetAudience: Yup.string().required(t('target_audience_required')),
    keywords: Yup.string().required(t('target_audience_required')),
  });

  const { 
    register, 
    handleSubmit, 
    errors, 
  } = useForm({
    mode: 'onBlur',
    criteriaMode: "all",
    shouldUnregister: true,
    resolver: yupResolver(validationSchema)
  });

  function handleLanguageChange(event) {
    setSelectedLanguage(event.target.value)
  }

  const handleChangeForm = event => {
    setSelectedValue(event.target.value)
  }

  // const [personName, setPersonName] = useState<string[]>([])

  const handleLocationChange = event => {
    setSelectedLocation(event.target.value)
  }

  const handleMood = event => {
    setSelectedMood(event.target.value)
  }

  const handleCopyType = event => {
    setSelectedCopyType(event.target.value)
  }

  const handleTextLength = event => {
    setSelectedTextLength(event.target.value)
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
    const fetchSingleUser = async () => {
      const res = await get(`/users/getSingleUser/${userId}`)
      res?.data && setData(res.data)
    }

    userId && fetchSingleUser()
  }, [userId])

  useEffect(() => {
    error && Sentry.captureException(error)
  }, [error])

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

  const handleDiscard = () => {
    router.push('/writing/view/')
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


  const brandName = useRef<HTMLInputElement>(null)
  const brandDescription = useRef<HTMLInputElement>(null)
  const customCommandRef = useRef<HTMLInputElement>(null)

  const uploadImagesToCloudinary = async (files, contentId) => {
    for (const file of files) {
      const formData = new FormData()
      formData.append('upload_preset', 'v31206aa')
      formData.append('file', file.data)
      formData.append('folder', contentId)

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

  async function submitForm(formData) {

    console.log(formData)

    const {
      title,
      description,
      targetAudience,
      keywords,
    } = formData;


    const brandNames = brandName.current?.value
    const brandDescriptions = brandDescription.current?.value
    const customCommands = customCommandRef.current?.value

    const formSupplyType = selectedValue
    let formattedSupplyType

    switch (formSupplyType) {
      case 'create':
        formattedSupplyType = 'Copy Form'
        break
      case 'summarize':
        formattedSupplyType = 'Summarize Form'
        break
      case 'email':
        formattedSupplyType = 'Email Form'
        break
      default:
        formattedSupplyType = ''
        break
    }

    const data = {
      title,
      keyWords: keywords,
      description,
      formType: formattedSupplyType,
      targetAudience: targetAudience,
      toneOfCopy: selectedLocation,
      copyLength: selectedTextLength,
      languageText: selectedLanguage,
      brandName: brandNames,
      brandDescription: brandDescriptions,
      customCommands,
      copyWritingType: selectedCopyType !== '' ? selectedCopyType : null,
      copyWritingContext: null
    }

    const contentResponse = await post(`/copyWriting/${userId}`, data)
    console.log(contentResponse)
    if (contentResponse.data.id) {
      if (uppy.getFiles().length > 0) {
        const contentId = contentResponse.data.id
        await uploadImagesToCloudinary(uppy.getFiles(), contentId)
      }

      toast.success('Copy Added', { autoClose: 2000 })
      nameRef.current.value = ''
      descriptionRef.current.value = ''
      router.push('/content/view')
    } else {
      toast.error('Error', { autoClose: 3000 })

      // @ts-ignore
      nameRef.current.value = ''
      descriptionRef.current.value = ''
    }
  }

  if (loading) {
    return <Loader />
  }

  // if (!data?.copyWritingEnabled) {
  //   router.push('/')
  // }

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      {teamData?.copyWritingAccess === 'VIEW' || !data?.copyWritingEnabled ? (
        <Card style={{ padding: 15, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CardContent>
            <Typography variant='h6' component='div' align='center'>
              You do not have the rights to create a copy.
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
            {t('create_copy')}
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
              <Box>
                <FormControl component='fieldset'>
                  <FormLabel component='legend' style={{ marginTop: 20 }}>
                    <span style={{ marginRight: 8 }}>Form Type</span>
                    <IconButton>
                      <AcUnitIcon />
                    </IconButton>
                  </FormLabel>
                  <RadioGroup row value={selectedValue} onChange={handleChangeForm}>
                    <FormControlLabel
                      value='create'
                      control={<Radio checked={selectedValue === 'create'} />}
                      label='Create Copy'
                    />
                    <FormControlLabel
                      value='summarize'
                      control={<Radio checked={selectedValue === 'summarize'} />}
                      label='Summarize'
                    />
                    <FormControlLabel
                      value='email'
                      control={<Radio checked={selectedValue === 'email'} />}
                      label='Email Form'
                    />
                  </RadioGroup>
                </FormControl>
              </Box>

              <Divider style={{ marginBottom: 20 }} />

              {selectedValue === 'create' && (
                <>
                  <Typography style={{ marginBottom: 20, color: '#C6A7FE' }} variant='h6'>
                    Copy writing data
                  </Typography>
                  <Grid container spacing={10}>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label={t('title_of_copy')}
                        name="title"
                        inputRef={register}
                        error={!!errors.title}
                        helperText={errors.title?.message}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        type='text'
                        label={t('target_audience')}
                        placeholder='Gym Rats, Soccer Moms, etc.'
                        name="targetAudience"
                        inputRef={register}
                        error={!!errors.targetAudience}
                        helperText={errors.targetAudience?.message}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        type='text'
                        label={t('keywords_title')}
                        placeholder='Mouse, Elephant, Space.'
                        name="keywords"
                        inputRef={register}
                        error={!!errors.keywords}
                        helperText={errors.keywords?.message}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type='text'
                        label={t('description_copy')}
                        placeholder='A flying bottle'
                        name="description"
                        inputRef={register}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        required
                        multiline
                        rows={8}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Divider />
                    </Grid>

                    <Grid item xs={4}>
                      <Typography style={{ marginBottom: 20, color: '#C6A7FE' }} variant='h6'>
                        Copy Settings
                      </Typography>
                      <Grid item xs={12}>
                        <FormControl component='fieldset'>
                          <FormLabel id='demo-row-radio-buttons-group-label' style={{ color: '#C6A7FE' }}>
                            {t('tone')}
                          </FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby='demo-row-radio-buttons-group-label'
                            name='row-radio-buttons-group'
                            value={selectedLocation}
                            onChange={handleLocationChange}
                          >
                            <FormControlLabel
                              value='formal'
                              control={<Radio />}
                              label={<span style={{ width: '70px', display: 'inline-block' }}>Formal</span>}
                            />
                            <FormControlLabel
                              value='informal'
                              control={<Radio />}
                              label={<span style={{ width: '70px', display: 'inline-block' }}>Informal</span>}
                            />
                            <FormControlLabel
                              value='humorous'
                              control={<Radio />}
                              label={<span style={{ width: '70px', display: 'inline-block' }}>Humorous</span>}
                            />
                            <FormControlLabel
                              value='serious'
                              control={<Radio />}
                              label={<span style={{ width: '70px', display: 'inline-block' }}>Serious</span>}
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} style={{ marginTop: '17px' }}>
                        <FormControl component='fieldset'>
                          <FormLabel id='demo-row-radio-buttons-group-label' style={{ color: '#C6A7FE' }}>
                            {t('copy_length')}
                          </FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby='demo-row-radio-buttons-group-label'
                            name='row-radio-buttons-group'
                            value={selectedTextLength}
                            onChange={handleTextLength}
                          >
                            <FormControlLabel
                              value='short'
                              control={<Radio />}
                              label={<span style={{ width: '70px', display: 'inline-block' }}>Short</span>}
                            />
                            <FormControlLabel
                              value='medium'
                              control={<Radio />}
                              label={<span style={{ width: '70px', display: 'inline-block' }}>Medium</span>}
                            />
                            <FormControlLabel
                              value='long'
                              control={<Radio />}
                              label={<span style={{ width: '70px', display: 'inline-block' }}>Long</span>}
                            />
                            <FormControlLabel
                              value='long'
                              control={<Radio />}
                              label={<span style={{ width: '70px', display: 'inline-block' }}>Random</span>}
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )}
            </CardContent>

            <AdditionalFeatures
              selectedLanguage={selectedLanguage}
              handleLanguageChange={handleLanguageChange}
              brandName={brandName}
              brandDescription={brandDescription}
              customCommandRef={customCommandRef}
              selectedMood={selectedMood}
              handleMood={handleMood}
              data={data}
              selectedValue={selectedValue}
              selectedCopyType={selectedCopyType}
              handleCopyType={handleCopyType}
            />
            <Grid item xs={12}>
              {' '}
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Divider sx={{ width: '98%', my: 2 }} />
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

              <Button
                type='submit'
                variant='contained'
                size='large'
                sx={{ textTransform: 'none' }}
                startIcon={<AddIcon />}
              >
                {t('create')}
              </Button>
            </Box>
          </Card>
        </>
      )}
    </form>
  )
}

export default authRoute(Writing)
