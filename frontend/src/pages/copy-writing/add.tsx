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
import authRoute from 'src/@core/utils/auth-route'
import { ToastContainer, toast } from 'react-toastify'
import Divider from '@mui/material/Divider'
import 'react-toastify/dist/ReactToastify.css'

// import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Chip from '@mui/material/Chip'
import OutlinedInput from '@mui/material/OutlinedInput'
import { Theme, useTheme } from '@mui/material/styles'
import LanguageSelector from 'src/@core/components/LanguageSelector'
import { useTranslation } from 'react-i18next'
import Tooltip from '@mui/material/Tooltip'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import { useUserData } from 'src/@core/hooks/useUserData'
import { Helmet } from 'react-helmet'
import Loader from 'src/@core/components/ui/Loader'
import { useStore } from 'src/store'
import { dropStore } from 'src/dropStore'
import UploadViewer from 'src/@core/components/UploadViewer'
import Uppy from '@uppy/core'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import FormField from 'src/@core/components/FormField'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

const names = ['Physical Product', 'Digital Product']

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight: personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
  }
}

const CopyWriting = () => {
  // ** States
  const router = useRouter()
  const [selectedTypeAd, setSelectedTypeAd] = useState('')
  const [data, setData] = useState([])
  const [adCount, setAdCount] = useState(0)
  const [limit, setLimit] = useState(10)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const { product } = useStore()
  const { dropshipping } = dropStore()
  const [scrapedData, setScrapedData] = useState({})
  const { get, post } = useCustomApiHook()
  const { userId } = useUserData()
  const [teamGroupMember, setTeamGroupMember] = useState([])
  const [teamData, setTeamData] = useState([])

  const [selectedLanguage, setSelectedLanguage] = useState(data?.defaultAdvertisementLanguage || '')
  const [selectedLocation, setSelectedLocation] = useState(data?.defaultAdvertisementLocation || '')
  const [selectedMood, setSelectedMood] = useState(data?.defaultAdvertisementMood || '')
  const [selectedTextLength, setSelectedTextLength] = useState(data?.defaultAdvertisementLength || '')
  const [uppy, setUppy] = useState(null)

  const validationSchema = Yup.object().shape({
    contentName: Yup.string().required(t('this_field_is_required')),
    description: Yup.string().required(t('this_field_is_required')),
    targetAudience: Yup.string().required(t('this_field_is_required')),
    otherContentType: Yup.string().required(t('this_field_is_required')),
  })

  const { watch, handleSubmit, errors, setValue, control } = useForm({
    mode: 'onBlur',
    criteriaMode: 'all',
    shouldUnregister: true,
    resolver: yupResolver(validationSchema)
  })

  const selectedTypeOfContent = watch('typeOfContent')

  const radioOptions = [
    { value: 'facebook', label: t('Facebook') },
    { value: 'instagram', label: t('Instagram') },
    { value: 'tiktok', label: t('Tiktok') },
    { value: 'other', label: t('other') }
  ]

  const typeOfContent = [
    { value: 'blog', label: t('blog') },
    { value: 'productDescription', label: t('product_description') },
    { value: 'advertisement', label: t('advertisement') },
    { value: 'socialMedia', label: t('social_media') },
    { value: 'other', label: t('other') }
  ]

  const handleScrapedData = data => {
    setScrapedData(data)
  }

  const handleDiscard = () => {
    router.push('/writing/view/')
  }

  function handleLanguageChange(event) {
    setSelectedLanguage(event.target.value)
  }

  const theme = useTheme()
  const [personName, setPersonName] = useState<string[]>([])

  const handleLocationChange = event => {
    setSelectedLocation(event.target.value)
  }

  const handleTypeAd = event => {
    setSelectedTypeAd(event.target.value)
  }

  const handleMood = event => {
    setSelectedMood(event.target.value)
  }

  const handleTextLength = event => {
    setSelectedTextLength(event.target.value)
  }

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value }
    } = event
    setPersonName(typeof value === 'string' ? value.split(',') : value)
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
    userId && fetchAdvertisements()
  }, [userId])

  const fetchSingleUser = async () => {
    const response = await get(`/users/getSingleUser/${userId}`)
    if (response?.data) {
      setData(response.data)
      const advertisementLimit = response.data?.advertisementLimit
      advertisementLimit && setLimit(advertisementLimit)
    }
  }

  const fetchAdvertisements = async () => {
    const response = await get(`/advertisements/${userId}`)
    response?.advertisements && setAdCount(response.advertisements?.length)
  }

  useEffect(() => {
    if (!product && !dropshipping) {
      setScrapedData({
        title: '',
        description: '',
        targetAudience: ''
      })
      setSelectedLanguage(data?.defaultAdvertisementLanguage)
      setSelectedLocation(data?.defaultAdvertisementLocation)
      setSelectedTypeAd('')
      setSelectedMood(data?.defaultAdvertisementMood)
      setSelectedTextLength(data?.defaultAdvertisementLength)
    }
  }, [product, dropshipping, data])

  useEffect(() => {
    if (product && userId && data) {
      const categoriesString = product.categories.map(category => category.categoryName).join(', ')
      setScrapedData({
        title: product.title,
        description: product.description || product.title,
        targetAudience: categoriesString
      })
      setSelectedLanguage(data?.defaultAdvertisementLanguage)
      setSelectedLocation(data?.defaultAdvertisementLocation)
      setSelectedTypeAd(product.typeAd)
      setSelectedMood(data?.defaultAdvertisementMood)
      setSelectedTextLength(data?.defaultAdvertisementLength)
    }
  }, [product, userId, data])

  useEffect(() => {
    if (dropshipping && userId && data) {
      setScrapedData({
        title: dropshipping.title,
        description: dropshipping.description,
        targetAudience: dropshipping.targeting
      })
      setSelectedLanguage(data?.defaultAdvertisementLanguage)
      setSelectedLocation(data?.defaultAdvertisementLocation)
      setSelectedMood(data?.defaultAdvertisementMood)
      setSelectedTextLength(data?.defaultAdvertisementLength)
    }
  }, [dropshipping, userId, data])

  useEffect(() => {
    if (scrapedData) {
      setValue('title', scrapedData.title)
      setValue('description', scrapedData.description)
      setValue('targetAudience', scrapedData.targetAudience)
    }
  }, [scrapedData, setValue])

  async function submitForm(formData) {
    console.log(formData)

    const { title, description, targetAudience, brandName, brandDescription } = formData

    console.log(selectedLocation)

    if (adCount >= limit) {
      toast.error('You have reached your limit of advertisements', { autoClose: 3000 })
      setIsButtonDisabled(true)

      return
    }

    const data = {
      name: title,
      description,
      targetAudience: targetAudience,
      advertisementLocation: selectedLocation,
      advertisementType: selectedTypeAd,
      advertisementMood: selectedMood,
      advertisementLength: selectedTextLength,
      languageText: selectedLanguage,
      brandName,
      brandDescription
    }

    const adResponse = await post(`/advertisements/${userId}`, data)
    console.log(adResponse)
    if (adResponse.data.id) {
      if (uppy.getFiles().length > 0) {
        const adId = adResponse.data.id
        await uploadImagesToCloudinary(uppy.getFiles(), adId)
      }

      toast.success('Advertisement Added', { autoClose: 2000 })

      router.push('/content/view')
    } else {
      toast.error('Error', { autoClose: 3000 })
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
        <title>Simppel - Create Copy writing content</title>
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
            {t('create_copy_writing')}
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
            <CardHeader title={t('copy_data')} titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
              <ToastContainer position={'top-center'} draggable={false} />
              <Grid container spacing={5}>
                <Grid item xs={4}>
                  <FormField
                    as={TextField}
                    name='contentName'
                    control={control}
                    errors={errors}
                    variant='outlined'
                    label={t('content_name')}
                    margin='normal'
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormField
                    as={TextField}
                    name='targetAudience'
                    control={control}
                    errors={errors}
                    variant='outlined'
                    label={t('target_audience')}
                    margin='normal'
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormField
                    as={TextField}
                    name='keywords'
                    control={control}
                    errors={errors}
                    variant='outlined'
                    label={t('keyword')}
                    margin='normal'
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormField
                    as={TextField}
                    name='description'
                    control={control}
                    errors={errors}
                    variant='outlined'
                    label={t('description')}
                    margin='normal'
                    required
                    fullWidth
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormLabel component='legend'>{t('type_of_content')}</FormLabel>
                  <FormField as={RadioGroup} name='typeOfContent' control={control} errors={errors} row>
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
                {selectedTypeOfContent === 'other' && (
                    <FormField
                      as={TextField}
                      name='otherContentType'
                      control={control}
                      errors={errors}
                      variant='outlined'
                      label={t('other')}
                      margin='normal'
                      fullWidth
                    />
                  )}
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

            <CardHeader title={t('brand_section')} titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <FormField
                    as={TextField}
                    name='brandName'
                    control={control}
                    errors={errors}
                    variant='outlined'
                    label={t('branding_name')}
                    margin='normal'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} style={{ marginTop: '10px' }}>
                  <FormField
                    as={TextField}
                    name='brandDescription'
                    control={control}
                    errors={errors}
                    variant='outlined'
                    label={t('branding_description')}
                    margin='normal'
                    fullWidth
                    multiline
                    rows={4}
                  />
                </Grid>
              </Grid>
            </CardContent>

            <CardHeader title={t('additional_features')} titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <FormControl component='fieldset'>
                    <FormLabel component='legend'>{t('advertisement_location')}</FormLabel>
                    <FormField as={RadioGroup} name='advertisementLocation' control={control} errors={errors} row>
                      {radioOptions.map(option => (
                        <FormControlLabel
                          key={option.value}
                          value={option.value}
                          control={<Radio color='primary' />}
                          label={option.label}
                          labelPlacement='end'
                        />
                      ))}
                    </FormField>
                  </FormControl>
                </Grid>

                <LanguageSelector selectedLanguage={selectedLanguage} onChange={handleLanguageChange} />
              </Grid>
            </CardContent>

            <CardHeader title={t('advanced_settings')} titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <FormControl>
                    <FormLabel id='demo-row-radio-buttons-group-label'>{t('advertisement_length')}</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby='demo-row-radio-buttons-group-label'
                      name='row-radio-buttons-group'
                      value={selectedTextLength}
                      onChange={handleTextLength}
                    >
                      <FormControlLabel value='short' control={<Radio />} label='Short Text' />
                      <FormControlLabel value='medium' control={<Radio />} label='Medium Text' />
                      <FormControlLabel value='long' control={<Radio />} label='Long Text' />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl>
                    <FormLabel id='demo-row-radio-buttons-group-label'>Mood</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby='demo-row-radio-buttons-group-label'
                      name='row-radio-buttons-group'
                      value={selectedMood}
                      onChange={handleMood}
                    >
                      <FormControlLabel value='sell' control={<Radio />} label='Sell' />
                      <FormControlLabel value='promote' control={<Radio />} label='Promote' />
                      <FormControlLabel value='engage' control={<Radio />} label='Engage' />
                      <FormControlLabel value='traffic' control={<Radio />} label='Traffic' />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12} style={{ marginTop: '20px' }}>
                  <FormControl sx={{ minWidth: 370 }}>
                    <InputLabel id='demo-multiple-chip-label'>{t('product_type')}</InputLabel>
                    <Select
                      labelId='demo-multiple-chip-label'
                      id='demo-multiple-chip'
                      multiple
                      value={personName}
                      onChange={handleChange}
                      input={<OutlinedInput id='select-multiple-chip' label='Chip' />}
                      renderValue={selected => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map(value => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {names.map(name => (
                        <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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

              <Tooltip title={isButtonDisabled ? 'You have reached your limit of advertisements' : ''} arrow>
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

export default authRoute(CopyWriting)
