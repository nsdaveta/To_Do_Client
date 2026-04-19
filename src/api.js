import axios from 'axios';

const isLocal = window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1' || 
                window.location.protocol === 'tauri:';

const api = axios.create({
    baseURL: isLocal 
        ? 'http://localhost:3000/todos' 
        : 'https://to-do-server-1yuc.onrender.com/todos',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to automatically add the auth token from localStorage
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && token !== 'undefined' && token !== 'null') {
            // Use config.headers.set if it's an AxiosHeaders object (Axios 1.0+)
            if (config.headers.set) {
                config.headers.set('Authorization', `Bearer ${token}`);
            } else {
                config.headers.Authorization = `Bearer ${token}`;
            }
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
            // Clear auth data on 401
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('username');
            
            // Trigger authChange event for components (like Navbar) to react
            window.dispatchEvent(new Event('authChange'));
            
            // Redirect to login if not already there
            const currentHash = window.location.hash;
            if (currentHash !== '#/login' && currentHash !== '#/') {
                console.log('Session expired (401). Redirecting to login...');
                window.location.hash = '#/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;

 