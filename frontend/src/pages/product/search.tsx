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
import StickyHeadTable from './CustomTable'
import { CircularProgress } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import InputAdornment from '@mui/material/InputAdornment'

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
  const classes = useStyles()
  const { get } = useCustomApiHook()
  const apiKey = process.env.NEXT_PUBLIC_API_KEY

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
  const [product, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [marketplaceURL, setMarketplaceURL] = useState('amazon.com')

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
      console.log(products)
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

  return (
    <div>
      <Card style={{ padding: 0, marginTop: 50, height: 'auto' }}>
        <CardContent>
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
                className={classes.textField }
                renderInput={params => <TextField {...params} label='Marketplace' />}
              />
            </Grid>
            <Grid item>
              <Autocomplete
                disablePortal
                id='combo-box-demo'
                options={categories}
                value={filters.productCategory}
                onChange={handleCategoryChange}
                className={classes.textField }
                sx={{ width: 280 }}
                renderInput={params => <TextField {...params} label='Category' />}
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
                      <Tooltip title='Enter the price of the product'>
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
                      <Tooltip title='Enter the amount of reviews'>
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
                      <Tooltip title='Enter the estimated sales value'>
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
        </CardContent>
      </Card>

      <Dialog open={showModal} onClose={handleModalClose}>
        <DialogTitle>Select Additional Fields</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={<Checkbox checked={selectedFields.includes('rank')} onChange={handleCheckboxChange} name='rank' />}
            label='Rank'
          />
          <FormControlLabel
            control={
              <Checkbox checked={selectedFields.includes('sales')} onChange={handleCheckboxChange} name='sales' />
            }
            label='Sales'
          />
          <FormControlLabel
            control={
              <Checkbox checked={selectedFields.includes('weight')} onChange={handleCheckboxChange} name='weight' />
            }
            label='Weight'
          />
          <FormControlLabel
            control={
              <Checkbox checked={selectedFields.includes('keywords')} onChange={handleCheckboxChange} name='keywords' />
            }
            label='Keywords'
          />
          <FormControlLabel
            control={
              <Checkbox checked={selectedFields.includes('revenue')} onChange={handleCheckboxChange} name='revenue' />
            }
            label='Revenue'
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

export default Search
