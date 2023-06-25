// @ts-nocheck
import React, { useState } from 'react'
import { useStore } from 'src/store'
import {
  Box,
  Card,
  Typography,
  Grid,
  Button,
  Tooltip,
  CardHeader,
  Divider,
  CardContent,
  CircularProgress,
} from '@mui/material'
import { useRouter } from 'next/router'
import { useUserData } from 'src/@core/hooks/useUserData'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import Loader from 'src/@core/components/ui/Loader'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import moment from 'moment'

interface ResponseData {
  id?: string
}

const ProductDetail: React.FC = () => {
  const { product } = useStore()
  const router = useRouter()
  const { userId } = useUserData()
  const { post } = useCustomApiHook()
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  const handleGoBack = () => {
    router.push('/ebay/search/')
  }

  const handleImportAdvert = () => {
    if (product) {
      router.push('/content/add')
    } else {
      alert('No product selected')
    }
  }

  async function handleGenerateAdvert(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const categoriesString = product.categories
      .map((category: { categoryName: any }) => category.categoryName)
      .join(', ')

    const data = {
      name: product.title,
      description: product.description || product?.title,
      targetAudience: categoriesString,
      advertisementLocation: 'facebook',
      advertisementType: '',
      advertisementMood: 'sell',
      advertisementLength: 'long',
      languageText: 'us',
      brandName: '',
      brandDescription: ''
    }

    try {
      const response = await post(`/advertisements/${userId}`, data)
      const newAdvertisementId = (response?.data as ResponseData)?.id
      router.push(`/content/view/${newAdvertisementId}`)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loader />
  }

  if (!product) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant='h6'>No product selected</Typography>
        <Button variant='contained' onClick={handleGoBack}>
          Go Back to Ebay List
        </Button>
      </Box>
    )
  }

  console.log(product)

  return (
    <>
      <Helmet>
        <title>View Ebay Product</title>
      </Helmet>
      <Grid container spacing={10}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader title='Product Images' titleTypographyProps={{ variant: 'h6' }} />
            <Divider />
            <CardContent>
              {product?.length > 0 ? (
                <CircularProgress />
              ) : (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Carousel showArrows={true} showThumbs={false}>
                      {product?.additionalImages.map((image, index) => (
                        <div key={index}>
                          <img
                            src={image.imageUrl}
                            alt={`Additional Image ${index + 1}`}
                            style={{ maxWidth: '400px', height: '500px' }}
                          />
                        </div>
                      ))}
                    </Carousel>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader
              title='Product Details'
              titleTypographyProps={{ variant: 'h6' }}
              action={
                <>
                  <Tooltip title='Click to generate an instant advertisement'>
                    <Button
                      component='a'
                      variant='contained'
                      sx={{ px: 5.5, marginRight: '10px' }}
                      onClick={handleGenerateAdvert}
                    >
                      Generate Ad
                    </Button>
                  </Tooltip>
                  <Tooltip title='Click to create an advertisement based on the product data'>
                    <Button component='a' variant='contained' sx={{ px: 5.5 }} onClick={handleImportAdvert}>
                      Import Ad
                    </Button>
                  </Tooltip>
                </>
              }
            />
            <Divider />
            <CardContent>
              {product?.length > 0 ? (
                <Typography variant='body1'>{t('loading')}</Typography>
              ) : (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant='caption'>{t('product_name')}</Typography>
                    <Typography variant='body1'>{product.title ? product.title : '-'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='caption'>{t('product_description')}</Typography>
                    <Typography variant='body1'>{product.description ? product.description : '-'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='caption'>{t('target_audience')}</Typography>
                    <Typography variant='body1'>
                      {product.categories.map((category: { categoryName: any }) => category.categoryName).join(', ')
                        ? product.categories.map((category: { categoryName: any }) => category.categoryName).join(', ')
                        : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='h6'>Shipping Information</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>Cost Type</Typography>
                    <Typography variant='body1'>
                      {product.shippingOptions
                        .map((shippingOption: { shippingOption: any }) => shippingOption.shippingCostType)
                        .join(', ')
                        ? product.shippingOptions
                            .map((shippingOption: { shippingOption: any }) => shippingOption.shippingCostType)
                            .join(', ')
                        : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>Shipping price</Typography>
                    <Typography variant='body1'>
                      {product.shippingOptions
                        .map((shippingOption: { shippingOption: any }) => shippingOption.shippingCost)
                        .join(', ')
                        ? product.shippingOptions
                            .map((shippingOption: { shippingOption: any }) => shippingOption.shippingCost?.value)
                            .join(', ')
                        : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='h6'>Seller Information</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>Username</Typography>
                    <Typography variant='body1'>{product.seller.username ? product.seller.username : '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>Feedback Percentage</Typography>
                    <Typography variant='body1'>
                      {product.seller.feedbackPercentage + '%' ? product.seller.feedbackPercentage + '%' : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='h6'>Product Details</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>Product Condition</Typography>
                    <Typography variant='body1'>{product.condition ? product.condition : '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>Product Location</Typography>
                    <Typography variant='body1'>
                      {product.itemLocation.country ? product.itemLocation.country : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>Price</Typography>
                    <Typography variant='body1'>
                      {product.price.currency + product.price.value
                        ? product.price.currency + product.price.value
                        : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>Top rated Buying Experience</Typography>
                    <Typography variant='body1'>
                      {typeof product.topRatedBuyingExperience === 'boolean'
                        ? product.topRatedBuyingExperience
                          ? 'True'
                          : 'False'
                        : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>Available Coupon</Typography>
                    <Typography variant='body1'>
                      {typeof product.availableCoupons === 'boolean'
                        ? product.availableCoupons
                          ? 'True'
                          : 'False'
                        : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>Is Adult Only</Typography>
                    <Typography variant='body1'>
                      {typeof product.adultOnly === 'boolean' ? (product.adultOnly ? 'True' : 'False') : '-'}
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
                      {product.itemCreationDate ? moment(product.itemCreationDate).format('DD/MM/YYYY') : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>Created By</Typography>
                    <Typography variant='body1'>{product.seller.username ? product.seller.username : '-'}</Typography>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default ProductDetail
