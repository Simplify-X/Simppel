// @ts-nocheck
// ** React Imports

import { useState, useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import authRoute from 'src/@core/utils/auth-route'
import 'react-toastify/dist/ReactToastify.css'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'

import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import { useUserData } from 'src/@core/hooks/useUserData'
import { Helmet } from 'react-helmet'
import Loader from 'src/@core/components/ui/Loader'
import { useForm } from 'react-hook-form'
import KeywordResults from 'src/@core/components/keyword-research/KeywordResults'
import FormInputSelect from 'src/@core/components/FormInputSelect'
import FormField from 'src/@core/components/FormField'

const KeywordResearch = () => {
  // ** States
  const theme = useTheme()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const { get } = useCustomApiHook()
  const { userId } = useUserData()
  const [,setTeamData] = useState([])
  const [teamGroupMember, setTeamGroupMember] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [keywordInput, setKeywordInput] = useState([])
  const [languageInput, setLanguageInput] = useState([])
  const [regionInput, setRegionInput] = useState([])


  const { handleSubmit, errors, control } = useForm();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
  ];

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

  async function submitForm(formData) {
    console.log(formData)

    const {
        keyword,
        language,
        region
    } = formData;

    setKeywordInput(keyword)
    setLanguageInput(language)
    setRegionInput(region)

    setShowResults(true)
  }


  if (loading) {
    return <Loader />
  }


  return (
    <>
      <form onSubmit={handleSubmit(submitForm)}>
        <Helmet>
          <title>Simppel - Keyword Research</title>
        </Helmet>
        <Typography
          variant='h4'
          id='h1-header'
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '1rem'
          }}
        >
          {t('keyword_research')}
        </Typography>
        <Typography
          variant='subtitle1'
          gutterBottom
          sx={{
            color: theme.palette.text.secondary,
            textAlign: 'center',
            marginBottom: '2rem'
          }}
        >
          Mandatory fields are marked with asterisk (*)
        </Typography>
        <Card
          sx={{
            margin: 'auto',
            maxWidth: '90%',
            padding: 2
          }}
        >
          <CardContent>
            <Grid container spacing={2} alignItems='center' justifyContent='space-between'>
              <Grid item xs={12} md={4}>
                <FormField
                  as={<TextField
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton>
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />}
                  name='keyword'
                  control={control}
                  errors={errors}
                  variant='outlined'
                  label={t('keyword')}
                  margin='normal'
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} md={2}>
              <FormInputSelect
                name='language'
                label={t('language')}
                control={control}
                defaultValue=''
                variant='outlined'
                margin='normal'
                fullWidth
                error={!!errors.language}
                helperText={errors.language ? errors.language.message : ''}
              >
                {languages.map((language) => (
                  <MenuItem key={language.code} value={language.name}>
                    {t(language.code)}
                  </MenuItem>
                ))}
              </FormInputSelect>
              </Grid>
              {/* Region Select */}
              <Grid item xs={6} md={2}>
                <FormInputSelect
                  name='region'
                  label={t('region')}
                  control={control}
                  defaultValue=''
                  variant='outlined'
                  margin='normal'
                  fullWidth
                  error={!!errors.region}
                  helperText={errors.region ? errors.region.message : ''}
                >
                  <MenuItem value='United states'>US</MenuItem>
                  <MenuItem value='Europe'>Europe</MenuItem>
                  <MenuItem value='Asia'>Asia</MenuItem>
                </FormInputSelect>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  size='large'
                  sx={{ textTransform: 'none', backgroundColor: '#8e44ad' }}
                  startIcon={<SearchIcon />}
                  fullWidth
                >
                  {t('search_keyword')}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </form>
      {showResults && 
        <KeywordResults 
          keyword={keywordInput} 
          language={languageInput} 
          location={regionInput}
          
        />
      }
    </>
  )
}

export default authRoute(KeywordResearch)
