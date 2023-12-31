import { useState, useEffect } from 'react';
import * as React from 'react';
import { Card, CardContent, CardMedia, Grid, Pagination, Typography, CircularProgress } from '@mui/material';
import { useStore } from 'src/store'
import { useRouter } from 'next/router'


interface Product {
  itemId: string;
  title: string;
  image: {
    imageUrl: string;
  };
  price: {
    value: number;
    currency: string;
  };
  description: string;
  condition: string;
  categories: {
    categoryName: string;
  };
  itemLocation: {
    country: string;
  };
  topRatedBuyingExperience: boolean;
  seller: {
    feedbackPercentage: string;
    feedbackScore: number;
    username: string;
  };
  additionalImages: Array<{
    imageUrl: string;
  }>;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(prev => !prev);
  };

  const getDescriptionText = () => {
    if (showFullDescription || product?.condition?.length <= 200) {
      return product?.condition;
    }

    return `${product?.condition?.slice(0, 200)}...`;
  };

  const router = useRouter();
  const { setProduct } = useStore();

  const handleClick = (product: Product) => {
    setProduct(product); // save the product to the store
    router.push(`/ebay/details/${product.itemId}`);
  };

  return (
    <a rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <Card
        sx={{ maxWidth: 350, height: '100%', borderRadius: '16px', marginBottom: '1rem', cursor: 'pointer' }}
        onClick={() => handleClick(product)}
      >
        <CardMedia
          component="img"
          height="200"
          image={product?.image?.imageUrl}
          alt="Product Image"
          sx={{
            height: '200px',
            objectFit: 'contain',
          }}
        />
        <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          <div>
            <Typography variant="h6" style={{ marginBottom: '1rem' }}>
              {product?.title}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Price: ${product?.price?.value}
            </Typography>
          </div>
          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            {getDescriptionText()}
            {product?.condition?.length > 200 && (
              <span style={{ cursor: 'pointer', color: 'blue' }} onClick={toggleDescription}>
                {showFullDescription ? 'Show Less' : 'Show More'}
              </span>
            )}
          </Typography>
        </CardContent>
      </Card>
    </a>
  );
            };  
interface ProductCardGridProps {
  products: Product[];
  itemsPerPage: number;
}

const ProductCardGrid: React.FC<ProductCardGridProps> = ({ products, itemsPerPage }) => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating an asynchronous data loading process
    const delay = Math.random() * 1000 + 1000;
    const timeout = setTimeout(() => {
      setLoading(false);
    }, delay);

    // Clean up the timeout when the component unmounts
    return () => clearTimeout(timeout);
  }, []);

  const totalItems = products?.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleProducts = products?.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Grid container spacing={5} justifyContent="center">
      {visibleProducts?.map((product) => (
        <Grid item key={product.itemId} xs={12} sm={6} md={5} lg={4} xl={3}>
          <div style={{ height: '100%' }}>
            <ProductCard product={product} />
          </div>
        </Grid>
      ))}
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          color="primary"
          shape="rounded"
        />
      </Grid>
    </Grid>
  );
};

export default ProductCardGrid;
