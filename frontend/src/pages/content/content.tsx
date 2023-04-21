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
import Button from '@mui/material/Button'
import { API_BASE_URL } from 'src/config'

const SingleContent = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const [showAd, setAd] = useState(false)
  const [newd, setNewData] = useState([])
  const [updated, setUpdated] = useState(false)

  const router = useRouter()
  const { id } = router.query

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

  const generateAdvertisement = async () => {
    setAd(false)

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

      console.log('Advertisement result saved:', savedResult)

      setAd(true)
      setUpdated(true)
    } catch (error) {
      console.error('Error:', error)
      Sentry.captureException(error)
    }
  }

  return (
    <>
      <Button
        type='submit'
        variant='contained'
        size='large'
        style={{ marginBottom: '20px' }}
        onClick={generateAdvertisement}
      >
        {t('generate_advertisement')}
      </Button>
      <Card>
        <CardHeader title={data.name} titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          {!loading ? (
            <Typography variant='body1'>{t('loading')}</Typography>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant='h6'>{t('product_name')}</Typography>
                <Typography variant='body1'>{data.name}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='h6'>{t('product_description')}</Typography>
                <Typography variant='body1'>{data.description}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='h6'>{t('target_audience')}</Typography>
                <Typography variant='body1'>{data.targetAudience}</Typography>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      {showAd && (
        <Card style={{ marginTop: '20px' }}>
          <CardContent>
            {!loading ? (
              <Typography variant='body1'>{t('loading')}</Typography>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant='h6'>{t('advertisement_name')}</Typography>
                  <Typography variant='body1'>{newd?.title}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='h6'>{t('advertisement_description')}</Typography>
                  <Typography variant='body1'>{newd?.description}</Typography>
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      )}
    </>
  )
}

// @ts-ignore
export default authRoute(SingleContent)
