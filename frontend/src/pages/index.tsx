// @ts-nocheck

import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import FilterListIcon from '@mui/icons-material/FilterList'
import { makeStyles } from '@mui/styles'
import Cookies from 'js-cookie'
import { Grid } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Autocomplete from '@mui/material/Autocomplete'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import { getProductByCategory } from 'src/@core/utils/amazon-product-api'
import StickyHeadTable from './product/CustomTable'
import { CircularProgress } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import InputAdornment from '@mui/material/InputAdornment'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Box from '@mui/material/Box'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import { useTranslation } from 'react-i18next'
import DropshippingCard from './product/DropshippingCard' // Import the DropshippingCard component
import { useUserData } from 'src/@core/hooks/useUserData'
import Divider from '@mui/material/Divider'
import { Helmet } from 'react-helmet'
import Loader from 'src/@core/components/ui/Loader'
import authRoute from 'src/@core/utils/auth-route'
import { useRouter } from 'next/router'
import FirstSettings from '../views/modal-templates/firstSettings'

const useStyles = makeStyles({
  textField: {
    marginBottom: '12px'
  },
  filterButton: {
    marginLeft: 'auto',
    backgroundColor: '#9c27b0', // Update with desired color
    color: '#ffffff', // Update with desired color
    '&:hover': {
      backgroundColor: '#7b1fa2' // Update with desired color
    }
  },
  additionalFieldsContainer: {
    marginBottom: '12px'
  },
  button: {
    marginLeft: '12px',
    height: 55,
    width: 180
  }
})

const marketPlaceData = [
  { label: 'USA', url: 'amazon.com' },
  { label: 'France', url: 'amazon.fr' },
  { label: 'Italy', url: 'amazon.it' },
  { label: 'Canada', url: 'amazon.cn' }
]

const Search: React.FC = () => {
  const router = useRouter()
  const classes = useStyles()
  const { get } = useCustomApiHook()
  const apiKey = process.env.NEXT_PUBLIC_API_KEY
  const { t } = useTranslation()
  const [data, setData] = useState([])

  const [filters, setFilters] = useState<any>({
    productCategory: '',
    productKeywords: '',
    price: '',
    sales: '',
    reviews: '',
    productWeight: '',
    productMarketPlace: ''
  })

  const [showModal, setShowModal] = useState(false)
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [loadings, setLoadings] = useState(true)
  const [product, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [marketplaceURL, setMarketplaceURL] = useState('amazon.com')
  const [selectedValue, setSelectedValue] = useState('amazon')
  const { userId } = useUserData()

  const handleChangeForm = event => {
    setSelectedValue(event.target.value)
  }

  useEffect(() => {
    userId && fetchSingleUser()
  }, [userId])

  const fetchSingleUser = async () => {
    const response = await get(`/users/getSingleUser/${userId}`)
    if (response?.data) {
      setData(response.data)
    }
  }

  useEffect(() => {
    if (data && data.formType) {
      setSelectedValue(data.productFormType)
    }
  }, [data])

  useEffect(() => {
    const savedFields = Cookies.get('selectedFields')
    if (savedFields) {
      setSelectedFields(JSON.parse(savedFields))
    }

    // Retrieve filter information and search results from local storage
    const savedFilterData = localStorage.getItem('filterData')
    const savedProductData = localStorage.getItem('productData')

    if (savedFilterData && savedProductData) {
      setFilters(JSON.parse(savedFilterData))
      setProducts(JSON.parse(savedProductData))
      setLoadings(false)
    } else {
      setLoadings(false)
    }
  }, [])

  useEffect(() => {
    Cookies.set('selectedFields', JSON.stringify(selectedFields))
  }, [selectedFields])

  useEffect(() => {
    const fetchCategories = async (domain: string) => {
      try {
        setMarketplaceURL(domain)
        const storedCategories = localStorage.getItem('categories')

        // if (storedCategories && domain.includes(marketplaceURL)) {
        if (storedCategories) {
          setCategories(JSON.parse(storedCategories))
        } else {
          const response = await get(`https://api.rainforestapi.com/categories?api_key=${apiKey}&domain=${domain}`)
          const data = response?.data
          const categoryNames = data.categories.map(category => category.name)
          const sortedCategoryNames = categoryNames.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }))
          setCategories(sortedCategoryNames)

          // Store categories in localStorage for future use
          localStorage.setItem('categories', JSON.stringify(sortedCategoryNames))
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    const domain =
      filters.productMarketPlace === 'USA'
        ? 'amazon.com'
        : filters.productMarketPlace === 'France'
        ? 'amazon.fr'
        : filters.productMarketPlace === 'Italy'
        ? 'amazon.it'
        : 'amazon.com'
    fetchCategories(domain) // Initial fetch based on selected marketplace
  }, [filters.productMarketPlace])

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }))
  }

  const handleMarketPlaceChange = (event, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      productMarketPlace: value
    }))
  }

  const handleCategoryChange = (event, value) => {
    const selectedCategory = value || '' // If no value is selected, set it to an empty string
    setFilters(prevFilters => ({
      ...prevFilters,
      productCategory: selectedCategory
    }))
  }

  const handleAddFieldsClick = () => {
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target
    if (checked) {
      setSelectedFields(prevSelectedFields => [...prevSelectedFields, name])
    } else {
      setSelectedFields(prevSelectedFields => prevSelectedFields.filter(field => field !== name))
    }
  }

  const handleSaveFields = () => {
    setShowModal(false)
  }

  const handleFindProducts = async () => {
    try {
      // Clear the table data
      setProducts([])

      // Set loading state
      setLoading(true)

      // Your existing code to fetch products
      const products = await getProductByCategory(
        filters.productCategory,
        filters.price,
        20,
        filters.reviews,
        filters.sales,
        marketplaceURL
      )

      // Update state with new filter information and search results
      setFilters(prevFilters => ({
        ...prevFilters,
        ...filters
      }))
      setProducts(products?.category_results)

      // Store filter information and search results in local storage
      localStorage.setItem('filterData', JSON.stringify(filters))
      localStorage.setItem('productData', JSON.stringify(products?.category_results))

      // Reset loading state
      setLoading(false)

      // Trigger any other action you want
    } catch (error) {
      console.error('Error fetching products:', error)

      // Reset loading state in case of error
      setLoading(false)
    }
  }

  if (loadings) {
    return <CircularProgress />
  }

  if (!data?.accountId) return <Loader />

  if (data?.role) {
    router.push('/global-administrator/users')

    return <Loader />
  } else if (!data?.firstTimeLoggedIn){
    return <FirstSettings/>
  }
  
  else {
    return (
      <div>
        <Helmet>
          <title>Simppel - Search Winning Products</title>
        </Helmet>
        <Card style={{ padding: 10, marginTop: 50, height: 'auto' }}>
          <CardContent>
            <Box>
              <FormControl component='fieldset'>
                <FormLabel component='legend' style={{ marginTop: 20 }}>
                  <span style={{ marginRight: 8 }}>{t('search_type')}</span>
                  <IconButton>
                    <AcUnitIcon />
                  </IconButton>
                </FormLabel>
                <RadioGroup row value={selectedValue} onChange={handleChangeForm}>
                  <FormControlLabel
                    value='amazon'
                    control={<Radio checked={selectedValue === 'amazon'} />}
                    label={t('amazon_product')}
                  />
                  <FormControlLabel
                    value='dropshipping'
                    control={<Radio checked={selectedValue === 'dropshipping'} />}
                    label={t('dropship_product')}
                  />
                </RadioGroup>
              </FormControl>
            </Box>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {selectedValue === 'amazon' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <h1 style={{ marginRight: 'auto' }}>Product Filters</h1>
                  <IconButton className={classes.filterButton} onClick={handleAddFieldsClick}>
                    <FilterListIcon />
                  </IconButton>
                </div>
                <Grid container spacing={2}>
                  <Grid item>
                    <Autocomplete
                      disablePortal
                      id='combo-box-demo'
                      options={marketPlaceData}
                      value={filters.productMarketPlace}
                      onInputChange={handleMarketPlaceChange}
                      sx={{ width: 300 }}
                      className={classes.textField}
                      renderInput={params => <TextField {...params} label={t('marketplace')} />}
                    />
                  </Grid>
                  <Grid item>
                    <Autocomplete
                      disablePortal
                      id='combo-box-demo'
                      options={categories}
                      value={filters.productCategory}
                      onChange={handleCategoryChange}
                      className={classes.textField}
                      sx={{ width: 280 }}
                      renderInput={params => <TextField {...params} label={t('category')} />}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      label='Price'
                      name='price'
                      value={filters.price}
                      onChange={handleFilterChange}
                      className={classes.textField}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end' style={{ marginLeft: '-30px' }}>
                            <Tooltip title={t('enter_price_of_product')}>
                              <IconButton size='small'>
                                <HelpOutlineIcon style={{ color: 'gray' }} />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      label='Reviews'
                      name='reviews'
                      value={filters.reviews}
                      onChange={handleFilterChange}
                      className={classes.textField}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end' style={{ marginLeft: '-30px' }}>
                            <Tooltip title={t('enter_amount_of_reviews')}>
                              <IconButton size='small'>
                                <HelpOutlineIcon style={{ color: 'gray' }} />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      label='Est Sales'
                      name='sales'
                      value={filters.sales}
                      onChange={handleFilterChange}
                      className={classes.textField}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end' style={{ marginLeft: '-30px' }}>
                            <Tooltip title={t('enter_estimated_sales_of_product')}>
                              <IconButton size='small'>
                                <HelpOutlineIcon style={{ color: 'gray' }} />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>

                  <Grid item>
                    <Button variant='contained' color='primary' className={classes.button} onClick={handleFindProducts}>
                      Find Products
                    </Button>
                  </Grid>

                  <Grid item>
                    {selectedFields.map((field, index) => (
                      <TextField
                        key={index}
                        label={field.charAt(0).toUpperCase() + field?.slice(1)}
                        name={field}
                        value={filters[field]}
                        onChange={handleFilterChange}
                        className={classes.textField}
                        style={{ marginRight: '10px' }}
                      />
                    ))}
                  </Grid>
                </Grid>

                {loading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                  </div>
                ) : (
                  <div style={{ marginTop: 50 }}>
                    <StickyHeadTable data={product} />
                  </div>
                )}
              </>
            )}

            {selectedValue === 'dropshipping' && (
              <div>
                <h1>Handpicked Dropshipping products</h1>
                <Grid item xs={3}>
                  <DropshippingCard />
                </Grid>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={showModal} onClose={handleModalClose}>
          <DialogTitle>Select Additional Fields</DialogTitle>
          <DialogContent>
            <FormControlLabel
              control={
                <Checkbox checked={selectedFields.includes('rank')} onChange={handleCheckboxChange} name='rank' />
              }
              label={t('rank')}
            />
            <FormControlLabel
              control={
                <Checkbox checked={selectedFields.includes('sales')} onChange={handleCheckboxChange} name='sales' />
              }
              label={t('sales')}
            />
            <FormControlLabel
              control={
                <Checkbox checked={selectedFields.includes('weight')} onChange={handleCheckboxChange} name='weight' />
              }
              label={t('weight')}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedFields.includes('keywords')}
                  onChange={handleCheckboxChange}
                  name='keywords'
                />
              }
              label={t('keywords_amazon')}
            />
            <FormControlLabel
              control={
                <Checkbox checked={selectedFields.includes('revenue')} onChange={handleCheckboxChange} name='revenue' />
              }
              label={t('revenue')}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModalClose}>Cancel</Button>
            <Button onClick={handleSaveFields}>Save</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default authRoute(Search)
