import axios, {AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig} from "axios";
import type {ErreurResponseDto} from "../features/auth/types";


const axiosClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

axiosClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) =>{
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError<ErreurResponseDto>) => {
        console.error('API Error: ', error.response?.data?.message || error.message);

        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            if (!error.config?.url?.includes('/utilisateurs/connexion')) {
                localStorage.removeItem('token');
                sessionStorage.clear();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;