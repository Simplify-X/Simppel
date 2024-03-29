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
import ProductCardGrid from './ebayProduct'
import { Input, useTheme } from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import moment from 'moment'
import { useUserData } from 'src/@core/hooks/useUserData'
import { useRouter } from 'next/router'
import Typography from '@mui/material/Typography'
import FilterSidebar from 'src/@core/components/ui/FilterSidebar'

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

const SearchEbay: React.FC = () => {
  const classes = useStyles()
  const { getMiranda, get } = useCustomApiHook()
  const { t } = useTranslation()
  const theme = useTheme()
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
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useUserData()

  const [userData, setUserData] = useState([])
  const router = useRouter()

  useEffect(() => {
    token && handleGetUser(token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const handleGetUser = async (token: string) => {
    const userData = await get(`/users/role`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    console.log(userData)
    userData?.data && setUserData(userData?.data)
  }

  const handleSortOptionChange = option => {
    setSortOption(option)

    const sortedData = [...ebayData]

    if (option === 'highestToLowest') {
      sortedData.sort((a, b) => b.price.value - a.price.value)
    } else if (option === 'lowestToHighest') {
      sortedData.sort((a, b) => a.price.value - b.price.value)
    } else if (option === 'latest') {
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

  const filteredEbayData = ebayData.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchEbayDefaultData = async () => {
    const savedResults = localStorage.getItem('searchResults')
    if (savedResults) {
      setEbayData(JSON.parse(savedResults))
    } else {
      const r = await getMiranda(`/search?q=Gaming chairs&limit=10`)
      const result = r?.data?.itemSummaries || []
      setEbayData(result)
    }
  }

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

      const r = await getMiranda(
        `/search?q=${filters.productSearch}&maxPrice=${filters?.price?.high}&minPrice=${filters?.price?.low}&limit=50`
      )
      const result = r?.data?.itemSummaries || []
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

  useEffect(() => {
    if (userData?.spyToolsEnabled) {
      if (!userData?.spyToolsEnabled) {
        router.push('/')
      }
    }
  }, [router, userData])

  return (
    <div>
      <Helmet>
        <title>Simppel - Search Winning Products</title>
      </Helmet>
      <Card style={{ padding: 10, marginTop: 50, height: 'auto' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FormControl component='fieldset'>
              <FormLabel component='legend' style={{ marginTop: 20 }}>
              <Typography variant='h6' gutterBottom>
                  Ebay Product Search
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
            <Grid container spacing={2}>
              <Grid item>
                <TextField
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
                  sx={{
                    width: 1000, // Adjust the width value as per your requirement
                    marginRight: '10px' // Add additional margin if needed
                  }}
                />
              </Grid>
              <Grid
                item
                sx={{
                  width: {
                    xs: '100%',
                    sm: '88%',
                    md: '30%',
                    xl: '20%'
                  }
                }}
              >
                <Box
                  sx={{
                    border: `1px solid ${theme?.palette?.mode === 'dark' ? '#54516d' : '#d3d3d3'}`,
                    borderRadius: '7px',
                    padding: '0px 0px 0px 12px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 5
                  }}
                >
                  <span
                    style={{
                      paddingBottom: {
                        xs: '0px',
                        md: '4px'
                      },
                      marginRight: '20px',
                      color: '#c6c6c6'
                    }}
                  >
                    Price:
                  </span>
                  <Box sx={{ paddingTop: '3%' }}>
                    <Input
                      placeholder='Low'
                      name='price.low'
                      value={filters.price?.low}
                      onChange={handleFilterChange}
                      className={classes.textField}
                      sx={{ width: '35%' }}
                      disableUnderline
                    />
                    <span style={{ margin: '0px 10px' }}>-</span>
                    <Input
                      placeholder='High'
                      name='price.high'
                      value={filters.price?.high}
                      onChange={handleFilterChange}
                      className={classes.textField}
                      sx={{
                        width: '45%'
                      }}
                      disableUnderline
                      endAdornment={
                        <InputAdornment position='end'>
                          <Tooltip title={t('enter_price_of_product')}>
                            <IconButton size='small'>
                              <HelpOutlineIcon style={{ color: 'gray' }} />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      }
                    />
                  </Box>
                </Box>
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
        <div style={{ flex: 1, marginRight: '20px' }}>
          {' '}
          {/* Adjust styling as needed */}
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

export default SearchEbay
