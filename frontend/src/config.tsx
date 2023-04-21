// config.ts
// @ts-nocheck

import axios from 'axios'

// export const API_BASE_URL = 'http://localhost:8080/api'
export const API_BASE_URL = 'https://brash-income-production.up.railway.app/api'

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})
export default axiosClient
