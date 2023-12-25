// @ts-nocheck

import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Collapse from '@mui/material/Collapse'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
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
    return (
      <Grid container justifyContent="center" style={{ paddingTop: '16px' }}>
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }
  
  
  const handleDetailPage = (productId: number) => {
    router.push(`/product/view/dropShipView/${productId}`)
  }

  return (
    <>
      <Grid container spacing={10}>
        {currentProducts.map(product => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card
              sx={{
                width: '100%', // Adjusted for dynamic width
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
                  <Typography variant='body2'>{product.category}</Typography>
                </CardContent>
              </div>

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
