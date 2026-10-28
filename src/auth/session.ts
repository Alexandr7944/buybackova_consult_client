import {redirect} from "react-router-dom";
import {type User} from "@/store/useAuthStore.ts";
import apiClient from "@/shared/axios.ts";
import {CLIENT_ROUTES} from "@/router/constants.ts";

let cachedUser: User | null | undefined;

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

export async function clearSessionCache() {
    await apiClient.get<void>(CLIENT_ROUTES.LOGOUT);
    cachedUser = undefined;
    localStorage.removeItem('token');
    redirect(CLIENT_ROUTES.LOGIN);
}
