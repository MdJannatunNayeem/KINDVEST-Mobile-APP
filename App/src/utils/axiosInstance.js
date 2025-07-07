// utils/axiosInstance.js
import axios from 'axios';
import useAuthStore from '../store/authSotre'; // Make sure the path is correct

const axiosInstance = axios.create({
    baseURL: 'http://192.168.46.64:5050/api/',
    timeout: 10000,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
