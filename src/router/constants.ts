/**
 * Относительные фрагменты путей.
 * Нужны только для описания вложенных маршрутов в src/router/RoutesList.tsx
 * и для сборки абсолютных путей в CLIENT_ROUTES.
 */
export const SEGMENTS = {
    AUDIT_LIST:      'object/:id',
    REPORT:          ':id',
    NEW_AUDIT:       ':objectId/create',
    EDITED_AUDIT:    ':id/edit',
    COMPANIES:       'companies',
    SETTINGS_REPORT: 'recategorize',
} as const;

/**
 * Абсолютные пути клиентского приложения.
 * Подходят и для `path` в роутере, и для навигации.
 * Пути с параметрами собираются через buildPath(CLIENT_ROUTES.X, {...}).
 */
export const CLIENT_ROUTES = {
    HOME: '/',

    AUDIT_LIST:   `/${SEGMENTS.AUDIT_LIST}`,
    AUDIT:        '/audit',
    REPORT:       `/audit/${SEGMENTS.REPORT}`,
    NEW_AUDIT:    `/audit/${SEGMENTS.NEW_AUDIT}`,
    EDITED_AUDIT: `/audit/${SEGMENTS.EDITED_AUDIT}`,

    ADMIN:           '/admin',
    COMPANIES:       `/admin/${SEGMENTS.COMPANIES}`,
    SETTINGS_REPORT: `/admin/${SEGMENTS.SETTINGS_REPORT}`,

    REGISTRATION: '/auth/registration',
    LOGIN:        '/auth/login',
    LOGOUT:       '/auth/logout',

    ABOUT:       '/about',
    METHODOLOGY: '/methodology',
} as const;

export type RouteParams = Record<string, string | number>;

/**
 * Подставляет параметры в шаблон пути: buildPath(CLIENT_ROUTES.REPORT, {id}) -> '/audit/42'.
 * Бросает ошибку, если параметр не передан, — чтобы опечатка не превращалась в битую ссылку.
 */
export function buildPath(template: string, params: RouteParams): string {
    return template.replace(/:([A-Za-z0-9_]+)/g, (_placeholder, key: string) => {
        const value = params[key];

        if (value === undefined) {
            throw new Error(`buildPath: не передан параметр "${key}" для шаблона "${template}"`);
        }

        return encodeURIComponent(String(value));
    });
}
