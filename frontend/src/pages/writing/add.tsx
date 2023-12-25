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

// import SelectChangeEvent from '@mui/material/Select'

import * as Sentry from '@sentry/nextjs'
import { useTranslation } from 'react-i18next'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import { useUserData } from 'src/@core/hooks/useUserData'
import Divider from '@mui/material/Divider'
import CopyForm from './view/CopyForm'
import SummarizeForm from './view/SummarizeForm'
import EmailForm from './view/EmailForm'
import AdditionalFeatures from './view/AdditionalFeatures'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import { useStore } from 'src/store'
import { dropStore } from 'src/dropStore'
import Loader from 'src/@core/components/ui/Loader'
import UploadViewer from 'src/@core/components/UploadViewer'
import Uppy from '@uppy/core'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'

const Writing = () => {
  // ** States
  const router = useRouter()
  const { t } = useTranslation()
  const { product } = useStore()
  const { dropshipping } = dropStore()
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

  const [selectedChecbox, setSelectedChecbox] = useState([])

  const handleCheckboxChange = event => {
    const { value, checked } = event.target
    if (checked) {
      // Add the value to the selectedLocation array
      setSelectedChecbox([...selectedChecbox, value])
    } else {
      // Remove the value from the selectedLocation array
      setSelectedChecbox(selectedChecbox.filter(item => item !== value))
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
    router.push('/writing/view/');
  };

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
    if (product && userId && data) {
      const categoriesString = product.categories.map(category => category.categoryName).join(', ')

      if (nameRef.current) {
        nameRef.current.value = product?.title || ''
      }

      if (descriptionRef.current) {
        descriptionRef.current.value = product.description || product.title || ''
      }

      if (targetAudienceRef.current) {
        targetAudienceRef.current.value = categoriesString || ''
      }

      if (keywordInput.current) {
        keywordInput.current.value = categoriesString || ''
      }
      setSelectedLanguage(data?.defaultCopyLanguage)
      setSelectedLocation('formal')
      setSelectedCopyType('SEO')
      setSelectedTextLength(data?.defaultCopyLength)
    }
  }, [product, userId, data])

  useEffect(() => {
    if (dropshipping && data) {
      if (nameRef.current) {
        nameRef.current.value = dropshipping?.title || ''
      }

      if (descriptionRef.current) {
        descriptionRef.current.value = dropshipping.description || ''
      }

      if (targetAudienceRef.current) {
        targetAudienceRef.current.value = dropshipping?.targeting || ''
      }

      if (keywordInput.current) {
        keywordInput.current.value = dropshipping?.targeting || ''
      }
      setSelectedLanguage(data?.defaultCopyLanguage)
      setSelectedLocation('formal')
      setSelectedCopyType('SEO')
      setSelectedTextLength(data?.defaultCopyLength)
    }
  }, [dropshipping, data])

  const nameRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLInputElement>(null)
  const targetAudienceRef = useRef<HTMLInputElement>(null)
  const brandName = useRef<HTMLInputElement>(null)
  const brandDescription = useRef<HTMLInputElement>(null)
  const customCommandRef = useRef<HTMLInputElement>(null)
  const keywordInput = useRef<HTMLInputElement>(null)

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

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = nameRef.current?.value
    const description = descriptionRef.current?.value
    const targetAudience = targetAudienceRef.current?.value
    const brandNames = brandName.current?.value
    const brandDescriptions = brandDescription.current?.value
    const customCommands = customCommandRef.current?.value
    const keyWords = keywordInput.current?.value

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
      title: name,
      keyWords,
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

  if (!data?.copyWritingEnabled) {
    router.push('/')
  }

  return (
    <form onSubmit={submitForm}>
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
                      <AcUnitIcon /> {/* Replace 'IconName' with the desired icon from '@material-ui/icons' */}
                    </IconButton>
                  </FormLabel>
                  <RadioGroup row value={selectedValue} onChange={handleChangeForm}>
                    <FormControlLabel
                      value='create'
                      control={<Radio checked={selectedValue === 'create'} />}
                      label='Create Copy'
                    />
                    {/* <FormControlLabel
                  value='edit'
                  control={<Radio checked={selectedValue === 'edit'} />}
                  label='Alter Copy'
                /> */}
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
                <CopyForm
                  handleLocationChange={handleLocationChange}
                  selectedLocation={selectedLocation}
                  selectedTextLength={selectedTextLength}
                  handleTextLength={handleTextLength}
                  nameRef={nameRef}
                  targetAudienceRef={targetAudienceRef}
                  descriptionRef={descriptionRef}
                  keywordInput={keywordInput}
                />
              )}

              {/* {selectedValue === 'edit' && (
            <AlterCopyForm
              handleLocationChange={handleLocationChange}
              selectedLocation={selectedLocation}
              selectedTextLength={selectedTextLength}
              handleTextLength={handleTextLength}
              nameRef={nameRef}
              targetAudienceRef={targetAudienceRef}
              descriptionRef={descriptionRef}
            />
          )} */}

              {selectedValue === 'summarize' && (
                <SummarizeForm
                  handleLocationChange={handleLocationChange}
                  selectedLocation={selectedLocation}
                  selectedTextLength={selectedTextLength}
                  handleTextLength={handleTextLength}
                  nameRef={nameRef}
                  targetAudienceRef={targetAudienceRef}
                  descriptionRef={descriptionRef}
                  selectedChecbox={selectedChecbox}
                  handleCheckboxChange={handleCheckboxChange}
                />
              )}

              {selectedValue === 'email' && (
                <EmailForm
                  handleLocationChange={handleLocationChange}
                  selectedLocation={selectedLocation}
                  selectedTextLength={selectedTextLength}
                  handleTextLength={handleTextLength}
                  nameRef={nameRef}
                  targetAudienceRef={targetAudienceRef}
                  descriptionRef={descriptionRef}
                />
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
              {/* Make sure this is xs={12} if you want it to be in its own row */}
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Divider sx={{ width: '98%', my: 2 }} /> {/* Adjust the width as needed */}
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
