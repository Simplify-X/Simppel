// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Snackbar } from '@mui/material'
import { Alert } from '@mui/material'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import MenuItem from '@mui/material/MenuItem'

import MyEditor from 'src/@core/hooks/MyEditor'

const EditDropshipping = () => {
  const router = useRouter()
  const { id } = router.query
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')
  const [editorContent, setEditorContent] = useState('')
  const { get, put } = useCustomApiHook()

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
    facebookAds: ''
  })

  const categories = [
    'Electronics',
    'Men\'s Clothing',
    'Women\'s Clothing',
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
  ];

  useEffect(() => {
    const fetchDropshippingData = async () => {
      try {
        const response = await get(`/dropshipping/${id}`)
        const data = response?.data

        setFormData({
          title: data.title || '',
          price: data.price || '',
          image: data.image || '',
          category: data.category || '',
          saturation: data.saturation || '',
          demand: data.demand || '',
          profitMargin: data.profitMargin || '',
          suppliers: data.suppliers || '',
          similarItems: data.similarItems || '',
          targeting: data.targeting || '',
          analytics: data.analytics || '',
          facebookAds: data.facebookAds || ''
        })
        setEditorContent(data.description || '')
      } catch (error) {
        console.error('Error fetching dropshipping data:', error)
      }
    }

    if (id) {
      fetchDropshippingData()
    }
  }, [id])

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
      description: editorContent
    })

    const r = await put(`/dropshipping/${id}`, data)
    const status = r?.data.status

    if (status === 'OK') {
      setSnackbarMessage('Updated Dropshipping product')
      setSnackbarSeverity('success')
      setOpenSnackbar(true)

      // Delay the redirection by 2 seconds
      setTimeout(() => {
        router.push('/global-administrator/dropshipping')
      }, 2000)
    } else {
      setSnackbarMessage('Failed updating product')
      setSnackbarSeverity('error')
      setOpenSnackbar(true)
    }
  }

  const handleSnackbarClose = () => {
    setOpenSnackbar(false)
  }

  const handleEditorChange = content => {
    setEditorContent(content)
  }

  const handleDuplicate = () => {
    // Create a copy of the form data
    const duplicateData = { ...formData }

    // Redirect to the add page with pre-filled data
    router.push({
      pathname: '/global-administrator/dropshipping/add',
      query: { ...duplicateData }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader title='Edit Dropshipping Product' titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          <ToastContainer position={'top-center'} draggable={false} />
          <Box marginBottom={2}>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <TextField fullWidth label='Title' name='title' value={formData.title} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth label='Price' name='price' value={formData.price} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth label='Image' name='image' value={formData.image} onChange={handleInputChange} />
              </Grid>
            </Grid>
          </Box>
          <Box marginBottom={2}>
            <Grid container spacing={3}>
            <Grid item xs={4}>
                <TextField
                  fullWidth
                  label='Category'
                  name='category'
                  value={formData.category}
                  onChange={handleInputChange}
                  select // Add select prop for select functionality
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
                <TextField
                  fullWidth
                  label='Demand'
                  name='demand'
                  value={formData.demand}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </Box>
          <Box marginBottom={2}>
            <Grid container spacing={3}>
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
          </Box>
          <Box marginBottom={2}>
            <Grid container spacing={3}>
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
            </Grid>
          </Box>
        </CardContent>
      </Card>

      <Card style={{ marginTop: '20px' }}>
        <MyEditor handleEditorChange={handleEditorChange} initialValue={editorContent} />
      </Card>

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

      <div style={{ display: 'flex', marginTop: '10px' }}>
        <Button type='submit' variant='contained' color='primary' style={{ marginRight: '8px' }}>
          Update
        </Button>

        <Button variant='outlined' onClick={handleDuplicate} style={{ marginLeft: '8px' }}>
          Duplicate
        </Button>
      </div>
    </form>
  )
}

export default EditDropshipping
