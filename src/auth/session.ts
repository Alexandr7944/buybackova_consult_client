import {redirect} from "react-router-dom";
import {type User} from "@/store/useAuthStore.ts";
import apiClient from "@/shared/axios.ts";

let cachedUser: User | null | undefined; // undefined = не загружен; null = гость

/**
 * Получить текущего пользователя. Возвращает null, если не авторизован.
 * Делает один запрос и кеширует результат; учитывает AbortSignal.
 */
export async function getCurrentUser(signal?: AbortSignal): Promise<User | null> {
    if (cachedUser) return cachedUser;

    try {
        const {data: res} = await apiClient.get<User | null>('/auth/profile', {signal});
        cachedUser = res?.username ? res : null;
        return cachedUser;
    } catch (err) {
        console.log(err);
        cachedUser = null;
        return cachedUser;
    }
}

/** Сброс кеша сессии — используйте после логина/логаута/обновления профиля. */
export async function clearSessionCache() {
    await apiClient.get<void>('/auth/logout');
    cachedUser = undefined;
    localStorage.removeItem('token');
    redirect('/auth/login');
}
