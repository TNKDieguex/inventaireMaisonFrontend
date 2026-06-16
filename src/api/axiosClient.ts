import axios, {AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig} from "axios";


const axiosClient: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
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
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        console.error('API Error: ', error.response?.data || error.message);

        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;