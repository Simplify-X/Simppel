const express = require('express');
const axios = require('axios');
const fetch = require('node-fetch');

const app = express();

// Token variables
let accessToken = null;
let tokenExpiration = null;

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

// Function to obtain a new access token
async function refreshEbayToken() {
  const auth = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

  const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`,
    },
    body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
  });

  const data = await response.json();

  if (!data.access_token) {
    throw new Error('Failed to refresh eBay token.');
  }

  // Save the access token and its expiration time
  accessToken = data.access_token;
  tokenExpiration = Date.now() + data.expires_in * 1000;
}

// Middleware to verify the API key
function verifyAPIKey(req, res, next) {
  const apiKey = req.headers.authorization;

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).send('Unauthorized');
  }

  next();
}

// Middleware to set CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// API route
app.get('/api/search', verifyAPIKey, async (req, res) => {
  const { q, limit = 10, freeShipping, minPrice, maxPrice, sort, location } = req.query;
  let url = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${q}&limit=${limit}`;

  if (freeShipping === 'true') {
    url += `&filter=deliveryCountry:US,deliveryOptions:FREE`;
  }

  if (minPrice || maxPrice) {
    url += `&filter=price:[${minPrice || '*'}..${maxPrice || '*'}],priceCurrency:USD`;
  }

  if (sort) {
    url += `&sort=${sort}`;
  }

  if (location) {
    url += `&filter=itemLocation:${location}`;
  }

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'An error occurred while fetching data from eBay API.' });
  }
});

app.get('/api/item/:itemId', verifyAPIKey, async (req, res) => {
  const { itemId } = req.params;

  try {
    const response = await axios.get(`https://api.ebay.com/buy/browse/v1/item/${itemId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'An error occurred while fetching item data from eBay API.' });
  }
});


// Refresh eBay access token initially
refreshEbayToken();

module.exports = app;
