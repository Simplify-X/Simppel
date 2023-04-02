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
import { styled } from '@mui/material/styles'
import * as Sentry from "@sentry/nextjs";
import { useTranslation } from 'react-i18next'

const DemoGrid = styled(Grid)<GridProps>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    paddingTop: `${theme.spacing(1)} !important`
  }
}))

const SingleContent = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8080/api/advertisements/single/${id}`)
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

  return (
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
  )
}

// @ts-ignore
export default authRoute(SingleContent)
