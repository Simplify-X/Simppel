// src/hooks/useAuthenticatedFetch.js
// @ts-nocheck
import { useState } from 'react';
import Cookies from 'js-cookie';

const useAuthenticatedFetch = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = Cookies.get('token');

  const fetchData = async (url) => {
    try {
      if (!token) {
        throw new Error('Token not found');
      }
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Error fetching data');
      }
      const data = await response.json();
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setData([]);
      setIsLoading(false);
    }
  };

  return [data, isLoading, fetchData];
};


export default useAuthenticatedFetch;
