/**
 * Универсальный редирект из loader/action через Response.
 * Router распознаёт 3xx и перенаправляет на Location.
 */
export function redirectResponse(to: string, status = 302): Response {
    return new Response(null, { status, headers: { Location: to } });
}
