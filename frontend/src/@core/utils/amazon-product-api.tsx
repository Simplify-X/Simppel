// @ts-nocheck
import axios from 'axios';

export const getCategoryID = async (categoryName, domain) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    const apiUrl = 'https://api.rainforestapi.com/categories';
    const response = await axios.get(apiUrl, {
      params: {
        api_key: apiKey,
        domain: domain
      }
    });

    const categories = response.data.categories;
    const category = categories.find((c) => c.name === categoryName);

    if (category) {
      return category.id;
    } else {
      console.error(`Category '${categoryName}' not found.`);
      
      return null;
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getProductByCategory = async (
  category,
  minPrice,
  maxPrice,
  minReviews,
  minSales,
  domain
) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    const categoryID = await getCategoryID(category, domain);

    if (!categoryID) {
      return []; // Return an empty array if the category ID is not found
    }

    const apiUrl = 'https://api.rainforestapi.com/request';
    const params = {
      api_key: apiKey,
      type: 'category',
      amazon_domain: domain,
      category_id: categoryID,
      filters: {
        price: {
          min: minPrice,
          max: maxPrice
        },
        reviews: {
          min: minReviews
        },
        seller_rating: {
          min: minSales
        }
      }
    };

    const response = await axios.get(apiUrl, {
      params: params
    });

    // Handle the API response and extract the product data
    const products = response.data;

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductByASIN = async (asin, domain) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    const apiUrl = 'https://api.rainforestapi.com/request';
    const params = {
      api_key: apiKey,
      type: 'product',
      amazon_domain: domain,
      asin: asin
    };

    const response = await axios.get(apiUrl, {
      params: params
    });

    // Handle the API response and extract the product data
    const product = response.data;

    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const estimateSalesByASIN = async (asin, domain) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    const apiUrl = 'https://api.rainforestapi.com/request';
    const params = {
      api_key: apiKey,
      type: 'sales_estimation',
      amazon_domain: domain,
      asin: asin
    };

    const response = await axios.get(apiUrl, {
      params: params
    });

    // Handle the API response and extract the sales estimation
    const salesEstimation = response.data;

    return salesEstimation;
  } catch (error) {
    console.error('Error estimating sales:', error);
    throw error;
  }
};


