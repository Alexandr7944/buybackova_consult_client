import axios from 'axios';
import {getBaseUrl} from "@/shared/api.ts";
import {clearSessionCache} from "@/auth/session.ts";

// Создаем экземпляр Axios с базовыми настройками
const apiClient = axios.create({
    baseURL: getBaseUrl(), // Ваша функция getBaseUrl()
    withCredentials: true, // Аналог credentials: "include"
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- Глобальное управление обновлением (та же логика, что и раньше) ---
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

// --- Request Interceptor: Добавляем токен к каждому запросу ---
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- Response Interceptor: Обрабатываем 401 ошибку ---
apiClient.interceptors.response.use(
    // Этот блок вызывается для успешных ответов (2xx)
    response => response,

    // Этот блок вызывается для ошибок (4xx, 5xx)
    async (error: Error | any) => {
        const originalRequest = error.config;

        // Если это 401 ошибка и это не повторный запрос (чтобы избежать бесконечного цикла)
        if (error.response?.status === 401 && !originalRequest._retry) {

            // Если обновление уже идет, добавляем запрос в очередь
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => {
                    return apiClient(originalRequest); // Повторяем оригинальный запрос
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true; // Помечаем запрос как повторный
            isRefreshing = true;

            try {
                const refreshUrl = getBaseUrl() + '/auth/refresh';
                await axios.post(refreshUrl, {}, { withCredentials: true }); // Запрос на обновление

                // Предполагаем, что сервер возвращает новый токен в теле ответа
                // (или он может быть установлен в HttpOnly cookie, что еще лучше)
                const { data } = await axios.get(getBaseUrl() + '/auth/me', { withCredentials: true }); // Пример получения нового токена
                const newToken = data.token;
                localStorage.setItem("token", newToken);

                processQueue(null, newToken);

                // Повторяем оригинальный запрос, который упал с 401
                return apiClient(originalRequest);

            } catch (refreshError) {
                processQueue(refreshError, null);
                clearSessionCache(); // Вызываем вашу функцию разлогина
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Для всех остальных ошибок просто пробрасываем их дальше
        return Promise.reject(error);
    }
);

export default apiClient;
