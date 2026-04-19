import axios from 'axios';

const isLocal = window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1' || 
                window.location.protocol === 'tauri:';
const api = axios.create({
    baseURL: isLocal 
        ? 'http://localhost:3000/todos' 
        : 'https://to-do-server-1yuc.onrender.com/todos',
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

// Add a response interceptor to handle global errors (like 401 Unauthorized)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('username');
            // Trigger authChange event for components to react
            window.dispatchEvent(new Event('authChange'));
            
            // If in a browser/Tauri environment with window.location
            if (window.location.hash !== '#/login') {
                window.location.hash = '#/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
 