import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    res => res,
    err => {
        console.error('API error', err);
        return Promise.reject(err);
    }
);

export default api;