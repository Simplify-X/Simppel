// @ts-nocheck
import React, { useState } from 'react';
import { Button, TextField, Grid, Dialog, DialogContent, DialogContentText, LinearProgress } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';

const WebScraper = ({ onScrapedData }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {t} = useTranslation();

  const scrapeWebsite = async () => {
    setIsLoading(true);

    try {
      if (!url) {
        toast.error('Invalid or Empty URL');
      } else {
        const response = await fetch(`https://api.scraperapi.com?api_key=6ce016c1096024cb494e0053ff587022&url=${url}`);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const images = Array.from(doc.querySelectorAll('img')).map(img => img.src);
        const title = doc.querySelector('title')?.innerText || '';
        const description = doc.querySelector('meta[id="description"]')?.content || '';
        const product = doc.querySelector('[data-testid="product-title"]')?.innerText || '';

        onScrapedData({ images, title, description, product });
      }
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };


  return (
    <>
    <Grid item xs={12}>
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert severity="info">
        <AlertTitle>{t('web_scraper_alert')}</AlertTitle>
      </Alert>
    </Stack>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label={t('web_scraper_url')}
          value={url}
          onChange={event => setUrl(event.target.value)}
        />
        <Button variant='contained' onClick={scrapeWebsite} style={{marginTop: '10px'}}>
        {t('import_data')}
        </Button>
      </Grid>
      <Dialog open={isLoading}>
        <DialogContent>
          <DialogContentText>
            {t('scraping_data')}
          </DialogContentText>
          <LinearProgress color='primary' />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WebScraper;
