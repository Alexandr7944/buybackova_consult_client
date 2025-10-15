import {getBaseUrl} from "@/shared/api";

export type User = {
    id: string;
    email: string;
    roles?: string[];
    // добавьте поля профиля по необходимости
};

let cachedUser: User | null | undefined; // undefined = не загружен; null = гость

/**
 * Получить текущего пользователя. Возвращает null, если не авторизован.
 * Делает один запрос и кеширует результат; учитывает AbortSignal.
 */
export async function getCurrentUser(signal?: AbortSignal): Promise<User | null> {
    if (cachedUser !== undefined) return cachedUser;

    const url = getBaseUrl() + "/auth/me";
    try {
        const res = await fetch(url, {
            method:      "GET",
            credentials: "include", // если используете cookie-сессию
            signal,
        });

        if (res.status === 401) {
            cachedUser = null;
            return cachedUser;
        }

        if (!res.ok) {
            // Не авторизовано vs другие ошибки — для простоты считаем гостем
            cachedUser = null;
            return cachedUser;
        }

        cachedUser = (await res.json()) as User;
        return cachedUser;
    } catch {
        // В сетевую ошибку оставим пользователя гостем
        cachedUser = null;
        return cachedUser;
    }
}

/** Сброс кеша сессии — используйте после логина/логаута/обновления профиля. */
export function clearSessionCache() {
    cachedUser = undefined;
}
