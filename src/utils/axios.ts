import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const service = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000,
});

service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // do something with request data
        return config;
    },
    (error: any) => Promise.reject(error),
);

service.interceptors.response.use(
    (response: AxiosResponse) => {
        // do something with response data
        return response.data;
    },
    (error: any) => {
        // do something with err data
        return Promise.reject(error);
    },
);

export default service;
