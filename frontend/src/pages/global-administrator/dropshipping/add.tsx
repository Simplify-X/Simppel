// @ts-nocheck

import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Snackbar } from '@mui/material'
import { Alert } from '@mui/material'
import { useRouter } from 'next/router'
import Divider from '@mui/material/Divider'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import MenuItem from '@mui/material/MenuItem'
import { Modal, Box } from '@mui/material'
import MyEditor from 'src/@core/hooks/MyEditor'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'


const AddDropshipping = () => {
  const router = useRouter()
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')
  const [editorContent, setEditorContent] = useState('')
  const { post } = useCustomApiHook()
  const [openModal, setOpenModal] = useState(false)
  const [imageFiles, setUploadedImages] = useState([])

  // const handleImageUpload = e => {
  //   const files = Array.from(e.target.files)
  //   setImageFiles(files)
  // }

  const handleImageUpload = event => {
    const files = event.target.files
    const newUploadedImages = Array.from(files)
    setUploadedImages(prevUploadedImages => [...prevUploadedImages, ...newUploadedImages])
  }

  const handleRemoveImage = index => {
    setUploadedImages(prevUploadedImages => {
      const updatedImages = [...prevUploadedImages]
      updatedImages.splice(index, 1)
      
      return updatedImages
    })
  }

  const handlePreview = () => {
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const categories = [
    'Electronics',
    "Men's Clothing",
    "Women's Clothing",
    'Home & Kitchen',
    'Books',
    'Beauty & Personal Care',
    'Sports & Outdoors',
    'Toys & Games',
    'Health & Wellness',
    'Automotive',
    'Pet Supplies',
    'Jewelry',
    'Baby',
    'Grocery',
    'Office Supplies',
    'Tools & Home Improvement',
    'Movies & TV',
    'Music',
    'Furniture',
    'Garden & Outdoor',
    'Appliances'
  ]

  useEffect(() => {
    // Check if query parameters exist and populate the form data
    const {
      title,
      price,
      image,
      category,
      saturation,
      demand,
      profitMargin,
      suppliers,
      similarItems,
      targeting,
      analytics,
      facebookAds
    } = router.query
    if (
      title &&
      price &&
      image &&
      category &&
      saturation &&
      demand &&
      profitMargin &&
      suppliers &&
      similarItems &&
      targeting &&
      analytics &&
      facebookAds
    ) {
      setFormData({
        title,
        price,
        image,
        category,
        saturation,
        demand,
        profitMargin,
        suppliers,
        similarItems,
        targeting,
        analytics,
        facebookAds
      })
    }
  }, [router.query])

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    image: '',
    category: '',
    saturation: '',
    demand: '',
    profitMargin: '',
    suppliers: '',
    similarItems: '',
    targeting: '',
    analytics: '',
    facebookAds: '',
    productScore: '',
  })

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // Do something with the form data, e.g., send it to the backend
    console.log(formData)

    const data = JSON.stringify({
      title: formData.title,
      price: formData.price,
      image: formData.image,
      category: formData.category,
      saturation: formData.saturation,
      demand: formData.demand,
      profitMargin: formData.profitMargin,
      suppliers: formData.suppliers,
      similarItems: formData.similarItems,
      targeting: formData.targeting,
      analytics: formData.analytics,
      facebookAds: formData.facebookAds,
      description: editorContent,
      productScore: formData.productScore
    })


    const r = await post(`/dropshipping`, data)
    const dropId = r?.data?.message
    const status = r?.data.status

    const formD = new FormData()
    formD.append('dropShippingProductId', dropId)
    imageFiles.forEach(file => {
      formD.append('files', file)
    })

    if (dropId) {
      const response = await post('/file-upload', formD, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const uploadedFileIds = response?.data
      console.log(uploadedFileIds)
    }

    if (status === 'OK') {
      setSnackbarMessage('Added Dropshipping product')
      setSnackbarSeverity('success')
      setOpenSnackbar(true)

      // Delay the redirection by 2 seconds
      setTimeout(() => {
        router.push('/global-administrator/dropshipping')
      }, 2000)
    } else {
      setSnackbarMessage('Failed Adding product')
      setSnackbarSeverity('success')
      setOpenSnackbar(true)
    }

    // Reset form after submission if needed
    setFormData({
      title: '',
      price: '',
      image: '',
      category: '',
      saturation: '',
      demand: '',
      profitMargin: '',
      suppliers: [],
      similarItems: [],
      targeting: '',
      analytics: '',
      facebookAds: '',
      productScore: '',
    })

    // Redirect to another page after submission if needed
    // router.push('/other-page');
  }

  const handleSnackbarClose = () => {
    setOpenSnackbar(false)
  }

  const handleEditorChange = content => {
    setEditorContent(content)
  }


  return (
    <form onSubmit={handleSubmit} encType='multipart/form-data'>
      <Card>
        <CardHeader title='Create Dropshipping Product' titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          <ToastContainer position={'top-center'} draggable={false} />
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <TextField fullWidth label='Title' name='title' value={formData.title} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={4}>
              <TextField fullWidth label='Price' name='price' value={formData.price} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={2}>
              <TextField fullWidth label='Image' name='image' value={formData.image} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={2}>
              <Button
                onClick={handlePreview}
                variant='contained'
                color='primary'
                fullWidth
                sx={{
                  height: '100%',
                  minHeight: '100%',
                  borderRadius: '50',
                  padding: '0'
                }}
              >
                Preview
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ marginTop: '5px' }}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label='Category'
                name='category'
                value={formData.category}
                onChange={handleInputChange}
                select
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label='Saturation'
                name='saturation'
                value={formData.saturation}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField fullWidth label='Demand' name='demand' value={formData.demand} onChange={handleInputChange} />
            </Grid>
          </Grid>
          <Grid item xs={4} style={{ marginTop: '20px' }}>
            <Divider style={{ marginTop: '20px' }} />
          </Grid>

          <Grid container spacing={3} style={{ marginTop: '20px' }}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label='Profit Margin'
                name='profitMargin'
                value={formData.profitMargin}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label='Suppliers'
                name='suppliers'
                value={formData.suppliers}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label='Similar Items'
                name='similarItems'
                value={formData.similarItems}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ marginTop: '5px' }}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label='Targeting'
                name='targeting'
                value={formData.targeting}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label='Analytics'
                name='analytics'
                value={formData.analytics}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label='Facebook Ads'
                name='facebookAds'
                value={formData.facebookAds}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Product Score'
                name='productScore'
                value={formData.productScore}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={2}>
              <label htmlFor='image-upload' style={{ display: 'flex', alignItems: 'center' }}>
                <Button variant='contained' component='span' color='primary' fullWidth>
                  Upload Image
                </Button>
                <input
                  id='image-upload'
                  type='file'
                  accept='image/*'
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </Grid>
            {imageFiles.map((file, index) => (
              <Grid item key={index}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    style={{ width: '80px', height: '80px' }}
                  />
                  <IconButton
                    style={{ position: 'absolute', top: 0, right: 0 }}
                    onClick={() => handleRemoveImage(index)}
                  >
                    <CloseIcon
                      style={{
                        color: '#000', // Set the desired color for the "X" icon
                        backgroundColor: 'rgba(255, 255, 255, 0.5)', // Set the desired background color for the icon
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        padding: '2px'
                      }}
                    />
                  </IconButton>
                </div>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Card style={{ marginTop: '20px' }}>
        <MyEditor handleEditorChange={handleEditorChange} />
      </Card>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        sx={{
          width: '30%',
          margin: 'auto'
        }}
      >
        <Card>
          <CardHeader title='Image Preview' />
          <CardContent>
            <Box>
              <img src={formData.image} alt='Preview' style={{ maxWidth: '100%', maxHeight: '100%' }} />
            </Box>
          </CardContent>
          <Button variant='contained' color='primary' onClick={handleCloseModal} fullWidth>
            Close
          </Button>
        </Card>
      </Modal>

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

      <Button type='submit' variant='contained' color='primary' style={{ marginTop: '10px' }}>
        Submit
      </Button>
    </form>
  )
}

export default AddDropshipping
