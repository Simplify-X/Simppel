// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { CircularProgress, Button, Typography, Box, Card, CardMedia } from '@mui/material';
import Confetti from 'react-confetti';
import { keyframes } from '@emotion/react';
import { API_BASE_URL } from 'src/config';
import { useRouter } from 'next/router';
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const FetchDataComponent = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [countdown, setCountdown] = useState(15); // 30 seconds for countdown
  const router = useRouter();
  const { id } = router.query;
  const { put } = useCustomApiHook();

  const startCountdown = () => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(interval);

          return 0;
        }
        
        return prevCountdown - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/getImages/fetch/${id}`);
        const imageData = await response.json();
        setImageUrls(imageData.resources);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    if (id) {
      fetchImages();
    }
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/qr-code/single/${id}`);
      const jsonData = await response.json();
      setData(jsonData);
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        startCountdown();
      }, 5000);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const claimReward = async () => {
    try {
      const data = {
        claimed: true,
      };

      await put(`/qr-code/${id}`, data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  // Replace 'cloudinaryImageUrl' with your actual Cloudinary image URL
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cloudinaryImageUrl = 'https://res.cloudinary.com/your-cloud-name/image/upload/your-image.jpg';

  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      minHeight='100vh'
      sx={{ padding: 3, textAlign: 'center' }}
    >
      {showConfetti && <Confetti />}
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        sx={{ marginBottom: '2rem' }}
      >
        <Typography variant='h4' gutterBottom>
          Company Name
        </Typography>
        {imageUrls.length > 0 && (
        <img src={imageUrls[0].url} alt='Company Logo' style={{ maxWidth: '100px' }} />
          )}

      </Box>

      {!loading && !data && (
        <>
          <Typography variant='h4' gutterBottom>
            Club Instructions
          </Typography>
          <ul>
            <li>Instruction 1: Do this first</li>
            <li>Instruction 2: Then do this</li>
            <li>Instruction 3: Follow this step</li>
            <li>Instruction 4: Take this action</li>
            <li>Instruction 5: Finally, do that</li>
          </ul>
          <Button variant='contained' color='primary' onClick={fetchData}>
            Open Voucher
          </Button>
        </>
      )}

      {loading && <CircularProgress />}

      {!loading && data && (
        <>
          <Typography variant='h4' gutterBottom>
            Congratulations!
          </Typography>
          <Typography variant='h6'>You've won: {data.name ? data.name : 'A Special Prize'}</Typography>
          <Typography variant='subtitle1' sx={{ mb: 2 }}>
            {data.description ? data.description : 'Enjoy your reward!'}
          </Typography>
          <Typography variant='h5' color='secondary'>
            Voucher Value: {data.price ? `$${data.price}` : 'Priceless'}
          </Typography>
          {imageUrls.length > 0 && (
            <Card sx={{ maxWidth: 345, my: 2 }}>
              <CardMedia component='img' height='140' image={imageUrls[0].url} alt='Voucher Image' />
            </Card>
          )}
          <Box sx={{ mt: 3 }}>
            {countdown > 0 ? (
              <Typography
                variant='h4'
                color={countdown <= 10 ? 'error' : 'secondary'}
                sx={{
                  animation: `${pulse} 1s infinite`,
                  fontWeight: 'bold',
                }}
              >
                Claim within: {countdown} seconds!
              </Typography>
            ) : (
              <Typography variant='h4' color='error'>
                Time Expired!
              </Typography>
            )}
          </Box>
          {countdown > 0 && countdown <= 15 && (
            <Button
              variant='contained'
              color='error'
              size='large'
              sx={{ mt: 2, animation: `${pulse} 1s infinite` }}
              onClick={() => {
                claimReward();
              }}
            >
              Claim Now!
            </Button>
          )}
        </>
      )}
    </Box>
  );
};

FetchDataComponent.getLayout = (page) => page;

export default FetchDataComponent;
