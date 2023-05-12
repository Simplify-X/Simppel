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
import LanguageSelector from '../content/LanguageSelector'
import * as Sentry from '@sentry/nextjs'
import { useTranslation } from 'react-i18next'
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

const Writing = () => {
  // ** States
  const router = useRouter()
  const [selectedLocation, setSelectedLocation] = useState('')
  const selectedTypeAd = ''
  const [selectedMood, setSelectedMood] = useState('')
  const [selectedTextLength, setSelectedTextLength] = useState('')
  const [data, setData] = useState([])
  const { t } = useTranslation()

  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')

  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [scrapedData, setScrapedData] = useState({})

  const { response, error, get, post } = useCustomApiHook()
  const { accountId } = useUserData()

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
    const fetchSingleUser = async () => {
      const res = await get(`/users/getSingleUser/${accountId}`)
      res?.data && setData(res.data)
    }

    accountId && fetchSingleUser()
  }, [accountId])

  useEffect(() => {
    error && Sentry.captureException(error)
  }, [error])

  const nameRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLInputElement>(null)
  const targetAudienceRef = useRef<HTMLInputElement>(null)

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
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

    if (response?.data) {
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
        <CardHeader title={t('create_copy_writing')} titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          <ToastContainer position={'top-center'} draggable={false} />
          <Grid container spacing={10}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label={scrapedData.title ? '' : t('title_of_copy')}
                inputRef={nameRef}
                required
                helperText={t('title_helper_text')}
                value={scrapedData.title}
                onChange={event => {
                  setScrapedData({
                    ...scrapedData,
                    title: event.target.value
                  })
                }}
              />
            </Grid>
            <Grid item xs={4}>
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
            <Grid item xs={4}>
              <TextField fullWidth label={t('keywords')} inputRef={nameRef} required helperText={t('enter_keywords')} />
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                type='text'
                label={scrapedData.description ? '' : t('description_copy')}
                placeholder='A flying bottle'
                helperText={t('product_description_helper_text')}
                inputRef={descriptionRef}
                value={scrapedData.description}
                required
                multiline
                rows={8} // Specify the number of rows here
                onChange={event => {
                  setScrapedData({
                    ...scrapedData,
                    description: event.target.value
                  })
                }}
              />
            </Grid>
            <Grid item xs={4}>
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
                      label={<span style={{ width: '100px', display: 'inline-block' }}>Formal</span>}
                    />
                    <FormControlLabel
                      value='informal'
                      control={<Radio />}
                      label={<span style={{ width: '100px', display: 'inline-block' }}>Informal</span>}
                    />
                    <FormControlLabel
                      value='humorous'
                      control={<Radio />}
                      label={<span style={{ width: '100px', display: 'inline-block' }}>Humorous</span>}
                    />
                    <FormControlLabel
                      value='serious'
                      control={<Radio />}
                      label={<span style={{ width: '100px', display: 'inline-block' }}>Serious</span>}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} style={{ marginTop: '17px' }}>
                <FormControl component='fieldset'>
                  <FormLabel id='demo-row-radio-buttons-group-label' style={{ color: '#C6A7FE' }}>
                    {t('advertisement_location')}
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby='demo-row-radio-buttons-group-label'
                    name='row-radio-buttons-group'
                    value={selectedLocation}
                    onChange={handleLocationChange}
                  >
                    <FormControlLabel
                      value='facebook'
                      control={<Radio />}
                      label={<span style={{ width: '100px', display: 'inline-block' }}>Facebook</span>}
                    />
                    <FormControlLabel
                      value='instagram'
                      control={<Radio />}
                      label={<span style={{ width: '100px', display: 'inline-block' }}>Instagram</span>}
                    />
                    <FormControlLabel
                      value='tiktok'
                      control={<Radio />}
                      label={<span style={{ width: '100px', display: 'inline-block' }}>Tiktok</span>}
                    />
                    <FormControlLabel
                      value='other'
                      control={<Radio />}
                      label={<span style={{ width: '100px', display: 'inline-block' }}>Other</span>}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} style={{ marginTop: '17px' }}>
                <FormControl component='fieldset'>
                  <FormLabel id='demo-row-radio-buttons-group-label' style={{ color: '#C6A7FE' }}>
                    {t('advertisement_length')}
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
                      label={<span style={{ width: '100px', display: 'inline-block' }}>Short</span>}
                    />
                    <FormControlLabel
                      value='medium'
                      control={<Radio />}
                      label={<span style={{ width: '100px', display: 'inline-block' }}>Medium</span>}
                    />
                    <FormControlLabel
                      value='long'
                      control={<Radio />}
                      label={<span style={{ width: '100px', display: 'inline-block' }}>Long</span>}
                    />
                    <FormControlLabel
                      value='long'
                      control={<Radio />}
                      label={<span style={{ width: '100px', display: 'inline-block' }}>Random</span>}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card style={{ marginTop: '20px' }}>
        <CardHeader title={t('additional_features')} titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          <Grid container spacing={5}>
            <LanguageSelector selectedLanguage={selectedLanguage} onChange={handleLanguageChange} />
            <Grid item xs={4}>
              <TextField
                fullWidth
                label={t('branding_name')}
                inputRef={nameRef}
                required
                helperText={t('branding_name_helper_text')}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                label={t('branding_description')}
                inputRef={nameRef}
                required
                helperText={t('enter_product_name')}
              />
            </Grid>

            <Grid item xs={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
                  <Typography>{t('advanced_settings')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
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

      <Button type='submit' variant='contained' size='large' style={{ marginTop: '20px' }}>
        {t('create')}
      </Button>
    </form>
  )
}

export default authRoute(Writing)