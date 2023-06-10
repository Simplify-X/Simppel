// @ts-nocheck

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
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
  const [collapse, setCollapse] = useState(false);
  const { get } = useCustomApiHook();
  const [dropshippingProducts, setDropshippingProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleClick = () => {
    setCollapse(!collapse);
  };

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

  return (
    <>
      {dropshippingProducts.map((product) => (
        <Card key={product.id}>
          <CardMedia sx={{ height: '14.5625rem' }} image={product.image} />
          <CardContent>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              {product.title}
            </Typography>
            <Typography variant="body2">{product.price}</Typography>
          </CardContent>
          <CardActions className="card-action-dense">
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Button onClick={handleClick}>Details</Button>
              <IconButton size="small" onClick={handleClick}>
                {collapse ? (
                  <ChevronUp sx={{ fontSize: '1.875rem' }} />
                ) : (
                  <ChevronDown sx={{ fontSize: '1.875rem' }} />
                )}
              </IconButton>
            </Box>
          </CardActions>
          <Collapse in={collapse}>
            <Divider sx={{ margin: 0 }} />
            <CardContent>
              <Typography variant="body2" dangerouslySetInnerHTML={{ __html: product.description }} />
            </CardContent>
          </Collapse>
        </Card>
      ))}
    </>
  );
};

export default DropShippingCard;

