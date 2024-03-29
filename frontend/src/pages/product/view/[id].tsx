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
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogContentText, LinearProgress, CircularProgress } from '@mui/material'
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
import { getProductByASIN, estimateSalesByASIN } from 'src/@core/utils/amazon-product-api'


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

const AdvancedProduct = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const [showAd, setAd] = useState(false)
  const [newd, setNewData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { id } = router.query
  const [editMode, setEditMode] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [productData, setProductData] = useState([])

  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

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
    const fetchData = async () => {
      if (id) {
        try {
          const productData = await getProductByASIN(id, 'amazon.com');

          setProductData(productData?.product)

          const salesEstimation = await estimateSalesByASIN(id, 'amazon.com');
          console.log(salesEstimation)

          // setProductData(prevData => ({
          //   ...prevData,
          //   salesEstimation: salesEstimation
          // }));
          setLoading(true)
          console.log(productData);
        } catch (error) {
          console.error('Error fetching product data:', error);
        }
      }
    };
  
    fetchData();
  }, [id]);
  


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

  const generateAdvertisement = async () => {
    setData('test')
    setAd(true)
    setIsLoading(true)
    console.log('test');
  }


  return (
    <>
      <Helmet>
        <title>View Advertisement</title>
      </Helmet>
      <Grid container spacing={10}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader
              title={productData.title}
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
                    <Typography variant='body1'>{productData.brand ? productData.brand : '-'}</Typography>
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
                    <Typography variant='h6'>Advertisement Data</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>{t('language_text')}</Typography>
                    <Typography variant='body1'>{data.languageText ? data.languageText.toUpperCase() : '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>{t('advertisement_location')}</Typography>
                    <Typography variant='body1'>
                      {data.advertisementLocation
                        ? data.advertisementLocation.charAt(0).toUpperCase() + data.advertisementLocation.slice(1)
                        : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>{t('advertisement_length')}</Typography>
                    <Typography variant='body1'>
                      {data.advertisementLength
                        ? data.advertisementLength.charAt(0).toUpperCase() + data.advertisementLength.slice(1)
                        : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>Advertisement Mood</Typography>
                    <Typography variant='body1'>
                      {data.advertisementMood
                        ? data.advertisementMood.charAt(0).toUpperCase() + data.advertisementMood.slice(1)
                        : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>{t('advertisement_type')}</Typography>
                    <Typography variant='body1'>
                      {data.advertisementType
                        ? data.advertisementType.charAt(0).toUpperCase() + data.advertisementType.slice(1)
                        : '-'}
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
export default authRoute(AdvancedProduct)
