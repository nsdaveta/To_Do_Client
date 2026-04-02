import axios from 'axios';

const api = axios.create({
    baseURL: 'https://to-do-server-1yuc.onrender.com/todos',
});

// Add a request interceptor to automatically add the auth token from localStorage
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
 