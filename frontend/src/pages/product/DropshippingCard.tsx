// @ts-nocheck

import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Collapse from '@mui/material/Collapse'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CircularProgress from '@mui/material/CircularProgress'
import Pagination from '@mui/material/Pagination'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import { useRouter } from 'next/router'

interface Product {
  id: number
  image: string
  title: string
  price: string
  collapse: boolean
  description: string
}

const DropShippingCard: React.FC = () => {
  const router = useRouter()
  const { get } = useCustomApiHook()
  const [dropshippingProducts, setDropshippingProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 6
  const totalPages = Math.ceil(dropshippingProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = dropshippingProducts.slice(startIndex, endIndex)

  useEffect(() => {
    const fetchDropshippingProducts = async () => {
      try {
        const response = await get('/dropshipping')
        const data: Product[] = response?.data || []
        setDropshippingProducts(data)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching dropshipping products:', error)
        setIsLoading(false)
      }
    }

    fetchDropshippingProducts()
  }, [])

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  if (isLoading) {
    // Show a loading spinner while products are being fetched
    return <CircularProgress />
  }

  const handleCardClick = (productId: number) => {
    setDropshippingProducts(prevProducts =>
      prevProducts.map(product => (product.id === productId ? { ...product, collapse: !product.collapse } : product))
    )
  }

  const handleDetailPage = (productId: number) => {
    router.push(`/product/view/dropShipView/${productId}`)
  }

  return (
    <>
      <Grid container>
        {currentProducts.map(product => (
          <Grid item xs={12} sm={6} md={4} key={product.id} style={{ marginTop: '20px', padding: '5px' }}>
            <Card
              sx={{
                maxWidth: 450,
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onClick={() => handleDetailPage(product.id)}
            >
              <div>
                <CardMedia sx={{ aspectRatio: '16/9' }} image={product.image} />
                <CardContent>
                  <Typography variant='h6' sx={{ marginBottom: 2 }}>
                    {product.title}
                  </Typography>
                  <Typography variant='body2'>{product.price}</Typography>
                </CardContent>
              </div>

              <CardActions className='card-action-dense'>
                <Grid container justifyContent='space-between' alignItems='center' sx={{ width: '100%' }}>
                  <Button onClick={() => handleDetailPage(product.id)}>View Details</Button>
                  <IconButton size='small' onClick={() => handleCardClick(product.id)}>
                    {product.collapse ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Grid>
              </CardActions>

              <Collapse in={product.collapse}>
                <Divider sx={{ margin: 0 }} />
                <CardContent sx={{ overflowY: 'auto', maxHeight: 100 }}>
                  <Typography variant='body2' dangerouslySetInnerHTML={{ __html: product.description }} />
                </CardContent>
              </Collapse>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid item xs={12} container justifyContent='center' style={{ marginTop: '20px' }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, pageNumber) => handlePageChange(pageNumber)}
          color='primary'
        />
      </Grid>
    </>
  )
}

export default DropShippingCard
