import type { LoaderFunctionArgs } from "react-router-dom";
import { getCurrentUser, type User } from "@/auth/session";
import { redirectResponse } from "@/router/redirect";

type Loader = (args: LoaderFunctionArgs) => Promise<unknown> | unknown;

export type AuthOptions = {
  requireAuth?: boolean;
  roles?: string[]; // хотя бы одна из ролей должна совпасть
  // можно расширить, например, strategy: "all" | "any"
};

/**
 * Оборачивает существующий loader проверками авторизации/ролей.
 * - Если requireAuth=true и пользователь гость — редирект на /login?redirect=<current_path>
 * - Если указаны roles и ни одна не совпала — 403 Forbidden
 * - Возвращает данные существующего loader или, если его нет, возвращает объект пользователя
 */
export function withAuth(options: AuthOptions, next?: Loader): Loader {
  return async (args: LoaderFunctionArgs) => {
    debugger;
    const { request } = args;
    const user = await getCurrentUser(request.signal);

    // Требуется авторизация
    if (options.requireAuth && !user) {
      const url = new URL(request.url);
      const redirectUrl = new URL("/login", url.origin);
      redirectUrl.searchParams.set("redirect", url.pathname + url.search);
      throw redirectResponse(redirectUrl.pathname + redirectUrl.search, 302);
    }

    // Проверка ролей (если заданы)
    if (options.roles && options.roles.length > 0) {
      const roles = (user?.roles ?? []).map((r) => r.toLowerCase());
      const required = options.roles.map((r) => r.toLowerCase());
      const hasAny = required.some((r) => roles.includes(r));
      if (!hasAny) {
        throw new Response("Forbidden", { status: 403 });
      }
    }

    // Выполнить исходный loader, если он есть
    if (typeof next === "function") {
      return next(args);
    }

    // По умолчанию вернём пользователя, чтобы дети могли получить его через useRouteLoaderData(parentId)
    return user as User | null;
  };
}
