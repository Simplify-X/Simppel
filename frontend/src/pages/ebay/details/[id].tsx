// @ts-nocheck
import React, { useState, useEffect } from 'react'
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
  IconButton,
  Alert
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
import { SaveAlt } from '@mui/icons-material'
import JSZip from 'jszip'
import CloseIcon from '@mui/icons-material/Close'

interface ResponseData {
  id?: string
}

const ProductDetail: React.FC = () => {
  const { product } = useStore()
  const router = useRouter()
  const { userId } = useUserData()
  const { post, get } = useCustomApiHook()
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [data, setData] = useState([])
  const [infoAlertOpen, setInfoAlertOpen] = useState(true)
  const [teamGroupMember, setTeamGroupMember] = useState([])
  const [teamData, setTeamData] = useState([])

  const handleInfoAlertClose = () => {
    setInfoAlertOpen(false)
  }

  useEffect(() => {
    userId && fetchSingleUser()
    userId && fetchTeamGroupMember()
  }, [userId])

  useEffect(() => {
    teamGroupMember?.teamGroupId && fetchTeamData()
  }, [teamGroupMember?.teamGroupId])

  const fetchSingleUser = async () => {
    const response = await get(`/users/getSingleUser/${userId}`)
    if (response?.data) {
      setData(response.data)
    }
  }

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

  const handleImportCopy = () => {
    if (product) {
      router.push('/writing/add')
    } else {
      alert('No product selected')
    }
  }

  const handleDownloadImages = async () => {
    const zip = new JSZip()

    const folder = zip.folder('images')

    product?.additionalImages.forEach((image, index) => {
      folder.file(
        `image_${index + 1}.jpg`,
        fetch(image.imageUrl).then(response => response.blob())
      )
    })

    const content = await zip.generateAsync({ type: 'blob' })

    const downloadLink = document.createElement('a')
    downloadLink.href = URL.createObjectURL(content)
    downloadLink.download = 'images.zip'
    downloadLink.click()
  }

  async function handleGenerateAdvert(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const categoriesString = product.categories
      .map((category: { categoryName: any }) => category.categoryName)
      .join(', ')

    const formattedData = {
      name: product.title,
      description: product.description || product?.title,
      targetAudience: categoriesString,
      advertisementLocation: data?.defaultAdvertisementLocation,
      advertisementType: '',
      advertisementMood: data?.defaultAdvertisementMood,
      advertisementLength: data?.defaultAdvertisementLength,
      languageText: data?.defaultAdvertisementLanguage,
      brandName: '',
      brandDescription: ''
    }

    try {
      const response = await post(`/advertisements/${userId}`, formattedData)
      const newAdvertisementId = (response?.data as ResponseData)?.id
      router.push(`/content/view/${newAdvertisementId}`)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerateCopy(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const categoriesString = product.categories
      .map((category: { categoryName: any }) => category.categoryName)
      .join(', ')

    const formSupplyType = 'Copy Form'
    const customCommands = ''

    const copyData = {
      title: product?.title,
      keyWords: categoriesString,
      description: product?.title || product.description,
      formType: formSupplyType,
      targetAudience: categoriesString,
      toneOfCopy: data?.defaultCopyTone,
      copyLength: data?.defaultCopyLength,
      languageText: data?.defaultCopyLanguage,
      brandName: '',
      brandDescription: '',
      customCommands: customCommands,
      copyWritingType: data?.defaultCopyType,
      copyWritingContext: null
    }

    const response = await post(`/copyWriting/${userId}`, copyData)
    const newAdvertisementId = (response?.data as ResponseData)?.id
    router.push(`/writing/view/${newAdvertisementId}`)
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

  return (
    <>
      <Helmet>
        <title>View Ebay Product</title>
      </Helmet>
      <Grid container spacing={10}>
        <Grid item xs={4} sm={4}>
          <Card>
            <CardHeader
              title='Product Images'
              titleTypographyProps={{ variant: 'h6' }}
              action={
                <Tooltip title={'Download all images for this product'}>
                  <IconButton onClick={handleDownloadImages}>{<SaveAlt />}</IconButton>
                </Tooltip>
              }
            />
            <Divider />
            <CardContent>
              {product?.length > 0 ? (
                <CircularProgress />
              ) : (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Carousel showArrows={true} showThumbs={false} selectedItem={selectedImageIndex}>
                      {product?.additionalImages &&
                        product.additionalImages.map((image, index) => (
                          <div key={index}>
                            <img
                              src={image.imageUrl}
                              alt={`Additional Image ${index + 1}`}
                              style={{ maxWidth: '400px', maxHeight: '500px', width: 'auto', height: 'auto' }}
                            />
                          </div>
                        ))}
                    </Carousel>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2} justifyContent='center'>
                      {product?.additionalImages &&
                        product.additionalImages.map((image, index) => (
                          <Grid item key={index}>
                            <img
                              src={image.imageUrl}
                              alt={`Additional Image ${index + 1}`}
                              style={{ width: '80px', height: '80px', cursor: 'pointer' }}
                              onClick={() => setSelectedImageIndex(index)}
                            />
                          </Grid>
                        ))}
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Card>
            {infoAlertOpen && (
              <Alert
                severity='info'
                action={
                  <IconButton color='inherit' size='small' onClick={handleInfoAlertClose}>
                    <CloseIcon fontSize='inherit' />
                  </IconButton>
                }
              >
                Please adjust the advertisement and copy writing settings from the account settings when generating
              </Alert>
            )}
            <CardHeader
              title='Product Details'
              titleTypographyProps={{ variant: 'h6' }}
              action={
                <>
                  {teamData?.spyToolAccess !== 'VIEW' && (
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
                        <Button
                          component='a'
                          variant='contained'
                          sx={{ px: 5.5, marginRight: '10px' }}
                          onClick={handleImportAdvert}
                        >
                          Import Ad
                        </Button>
                      </Tooltip>
                    </>
                  )}

                  {teamData?.copyWritingAccess !== 'VIEW' && (
                    <>
                      <Tooltip title='Click to generate an instant copy'>
                        <Button
                          component='a'
                          variant='contained'
                          sx={{ px: 5.5, marginRight: '10px' }}
                          onClick={handleGenerateCopy}
                        >
                          Generate Copy
                        </Button>
                      </Tooltip>

                      <Tooltip title='Click to create a copy based on the product data'>
                        <Button component='a' variant='contained' sx={{ px: 5.5 }} onClick={handleImportCopy}>
                          Import Copy
                        </Button>
                      </Tooltip>
                    </>
                  )}
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
                      {product?.shippingOptions
                        ?.map((shippingOption: { shippingOption: any }) => shippingOption.shippingCostType)
                        .join(', ') ?? '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>Shipping price</Typography>
                    <Typography variant='body1'>
                      {product?.shippingOptions
                        ?.map(
                          (shippingOption: { shippingOption: any }) =>
                            shippingOption.shippingCost.currency + ' ' + shippingOption.shippingCost.value
                        )
                        .join(', ') ?? '-'}
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
