import axios from 'axios';
const api = axios.create({
    baseURL: 'https://reservex.onrender.com/api',
    // baseURL: 'http://localhost:5000/api',
    withCredentials: true, // IMPORTANT: Allows sending/receiving cookies
});

// Request interceptor to attach token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Call the refresh endpoint (this sends the cookie automatically)
                const res = await axios.post('https://reservex.onrender.com/api/auth/refresh', {}, {
                    withCredentials: true
                });

                const { accessToken } = res.data;
                localStorage.setItem('token', accessToken); // Save new token

                // Update the header and retry the original request
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, clear local state but do NOT redirect here —
                // let the app's ProtectedRoute/checkAuth handle the redirect
                // to avoid infinite reload loops.
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;