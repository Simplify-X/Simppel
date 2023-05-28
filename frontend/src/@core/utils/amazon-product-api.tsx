// @ts-nocheck
import axios from 'axios'


export const getCategoryID = async (categoryName, domain) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY
      const apiUrl = 'https://api.rainforestapi.com/categories';
      const response =  await axios.get(apiUrl, {
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
  

  export const getProductByCategory = async (category, minPrice, maxPrice, minReviews, minSales, domain) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY
  
      const categoryID = await getCategoryID(category, domain);
      if (!categoryID) {
        return []; // Return an empty array if the category ID is not found
      }
  
      const apiUrl = 'https://api.rainforestapi.com/request';
      const params = {
        api_key: apiKey,
        domain: domain,
        type: 'category',
        amazon_domain: domain,
        category_id: categoryID,
        min_price: minPrice,
        max_price: maxPrice,
        min_reviews: minReviews,
        min_seller_rating: minSales
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