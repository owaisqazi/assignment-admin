/* eslint-disable arrow-body-style */
import axios from 'axios';

// Create a new Axios instance
export const instance = axios.create({
  baseURL: `https://assignmenthelpapi.dev-sh.xyz/api/`,
});

instance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const Data = error?.response?.data.data?.errors;
        const {errors} = Data.errors;
        if (errors) {
            errors.map((e) => console.log(e));
        } else {
            console.log(Data.message);
        }
    return Promise.reject(error);
  }
);
