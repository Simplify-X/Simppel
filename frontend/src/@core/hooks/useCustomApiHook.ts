import { useState } from 'react'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import axiosClient from 'src/config'

interface Response<T> {
  data: T
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
}

interface UseCustomApiHookProps<T> {
  response: Response<T> | null
  loading: boolean
  error: Error | null
  get: (url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse<T, any> | undefined>
  post: (url: string, data?: any, config?: AxiosRequestConfig) => Promise<void>
  put: (url: string, data?: any, config?: AxiosRequestConfig) => Promise<void>
  del: (url: string, config?: AxiosRequestConfig) => Promise<void>
}

function useCustomApiHook<T>(): UseCustomApiHookProps<T> {
  const [response, setResponse] = useState<Response<T> | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const handleResponse = (res: Response<T>) => {
    setResponse(res)
    setLoading(false)
  }

  const handleError = (err: Error | unknown) => {
    setError(err as null)
    setLoading(false)
  }

  const get = async (url: string, config?: AxiosRequestConfig) => {
    setLoading(true)
    try {
      const res = await axiosClient.get<T>(url, config)
      
      return res
    } catch (err) {
      handleError(err)
    }
  }

  const post = async (url: string, data?: any, config?: AxiosRequestConfig) => {
    setLoading(true);
    try {
      const res = await axiosClient.post<T>(url, data, config);
      handleResponse(res);
      
      return res; // Return the response
    } catch (err) {
      handleError(err);
    }
  };
  

  const put = async (url: string, data?: any, config?: AxiosRequestConfig) => {
    setLoading(true)
    try {
      const res = await axiosClient.put<T>(url, data, config)
      handleResponse(res)
    } catch (err) {
      handleError(err)
    }
  }

  const del = async (url: string, config?: AxiosRequestConfig) => {
    setLoading(true)
    try {
      const res = await axiosClient.delete<T>(url, config)
      handleResponse(res)
    } catch (err) {
      handleError(err)
    }
  }

  return {
    response,
    loading,
    error,
    get,
    post,
    put,
    del
  }
}

export default useCustomApiHook
