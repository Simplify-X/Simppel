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
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import { Helmet } from 'react-helmet'
import styled from 'styled-components';



const StyledDialogContentText = styled(DialogContentText)`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  overflow: hidden;
`;

const SingleContent = () => {
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

  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const imageUrls = [
      'https://picsum.photos/seed/image1/800/400',
      'https://picsum.photos/seed/image2/800/400',
      'https://picsum.photos/seed/image3/800/400',
      'https://picsum.photos/seed/image4/800/400',
      'https://picsum.photos/seed/image5/800/400',
    ];

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * imageUrls.length);
      setImageUrl(imageUrls[randomIndex]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
      fetch(`${API_BASE_URL}/advertisements/single/${id}`)
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
        const response = await fetch(`${API_BASE_URL}/advertisement/result/${id}`)
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

  const generateAdvertisement = async () => {
    setAd(false)
    setIsLoading(true)

    const titleRequestBody = {
      productName: data.name,
      language: data.languageText
    }

    const descriptionRequestBody = {
      productName: data.name,
      productDescription: data.description,
      targetAudience: data.targetAudience,
      advertisementLocation: data.advertisementLocation,
      language: data.languageText,
      length: data.advertisementLength,
      mood: data.advertisementMood,
      productType: data.productType
    }

    try {
      const titleResponse = await fetch(`${API_BASE_URL}/gpt3/generate-title`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(titleRequestBody)
      })

      const generatedTitle = await titleResponse.json()

      const descriptionResponse = await fetch(`${API_BASE_URL}/gpt3/generate-description`, {
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

      const resultResponse = await fetch(`${API_BASE_URL}/advertisement/result/${id}/${data.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resultRequestBody)
      })

      const savedResult = await resultResponse.json()
      setIsLoading(false)
      console.log('Advertisement result saved:', savedResult)

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
        <title>View Advertisement</title>
      </Helmet>
      <Grid container spacing={10}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader
              title='Advertisement HL1'
              titleTypographyProps={{ variant: 'h6' }}
              action={
                <>
                  <Tooltip title='Click to generate an advertisement using our AI'>
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
                    <Typography variant='caption'>{t('product_name')}</Typography>
                    <Typography variant='body1'>{data.name ? data.name : '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>{t('product_description')}</Typography>
                    <Typography variant='body1'>{data.description ? data.description : '-'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='caption'>{t('target_audience')}</Typography>
                    <Typography variant='body1'>{data.targetAudience ? data.targetAudience : '-'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='h6'>Advertisement Data</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>{t('language_text')}</Typography>
                    <Typography variant='body1'>{data.languageText ? data.languageText : '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>{t('advertisement_location')}</Typography>
                    <Typography variant='body1'>
                      {data.advertisementLocation ? data.advertisementLocation : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>{t('advertisement_length')}</Typography>
                    <Typography variant='body1'>{data.advertisementLength ? data.advertisementLength : '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>Advertisement Mood</Typography>
                    <Typography variant='body1'>{data.advertisementMood ? data.advertisementMood : '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>{t('advertisement_type')}</Typography>
                    <Typography variant='body1'>{data.advertisementType ? data.advertisementType : '-'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='h6'>Other</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>Created Date</Typography>
                    <Typography variant='body1'>-</Typography>
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
                    <Typography variant='body1'>-</Typography>
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
              title='AI Generated Advertisements'
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
                  <IconButton onClick={toggleEditMode}>
                    {editMode ? <ClearIcon /> : <EditIcon />}
                  </IconButton>
                </Tooltip>

                </>
              }
            />
            <Divider />
              <CardContent>
                {!loading ? (
                  <CircularProgress/>
                ) : (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      {editMode ? (
                        <TextField variant='outlined' fullWidth value={newd?.title} onChange={handleTitleChange} />
                      ) : (
                        <Typography variant='body1'>{newd?.title}</Typography>
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
          <StyledDialogContentText>
            Generating... Please wait...
          </StyledDialogContentText>
          <ImageContainer>
            <img src={imageUrl} alt="" />
          </ImageContainer>
          <LinearProgress color="primary" />
        </DialogContent>
      </Dialog>
      </Grid>
    </>
  )
}

// @ts-ignore
export default authRoute(SingleContent)
