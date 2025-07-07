// utils/axiosInstance.js
import axios from 'axios';

const axiosImageInstance = axios.create({
    baseURL: 'http://192.168.46.64:5050',
    timeout: 10000,
});



export default axiosImageInstance;
