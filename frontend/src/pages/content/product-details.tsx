// @ts-nocheck
import * as React from 'react'
import authRoute from 'src/@core/utils/auth-route'
import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import 'react-toastify/dist/ReactToastify.css'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import * as Sentry from '@sentry/nextjs'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogContentText, LinearProgress } from '@mui/material'
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
import Button from '@mui/material/Button'

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

const ProductDetails = () => {
  const { t } = useTranslation()
  const [showAd, setAd] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [productInfo, setProductInfo] = useState([])

  const [editMode, setEditMode] = useState(false)

  const [imageUrl, setImageUrl] = useState('')

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

  const [formInfo, setFormInfo] = useState({
    url: ''
  })

  const handlePrintClick = () => {
    window.print()
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAd(false)
    setIsLoading(true)

    const data = JSON.stringify({
      url: formInfo.url
    })
    const requestBody = JSON.stringify({ data })

    try {
      const response = await fetch(`${API_BASE_URL}/gpt3/generateProductInformation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: requestBody
      })
      const description = await response.json()
      const productInfoText = description.choices?.[0]?.text ?? null
      const formattedDescription = productInfoText.replace(/\n/g, '\n\n')

      // if (productInfoText) {
      //   const lines = productInfoText.split('\n');

      //   const productInfo = {};
      //   let currentSection = '';

      //   lines.forEach(line => {
      //     line = line.trim();
      //     if (line.endsWith(':')) {
      //       currentSection = line.slice(0, -1);
      //       productInfo[currentSection] = '';
      //     } else if (currentSection !== '') {
      //       productInfo[currentSection] += line + ' ';
      //     }
      //   });

      //   console.log(productInfo);
      // }

      setProductInfo(formattedDescription)

      setIsLoading(false)
      setAd(true)
      setUpdated(true)
    } catch (error) {
      console.error('Error:', error)
      Sentry.captureException(error)
    }
  }

  return (
    <>
      <Helmet>
        <title>View Advertisement</title>
      </Helmet>
      <Grid container spacing={10}>
        <Grid item xs={12} sm={12}>
          <form onSubmit={submitForm}>
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
                  </>
                }
              />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant='caption' style={{ marginBottom: 10 }}>
                      Enter a link to get detailed information about a product
                    </Typography>
                    <TextField
                      variant='outlined'
                      fullWidth
                      value={formInfo.url}
                      onChange={e => setFormInfo({ ...formInfo, url: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Button type='submit' variant='contained' size='large' style={{ marginTop: '20px' }}>
              {t('create')}
            </Button>
          </form>
        </Grid>
        {showAd && (
          <Grid item xs={12} sm={12}>
            <Card>
              <CardHeader
                title='Product Insights'
                titleTypographyProps={{ variant: 'h6' }}
                action={
                  <>
                    <Tooltip title='Click to generate an advertisement using our AI'>
                      <IconButton>
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
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant='caption'>Product Information</Typography>
                    <Typography variant='body1' dangerouslySetInnerHTML={{ __html: productInfo ?? '-' }}></Typography>
                  </Grid>
                </Grid>
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
    </>
  )
}

// @ts-ignore
export default authRoute(ProductDetails)
