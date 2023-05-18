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

// import SelectChangeEvent from '@mui/material/Select'

import * as Sentry from '@sentry/nextjs'
import { useTranslation } from 'react-i18next'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import { useUserData } from 'src/@core/hooks/useUserData'
import Divider from '@mui/material/Divider'
import CopyForm from './view/CopyForm'
import AlterCopyForm from './view/AlterCopyForm'
import SummarizeForm from './view/SummarizeForm'
import EmailForm from './view/EmailForm'
import AdditionalFeatures from './view/AdditionalFeatures'
import AcUnitIcon from '@mui/icons-material/AcUnit';

const Writing = () => {
  // ** States
  const router = useRouter()
  const selectedTypeAd = ''
  const { t } = useTranslation()

  const { accountId } = useUserData()
  const [data, setData] = useState([])
  const [selectedMood, setSelectedMood] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedTextLength, setSelectedTextLength] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [selectedValue, setSelectedValue] = useState('create')
  const { response, error, get, post } = useCustomApiHook()

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

  const handleTextLength = event => {
    setSelectedTextLength(event.target.value)
  }

  // const handleChange = (event: SelectChangeEvent<typeof personName>) => {
  //   const {
  //     target: { value }
  //   } = event
  //   setPersonName(typeof value === 'string' ? value.split(',') : value)
  // }

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
      <Card style={{ padding: 15 }}>
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
                <FormControlLabel
                  value='edit'
                  control={<Radio checked={selectedValue === 'edit'} />}
                  label='Alter Copy'
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
            <CopyForm
              handleLocationChange={handleLocationChange}
              selectedLocation={selectedLocation}
              selectedTextLength={selectedTextLength}
              handleTextLength={handleTextLength}
              nameRef={nameRef}
              targetAudienceRef={targetAudienceRef}
              descriptionRef={descriptionRef}
            />
          )}

          {selectedValue === 'edit' && (
            <AlterCopyForm
              handleLocationChange={handleLocationChange}
              selectedLocation={selectedLocation}
              selectedTextLength={selectedTextLength}
              handleTextLength={handleTextLength}
              nameRef={nameRef}
              targetAudienceRef={targetAudienceRef}
              descriptionRef={descriptionRef}
            />
          )}

          {selectedValue === 'summarize' && (
            <SummarizeForm
              handleLocationChange={handleLocationChange}
              selectedLocation={selectedLocation}
              selectedTextLength={selectedTextLength}
              handleTextLength={handleTextLength}
              nameRef={nameRef}
              targetAudienceRef={targetAudienceRef}
              descriptionRef={descriptionRef}
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
      </Card>

      <AdditionalFeatures
        selectedLanguage={selectedLanguage}
        handleLanguageChange={handleLanguageChange}
        nameRef={nameRef}
        selectedMood={selectedMood}
        handleMood={handleMood}
        data={data}
      />

      <Button type='submit' variant='contained' size='large' style={{ marginTop: '20px' }}>
        {t('create')}
      </Button>
    </form>
  )
}

export default authRoute(Writing)
