// @ts-nocheck
import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import ChevronUp from 'mdi-material-ui/ChevronUp';
import ChevronDown from 'mdi-material-ui/ChevronDown';
import CircularProgress from '@mui/material/CircularProgress';

import useCustomApiHook from 'src/@core/hooks/useCustomApiHook';

const DropShippingCard = () => {
  const { get } = useCustomApiHook();
  const [dropshippingProducts, setDropshippingProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDropshippingProducts = async () => {
      try {
        const response = await get('/dropshipping');
        const data = response?.data || [];
        setDropshippingProducts(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dropshipping products:', error);
        setIsLoading(false);
      }
    };

    fetchDropshippingProducts();
  }, []);

  if (isLoading) {
    // Show a loading spinner while products are being fetched
    return <CircularProgress />;
  }

  const handleCardClick = (productId) => {
    setDropshippingProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, collapse: !product.collapse } : product
      )
    );
  };

  return (
    <Grid container spacing={5}>
      {dropshippingProducts.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product.id} style={{ marginTop: '20px', padding: '5px' }}>
          <Card>
            <CardMedia sx={{ aspectRatio: '16/9' }} image={product.image} />
            <CardContent>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                {product.title}
              </Typography>
              <Typography variant="body2">{product.price}</Typography>
            </CardContent>
            <CardActions className="card-action-dense">
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                sx={{ width: '100%' }}
              >
                <Button onClick={() => handleCardClick(product.id)}>Details</Button>
                <IconButton size="small" onClick={() => handleCardClick(product.id)}>
                  {product.collapse ? (
                    <ChevronUp sx={{ fontSize: '1.875rem' }} />
                  ) : (
                    <ChevronDown sx={{ fontSize: '1.875rem' }} />
                  )}
                </IconButton>
              </Grid>
            </CardActions>
            <Collapse in={product.collapse}>
              <Divider sx={{ margin: 0 }} />
              <CardContent>
                <Typography variant="body2" dangerouslySetInnerHTML={{ __html: product.description }} />
              </CardContent>
            </Collapse>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DropShippingCard;
