// @ts-nocheck
import * as React from 'react'
import authRoute from 'src/@core/utils/auth-route'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import 'react-toastify/dist/ReactToastify.css'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import * as Sentry from '@sentry/nextjs'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogContentText, LinearProgress, CircularProgress } from '@mui/material'
import { API_BASE_URL } from 'src/config'
import TextField from '@mui/material/TextField'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import CachedIcon from '@mui/icons-material/Cached'
import Tooltip from '@mui/material/Tooltip'
import PrintIcon from '@mui/icons-material/Print'
import SaveIcon from '@mui/icons-material/Save'
import ClearIcon from '@mui/icons-material/Clear'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Snackbar } from '@mui/material'
import { Alert } from '@mui/material'
import moment from 'moment'

const StyledDialogContentText = styled(DialogContentText)`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  overflow: hidden;
`

const SingleCopy = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const [showAd, setAd] = useState(false)
  const [newd, setNewData] = useState([])
  const [updated, setUpdated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { id } = router.query
  const [editMode, setEditMode] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  let formattedCopyWritingType

  function handleSnackbarClose() {
    setOpenSnackbar(false)
  }

  useEffect(() => {
    const imageUrls = [
      'https://picsum.photos/seed/image1/800/400',
      'https://picsum.photos/seed/image2/800/400',
      'https://picsum.photos/seed/image3/800/400',
      'https://picsum.photos/seed/image4/800/400',
      'https://picsum.photos/seed/image5/800/400'
    ]

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * imageUrls.length)
      setImageUrl(imageUrls[randomIndex])
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const toggleEditMode = () => {
    setEditMode(!editMode)
  }

  const handleTitleChange = e => {
    setNewData({ ...newd, title: e.target.value })
  }

  const handleDescriptionChange = e => {
    setNewData({ ...newd, description: e.target.value })
  }

  useEffect(() => {
    if (id) {
      fetch(`${API_BASE_URL}/copyWriting/single/${id}`)
        .then(response => response.json())
        .then(data => {
          setData(data)
          setLoading(true)
        })
        .catch(error => {
          Sentry.captureException(error)
        })
    }
  }, [id])

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/copyWriting/result/${id}`)
        const fetchedData = await response.json()
        setNewData(fetchedData)
        setAd(true)
      } catch (error) {
        setAd(false)
        Sentry.captureException(error)
      }
    }

    fetchRequest()
  }, [id, updated])

  const handlePrintClick = () => {
    window.print()
  }

  const handleGeneratedAdvertisementEdit = async () => {
    console.log('updating text')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(newd?.description)
    setSnackbarMessage('Copied Successfully')
    setSnackbarSeverity('success')
    setOpenSnackbar(true)
  }

  const formatWritingType = (writingType) => {
    switch (writingType) {
        case 'WEBSITE_COPY':
          formattedCopyWritingType = 'Website Copy'
          break
        case 'SEO_COPY':
          formattedCopyWritingType = 'SEO Copy'
          break
        case 'B2B_COPY':
          formattedCopyWritingType = 'Business to business copy'
          break
        case 'B2C_COPY':
          formattedCopyWritingType = 'Business to customer copy'
          break
  
        case 'DIRECT_COPY':
          formattedCopyWritingType = 'Direct copy'
          break
  
        case 'AD_COPY':
          formattedCopyWritingType = 'Advertisement Copy'
          break
        case 'SOCIAL_MEDIA_COPY':
          formattedCopyWritingType = 'Social Media Copy'
          break
        default:
          formattedCopyWritingType = ""
          break
      }

      return formattedCopyWritingType
    
  }

  const generateAdvertisement = async () => {
    setAd(false)
    setIsLoading(true)

    const titleRequestBody = {
      title: data.title,
      language: data.languageText
    }

    const copyWritingType = data.copyWritingType

    const formattedCopy = formatWritingType(copyWritingType)


    const descriptionRequestBody = {
      description: data.description,
      keywords: data.keyWords,
      targetAudience: data.targetAudience,
      language: data.languageText,
      length: data.copyLength,
      tone: data.toneOfCopy,
      brandName: data.brandName,
      brandDescription: data.brandDescription,
      customCommands: data.customCommands,
      copyWritingType: formattedCopy
    }

    try {
      const titleResponse = await fetch(`${API_BASE_URL}/copyGenerator/generate-title`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(titleRequestBody)
      })

      const generatedTitle = await titleResponse.json()

      const descriptionResponse = await fetch(`${API_BASE_URL}/copyGenerator/generate-description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(descriptionRequestBody)
      })

      const generatedDescription = await descriptionResponse.json()

      const resultRequestBody = {
        title: generatedTitle?.choices?.[0]?.text ?? null,
        description: generatedDescription?.choices?.[0]?.text ?? null
      }

      const resultResponse = await fetch(`${API_BASE_URL}/copyWriting/result/${id}/${data.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resultRequestBody)
      })

      const savedResult = await resultResponse.json()
      setIsLoading(false)
      console.log('Copy Writing result saved:', savedResult)

      setAd(true)
      setUpdated(true)
    } catch (error) {
      console.error('Error:', error)
      Sentry.captureException(error)
    }
  }

  console.log(data)

  return (
    <>
      <Helmet>
        <title>View Copy Writing</title>
      </Helmet>
      <Grid container spacing={10}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader
              title='Copy Writing HL1'
              titleTypographyProps={{ variant: 'h6' }}
              action={
                <>
                  <Tooltip title='Click to generate a copy creative using our AI'>
                    <IconButton onClick={generateAdvertisement}>
                      <CachedIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Click to print'>
                    <IconButton onClick={handlePrintClick}>
                      <PrintIcon />
                    </IconButton>
                  </Tooltip>
                </>
              }
            />
            <Divider />
            <CardContent>
              {!loading ? (
                <Typography variant='body1'>{t('loading')}</Typography>
              ) : (
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Typography variant='caption'>{t('copy_title')}</Typography>
                    <Typography variant='body1'>{data.title ? data.title : '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>{t('copy_description')}</Typography>
                    <Typography variant='body1'>{data.description ? data.description : '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>{t('target_audience')}</Typography>
                    <Typography variant='body1'>{data.targetAudience ? data.targetAudience : '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>{t('form_type')}</Typography>
                    <Typography variant='body1'>{data.formType ? data.formType : '-'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='h6'>Brand Information</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>Brand Name</Typography>
                    <Typography variant='body1'>{data.brandName ? data.brandName : '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>Brand Description</Typography>
                    <Typography variant='body1'>{data.brandDescription ? data.brandDescription : '-'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='h6'>Copy Data</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>{t('language_text')}</Typography>
                    <Typography variant='body1'>{data.languageText ? data.languageText.toUpperCase() : '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>{t('keywords')}</Typography>
                    <Typography variant='body1'>
                      <Typography variant='body1'>{data.keyWords ? data.keyWords : '-'}</Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>{t('tone')}</Typography>
                    <Typography variant='body1'>
                      {data.toneOfCopy ? data.toneOfCopy.charAt(0).toUpperCase() + data.toneOfCopy.slice(1) : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>{t('copy_length')}</Typography>
                    <Typography variant='body1'>
                      {data.copyLength ? data.copyLength.charAt(0).toUpperCase() + data.copyLength.slice(1) : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>Copy Writing Type</Typography>
                    <Typography variant='body1'>
                    <Typography variant='body1'>{data.copyWritingType ? formatWritingType(data.copyWritingType) : '-'}</Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>{t('custom_command_text')}</Typography>
                    <Typography variant='body1'>
                      <Typography variant='body1'>{data.customCommands ? data.customCommands : '-'}</Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='h6'>Other</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>Created Date</Typography>
                    <Typography variant='body1'>
                      {data.created_at ? moment(data.created_at).format('DD/MM/YYYY') : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>Created By</Typography>
                    <Typography variant='body1'>User</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>Date of Generated Advertisement</Typography>
                    <Typography variant='body1'>-</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>Updated By</Typography>
                    <Typography variant='body1'>
                      {data.updated_at ? moment(data.updated_at).format('DD/MM/YYYY') : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>Number of Generated Times</Typography>
                    <Typography variant='body1'>1</Typography>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
        {showAd && (
          <Grid item xs={12} sm={6}>
            <Card>
              <CardHeader
                title='AI Generated Copy Writing'
                titleTypographyProps={{ variant: 'h6' }}
                action={
                  <>
                    {editMode && (
                      <Tooltip title='Click to save generated advertisement'>
                        <IconButton onClick={handleGeneratedAdvertisementEdit}>
                          <SaveIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Tooltip title={editMode ? 'Click to cancel editing' : 'Click to edit generated advertisement'}>
                      <IconButton onClick={toggleEditMode}>{editMode ? <ClearIcon /> : <EditIcon />}</IconButton>
                    </Tooltip>

                    <IconButton onClick={handleCopy}>
                      <ContentCopyIcon />
                    </IconButton>
                  </>
                }
              />
              <Divider />
              <CardContent>
                {!loading ? (
                  <CircularProgress />
                ) : (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      {editMode ? (
                        <TextField variant='outlined' fullWidth value={newd?.title} onChange={handleTitleChange} />
                      ) : (
                        <div>
                          <Typography variant='caption'>Advertisement Title</Typography>
                          <Typography variant='body1'>{newd?.title}</Typography>
                        </div>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant='caption'>{t('advertisement_description')}</Typography>
                      {editMode ? (
                        <TextField
                          variant='outlined'
                          fullWidth
                          multiline
                          rows={4}
                          value={newd?.description}
                          onChange={handleDescriptionChange}
                        />
                      ) : (
                        <Typography variant='body1'>{newd?.description}</Typography>
                      )}
                    </Grid>
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
        <Dialog open={isLoading}>
          <DialogContent>
            <StyledDialogContentText>Generating... Please wait...</StyledDialogContentText>
            <ImageContainer>
              <img src={imageUrl} alt='' />
            </ImageContainer>
            <LinearProgress color='primary' />
          </DialogContent>
        </Dialog>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

// @ts-ignore
export default authRoute(SingleCopy)
