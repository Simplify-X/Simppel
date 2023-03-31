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

const DemoGrid = styled(Grid)<GridProps>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    paddingTop: `${theme.spacing(1)} !important`
  }
}))

const SingleContent = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

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
        {loading && (
          <Grid container spacing={6}>
            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Product Name</Typography>
            </Grid>
            <DemoGrid item xs={12} sm={10}>
              <Typography sx={{ marginBottom: 2 }}>
                {data.name}
              </Typography>
            </DemoGrid>

            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Product Description</Typography>
            </Grid>
            <DemoGrid item xs={12} sm={10}>
              <Typography sx={{ marginBottom: 2 }}>
                {data.description}
              </Typography>
            </DemoGrid>

            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Target Audience Name</Typography>
            </Grid>
            <DemoGrid item xs={12} sm={10}>
              <Typography sx={{ marginBottom: 2 }}>
                {data.targetAudience}
              </Typography>
            </DemoGrid>

            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Advertisement Platfrom</Typography>
            </Grid>
            <DemoGrid item xs={12} sm={10}>
              <Typography sx={{ marginBottom: 2 }}>
                {data.advertisementLocation}
              </Typography>
            </DemoGrid>

            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Advertisement Type</Typography>
            </Grid>
            <DemoGrid item xs={12} sm={10}>
              <Typography sx={{ marginBottom: 2 }}>
                {data.advertisementType}
              </Typography>
            </DemoGrid>

            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Advertisement Mood</Typography>
            </Grid>
            <DemoGrid item xs={12} sm={10}>
              <Typography sx={{ marginBottom: 2 }}>
                {data.advertisementMood}
              </Typography>
            </DemoGrid>

            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Product Type</Typography>
            </Grid>
            <DemoGrid item xs={12} sm={10}>
              <Typography sx={{ marginBottom: 2 }}>
                {data.productType ? data.productType : 'N/A'}
              </Typography>
            </DemoGrid>

            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Advertisement Length</Typography>
            </Grid>
            <DemoGrid item xs={12} sm={10}>
              <Typography sx={{ marginBottom: 2 }}>
                {data.advertisementLength ? data.advertisementLength : 'N/A'}
              </Typography>
            </DemoGrid>

          </Grid>
        )}
      </CardContent>
    </Card>
  )
}

// @ts-ignore
export default authRoute(SingleContent)
