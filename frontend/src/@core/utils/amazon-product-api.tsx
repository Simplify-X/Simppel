// @ts-nocheck
import axios from 'axios'
import { toast } from 'react-toastify'
import categories from './amazon-categories-data'

interface ICategory {
  id: string
  name: string
  has_children: boolean
  is_root: boolean
  path: string
}

export const getCategoryID = async (categoriesName, domain) => {
  try {
    // const apiKey = process.env.NEXT_PUBLIC_API_KEY
    // const apiUrl = 'https://api.rainforestapi.com/categories'
    // const response = await axios.get(apiUrl, {
    //   params: {
    //     api_key: apiKey,
    //     domain: domain
    //   }
    // })

    // const categories = response.data.categories
    const category = categories.filter((c: ICategory) => {
      return categoriesName.includes(c.name)
    })

    if (category) {
      return category.map(item => item.id)
    } else {
      console.error(`Category '${categoryName}' not found.`)

      return null
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

export const getProductByCategory = async (category, minPrice, maxPrice, minReviews, minSales, domain) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY
    const categoryID = await getCategoryID(category, domain)

    if (!categoryID) {
      toast.error(`Category ${category} not found.`, { autoClose: 2000 })
      return [] // Return an empty array if the category ID is not found
    }

    const apiUrl = 'https://api.rainforestapi.com/request'
    const params = {
      api_key: apiKey,
      type: 'category',
      amazon_domain: domain,
      category_id: categoryID,
      page: 2,
      max_page: 5,
      limit: 100,
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
    }

    const response = await axios.get(apiUrl, {
      params: params
    })

    // Handle the API response and extract the product data
    const products = response.data

    return products
  } catch (error) {
    toast.error(error?.response?.data?.request_info?.message)
    console.error('Error fetching products:', error)
    throw error
  }
}

export const getProductByASIN = async (asin, domain) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY
    const apiUrl = 'https://api.rainforestapi.com/request'
    const params = {
      api_key: apiKey,
      type: 'product',
      amazon_domain: domain,
      asin: asin
    }

    const response = await axios.get(apiUrl, {
      params: params
    })

    // Handle the API response and extract the product data
    const product = response.data

    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}

export const estimateSalesByASIN = async (asin, domain) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY
    const apiUrl = 'https://api.rainforestapi.com/request'
    const params = {
      api_key: apiKey,
      type: 'sales_estimation',
      amazon_domain: domain,
      asin: asin
    }

    const response = await axios.get(apiUrl, {
      params: params
    })

    // Handle the API response and extract the sales estimation
    const salesEstimation = response.data

    return salesEstimation
  } catch (error) {
    console.error('Error estimating sales:', error)
    throw error
  }
}
