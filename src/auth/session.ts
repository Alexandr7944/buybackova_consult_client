import {httpJson} from "@/shared/api";
import {redirect} from "react-router-dom";
import {type User} from "@/store/useAuthStore.ts";

let cachedUser: User | null | undefined; // undefined = не загружен; null = гость

/**
 * Получить текущего пользователя. Возвращает null, если не авторизован.
 * Делает один запрос и кеширует результат; учитывает AbortSignal.
 */
export async function getCurrentUser(signal?: AbortSignal): Promise<User | null> {
    if (cachedUser !== undefined) return cachedUser;

    try {
        const res = await httpJson<User | null>('/auth/profile', {signal,});
        cachedUser = res && Object.keys(res || {}).length > 0 ? res : null;
        return cachedUser;
    } catch (err) {
        console.log(err)
        // В сетевую ошибку оставим пользователя гостем
        cachedUser = null;
        return cachedUser;
    }
}

/** Сброс кеша сессии — используйте после логина/логаута/обновления профиля. */
export function clearSessionCache() {
    cachedUser = undefined;
    localStorage.removeItem('token');
    redirect('/auth/login');
}
