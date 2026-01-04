import axios from 'axios';
import {getBaseUrl} from "@/shared/api.ts";
import {clearSessionCache} from "@/auth/session.ts";

const apiClient = axios.create({
    baseURL:         getBaseUrl(),
    withCredentials: true, // analogous credentials: "include"
    headers:         {'Content-Type': 'application/json'},
});

// Globally manage token refresh (same logic as before)
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void; }> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// --- Request Interceptor: Add token to headers ---
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- Response Interceptor: Handle 401 errors and refresh token ---
apiClient.interceptors.response.use(
    // Success response block (2xx)
    response => response,

    // Этот блок вызывается для ошибок (4xx, 5xx)
    async (error: Error | any) => {
        const originalRequest = error.config;

        // If this is a 401 error, and it's not a retry (to avoid an infinite loop)
        if (
            error.response?.status === 401
            && error.response?.data?.message === 'Token expired'
            && !originalRequest._retry
        ) {

            // If a refresh is already in progress, add the request to the queue
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject});
                }).then(() => {
                    return apiClient(originalRequest); // Повторяем оригинальный запрос
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true; // Mark the request as a retry
            isRefreshing = true;

            try {
                // Refresh token
                const {data} = await axios.get(getBaseUrl() + '/auth/refresh', {withCredentials: true});
                const newToken = data.token;
                localStorage.setItem("token", newToken);

                processQueue(null, newToken);

                // Retry the original request with the new token
                return apiClient(originalRequest);

            } catch (refreshError) {
                processQueue(refreshError, null);
                await clearSessionCache();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
