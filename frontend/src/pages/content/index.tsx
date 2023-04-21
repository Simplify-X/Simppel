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
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Chip from '@mui/material/Chip'
import OutlinedInput from '@mui/material/OutlinedInput'
import { Theme, useTheme } from '@mui/material/styles'
import { styled } from '@mui/material/styles'
import LanguageSelector from './LanguageSelector'
import * as Sentry from '@sentry/nextjs'
import AdvertisementCategorySelector from './AdvertisementCategorySelector'
import { useTranslation } from 'react-i18next'
import WebScraper from './WebScraper'
import Tooltip from '@mui/material/Tooltip';
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import { useUserData } from 'src/@core/hooks/useUserData'


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

const Content = () => {
  // ** States
  const router = useRouter()
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedTypeAd, setSelectedTypeAd] = useState('')
  const [selectedMood, setSelectedMood] = useState('')
  const [selectedTextLength, setSelectedTextLength] = useState('')
  const [data, setData] = useState([])
  const [adCount, setAdCount] = useState(0)
  const [limit, setLimit] = useState(10);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const { t } = useTranslation()

  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')

  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [scrapedData, setScrapedData] = useState({})
  const {response, error , get, post } = useCustomApiHook();
  const [_, accountId] = useUserData();

  console.log(_);


  const handleScrapedData = data => {
    setScrapedData(data)
  }

  function handleLanguageChange(event) {
    setSelectedLanguage(event.target.value)
  }

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
     accountId && fetchSingleUser()
     accountId && fetchAdvertisements()
  }, [accountId])

  const fetchSingleUser=async()=>{
   const response = await get(`/users/getSingleUser/${accountId}`)
   if(response?.data){
    setData(response.data)
    const advertisementLimit = response.data?.advertisementLimit
    advertisementLimit && setLimit(advertisementLimit)
   }
  }

  const fetchAdvertisements=async()=>{
    const response = await get(`/advertisements/${accountId}`)
    response?.advertisements && setAdCount(response.advertisements?.length);

  }
    

  const nameRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLInputElement>(null)
  const targetAudienceRef = useRef<HTMLInputElement>(null)


  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (adCount >= limit) {
      toast.error('You have reached your limit of advertisements', { autoClose: 3000 })
      setIsButtonDisabled(true);
      
      return;
    }

    const name = nameRef.current?.value
    const description = descriptionRef.current?.value
    const targetAudience = targetAudienceRef.current?.value

    const data = {
      name,
      description,
      targetAudience: targetAudience,
      advertisementLocation: selectedLocation,
      advertisementType: selectedTypeAd,
      advertisementMood: selectedMood,
      advertisementLength: selectedTextLength,
      languageText: selectedLanguage
    }

    await post(`/advertisements/${accountId}`, data)

  }


  useEffect(() => {
    const status = response?.data.status
    const data = response?.data

    if (data) {
      toast.success('Advertisement Added', { autoClose: 2000 })
      nameRef.current.value = ''
      descriptionRef.current.value = ''
      router.push('/content/view-content')
    }

    if (status === 'FAILED') {
      toast.error('Error', { autoClose: 3000 })

      // @ts-ignore
      nameRef.current.value = ''
      descriptionRef.current.value = ''
    }

    if (error) {
      Sentry.captureException(error)
      toast.error('An error occurred. Please try again later', { autoClose: 3000 })
    }
  }, [response, error])
  
  return (
    <form onSubmit={submitForm}>
      <Card>
        <CardHeader title={t('create_advertisement')} titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          <ToastContainer position={'top-center'} draggable={false} />
          <Grid container spacing={5}>
            {data.advertisementImportEnabled && <WebScraper onScrapedData={handleScrapedData} />}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={scrapedData.title ? '' : t('product_name')}
                inputRef={nameRef}
                required
                helperText={t('enter_product_name')}
                value={scrapedData.title}
                onChange={event => {
                  setScrapedData({
                    ...scrapedData,
                    title: event.target.value
                  })
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                type='text'
                label={scrapedData.description ? '' : t('product_description')}
                placeholder='A flying bottle'
                helperText={t('product_description_helper_text')}
                inputRef={descriptionRef}
                value={scrapedData.description}
                required
                onChange={event => {
                  setScrapedData({
                    ...scrapedData,
                    description: event.target.value
                  })
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='text'
                label={t('target_audience')}
                placeholder='Gym Rats, Soccer Moms, etc.'
                helperText={t('target_audience_helper_text')}
                inputRef={targetAudienceRef}
                required
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
      </Card>
      <Card style={{ marginTop: '20px' }}>
        <CardHeader title={t('additional_features')} titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <FormControl>
                <FormLabel id='demo-row-radio-buttons-group-label'>{t('advertisement_location')}</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby='demo-row-radio-buttons-group-label'
                  name='row-radio-buttons-group'
                  value={selectedLocation}
                  onChange={handleLocationChange}
                >
                  <FormControlLabel value='facebook' control={<Radio />} label='Facebook' />
                  <FormControlLabel value='instagram' control={<Radio />} label='Instagram' />
                  <FormControlLabel value='tiktok' control={<Radio />} label='Tiktok' />
                  <FormControlLabel value='other' control={<Radio />} label='other' />
                </RadioGroup>
              </FormControl>
            </Grid>

            <AdvertisementCategorySelector selectedTypeAd={selectedTypeAd} handleTypeAd={handleTypeAd} />

            <LanguageSelector selectedLanguage={selectedLanguage} onChange={handleLanguageChange} />

            <Grid item xs={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
                  <Typography>{t('advanced_settings')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
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
                    <FormControl sx={{ minWidth: 500 }}>
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
                </AccordionDetails>
              </Accordion>
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

  <Tooltip title={isButtonDisabled ? "You have reached your limit of advertisements" : ""} arrow>
        <span>
          <Button 
            type='submit' 
            variant='contained' 
            size='large' 
            style={{ marginTop: '20px' }}
            disabled={isButtonDisabled}
          >
            {t('create')}
          </Button>
        </span>
      </Tooltip>
    </form>
  )
}

export default authRoute(Content)
