// config.ts
// @ts-nocheck

import axios from 'axios'

// export const API_BASE_URL = 'http://localhost:8080/api';
export const API_MIRANDA = process.env.NEXT_PUBLIC_MIRANDA

const axiosClientEbay = axios.create({
  baseURL: API_MIRANDA,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': '802b55f2-c560-433f-99dc-ae5826ac75fb',

  }
})
export default axiosClientEbay
