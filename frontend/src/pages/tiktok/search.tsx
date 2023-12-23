// @ts-nocheck

import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import FilterListIcon from '@mui/icons-material/FilterList'
import { makeStyles } from '@mui/styles'
import { Grid } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import { CircularProgress } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'
import { Helmet } from 'react-helmet'
import ProductCardGrid from './tiktokProduct'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import moment from 'moment'
import { getTiktokProductByKeywords } from 'src/@core/utils/tiktok-product-search'
import Autocomplete from '@mui/material/Autocomplete'
import Typography from '@mui/material/Typography'
import FilterSidebar from "src/@core/components/ui/FilterSidebar";

const useStyles = makeStyles({
  textField: {
    marginBottom: '12px'
  },
  filterButton: {
    marginLeft: 'auto',
    color: '#808080',
    '&:hover': {
      backgroundColor: '#804BDF'
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

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 }
]

const SearchTiktok: React.FC = () => {
  const classes = useStyles()
  const { getMiranda } = useCustomApiHook()
  const { t } = useTranslation()
  const [filters, setFilters] = useState<any>({
    productCategory: '',
    productKeywords: '',
    sales: '',
    reviews: '',
    productWeight: '',
    productMarketPlace: '',
    productSearch: '',
    price: {
      low: '',
      high: ''
    }
  })

  const [loading, setLoading] = useState(false)
  const [ebayData, setEbayData] = useState([])
  const [sortOption, setSortOption] = useState('')
  const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState(null)

  const handleSortOptionChange = option => {
    setSortOption(option)

    const sortedData = [...ebayData]

    if (option === 'highestToLowest') {
      sortedData.sort((a, b) => b.price.value - a.price.value)
    } else if (option === 'lowestToHighest') {
      sortedData.sort((a, b) => a.price.value - b.price.value)
    } else if (option === 'latest') {
      console.log('here')
      sortedData.sort((a, b) => {
        console.log(a)
        const dateA = moment(a.itemCreationDate)
        const dateB = moment(b.itemCreationDate)

        return dateB.diff(dateA)
      })
    }

    setEbayData(sortedData)

    setFilterMenuAnchorEl(null)
  }

  const handleFilterButtonClick = event => {
    setFilterMenuAnchorEl(event.currentTarget)
  }

  const handleFilterMenuClose = () => {
    setFilterMenuAnchorEl(null)
  }

  const handleMarketPlaceChange = (event, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      productMarketPlace: value
    }))
  }

  const fetchEbayDefaultData = async () => {
    const savedResults = localStorage.getItem('searchResults')
    if (savedResults) {
      console.log(JSON.stringify(savedResults))
      setEbayData(JSON.parse(savedResults))
    } else {
      const r = await getMiranda(`/search?q=Gaming chairs&limit=10`)
      const result = r?.data?.itemSummaries || []
      setEbayData(result)
    }
  }

  const [searchTerm, setSearchTerm] = useState('');

  // Filter products based on the search term
  const filteredEbayData = ebayData.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchEbayDefaultData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const savedResults = localStorage.getItem('searchResults')
    if (savedResults) {
      setEbayData(JSON.parse(savedResults))
    }

    const savedFilters = localStorage.getItem('filters')
    if (savedFilters) {
      setFilters(JSON.parse(savedFilters))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('searchResults', JSON.stringify(ebayData))
  }, [ebayData])

  useEffect(() => {
    localStorage.setItem('filters', JSON.stringify(filters))
  }, [filters])

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFilters(prevFilters => ({
        ...prevFilters,
        [parent]: {
          ...prevFilters[parent],
          [child]: value
        }
      }))
    } else {
      setFilters(prevFilters => ({
        ...prevFilters,
        [name]: value
      }))
    }
  }

  const handleFindProducts = async () => {
    try {
      setEbayData([])
      setLoading(true)

      const r = await getTiktokProductByKeywords(filters.productSearch, 50)

      const result = r?.data?.videos || []
      console.log(r)

      setEbayData(result)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching products:', error)
      setLoading(false)
    }
  }

  const handleExportToExcel = () => {
    if (ebayData.length > 0) {
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(ebayData)
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')
      const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' })
      const excelData = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      saveAs(excelData, 'ebay_products.xlsx')
    }
  }

  return (
    <div>
      <Helmet>
        <title>Simppel - Search Winning Products</title>
      </Helmet>
      <Card style={{ padding: 10, marginTop: 50, height: 'auto' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FormControl component='fieldset'>
              <FormLabel component='legend' style={{ marginTop: 10, marginBottom: 10 }}>
                <Typography variant='h6' gutterBottom>
                  Tiktok Product Search
                </Typography>
              </FormLabel>
            </FormControl>
            {ebayData.length > 0 && (
              <Box>
                <Tooltip title='Export to Excel'>
                  <IconButton onClick={handleExportToExcel}>
                    <img src='/icons/excel-icon.png' alt='Excel Icon' style={{ width: '24px', height: '24px' }} />
                  </IconButton>
                </Tooltip>
                <IconButton
                  className={classes.filterButton}
                  onClick={handleFilterButtonClick}
                  aria-controls='filter-menu'
                  aria-haspopup='true'
                >
                  <FilterListIcon />
                </IconButton>
                <Menu
                  id='filter-menu'
                  anchorEl={filterMenuAnchorEl}
                  open={Boolean(filterMenuAnchorEl)}
                  onClose={handleFilterMenuClose}
                >
                  <MenuItem onClick={() => handleSortOptionChange('latest')} selected={sortOption === 'latest'}>
                    Latest Listings
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleSortOptionChange('highestToLowest')}
                    selected={sortOption === 'highestToLowest'}
                  >
                    Price - High to Low
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleSortOptionChange('lowestToHighest')}
                    selected={sortOption === 'lowestToHighest'}
                  >
                    Price - Low to High
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Box>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h1 style={{ marginRight: 'auto' }}>Product Filters</h1>
            </div>
            <Grid container spacing={2} style={{ marginTop: 5 }}>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label='Search Specific Product'
                  name='productSearch'
                  value={filters.productSearch}
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
                <Autocomplete
                  disablePortal
                  id='combo-box-demo'
                  options={top100Films.map(option => option.title)}
                  value={filters.productMarketPlace}
                  onInputChange={handleMarketPlaceChange}
                  sx={{ width: 300 }}
                  className={classes.textField}
                  renderInput={params => <TextField {...params} label={t('marketplace')} />}
                />
              </Grid>

              <Grid item>
                <TextField
                  label='Likes'
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
                <TextField
                  label='Views'
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
            </Grid>
          </>
        </CardContent>
      </Card>

      <div style={{ display: 'flex', marginTop: 50 }}>
      {/* Filter Sidebar */}
      <div style={{ flex: 1, marginRight: '20px' }}> {/* Adjust styling as needed */}
      <FilterSidebar setSearchTerm={setSearchTerm} />
      </div>

      {/* Product Card Grid */}
      <div style={{ flex: 4 }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </div>
        ) : (
          <ProductCardGrid products={filteredEbayData} itemsPerPage={12} />
        )}
      </div>
    </div>
  </div>
  )
}

export default SearchTiktok
