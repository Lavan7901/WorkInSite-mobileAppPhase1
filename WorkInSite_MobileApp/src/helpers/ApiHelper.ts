import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import {useLoading} from '../hook/useLoading';
import {AuthHelper} from './AuthHelper';

const useAPIHelper = (baseURL: string, withCredential: boolean = true) => {
  const {show, hide, Loader} = useLoading();
  let isLoading = true;

  // Create an Axios instance
  const api: AxiosInstance = axios.create({
    baseURL,
  });

  // Add a request interceptor to add access token to each request and show loading indicator
  api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    if (withCredential) {
      const accessToken = await AuthHelper.getAccessToken();
      if (accessToken) {
        config.headers._at = accessToken;
      }
    }
    if (isLoading) show();
    return config;
  });

  // Add a response interceptor to hide loading indicator
  api.interceptors.response.use(
    (response: AxiosResponse<any>) => {
      hide();
      return response;
    },
    error => {
      hide();
      throw error;
    },
  );

  // Define methods for making API requests
  const get = (
    url: string,
    setIsLoading?: boolean,
    config?: InternalAxiosRequestConfig,
  ) => {
    if (setIsLoading !== undefined) isLoading = setIsLoading;
    return api.get(url, config);
  };

  const post = (
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig,
  ) => {
    return api.post(url, data, config);
  };

  const put = (
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig,
  ) => {
    return api.put(url, data, config);
  };

  const deleteRequest = (url: string, config?: InternalAxiosRequestConfig) => {
    return api.delete(url, config);
  };

  // Return the API methods and Loader component
  return {
    get,
    post,
    put,
    delete: deleteRequest,
    Loader, // Make the Loader available to be used in components
  };
};

export {useAPIHelper};
