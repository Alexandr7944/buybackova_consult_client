import type {LoaderFunctionArgs} from "react-router-dom";
import {getCurrentUser} from "@/auth/session";
import {redirectResponse} from "@/router/redirect";
import type {User} from "@/store/useAuthStore.ts";
import {CLIENT_ROUTES} from "@/router/constants.ts";

type Loader = (args: LoaderFunctionArgs) => Promise<unknown> | unknown;

export type AuthOptions = {
    requireAuth?: boolean;
    roles?: string[];
};

export function withAuth(options: AuthOptions, next?: Loader): Loader {
    return async (args: LoaderFunctionArgs) => {
        const {request} = args;
        const user = await getCurrentUser(request.signal);

        if (options.requireAuth && !user) {
            const url = new URL(request.url);
            const redirectUrl = new URL(CLIENT_ROUTES.LOGIN, url.origin);
            redirectUrl.searchParams.set("redirect", url.pathname + url.search);
            throw redirectResponse(redirectUrl.pathname + redirectUrl.search, 302);
        }

        if (options.roles && options.roles.length > 0) {
            const roles = (user?.roles ?? []).map((r) => r.toLowerCase());
            const required = options.roles.map((r) => r.toLowerCase());
            const hasAny = required.some((r) => roles.includes(r));
            if (!hasAny) {
                throw new Response("Отказано в доступе, запросите расширение прав", {status: 403});
            }
        }

        if (typeof next === "function") {
            return next(args);
        }

        return user as User | null;
    };
}
