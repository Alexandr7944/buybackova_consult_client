/**
   * Возвращает базовый URL API в зависимости от окружения.
   * В prod читаем VITE_SERVER_PATH, в dev — VITE_URL_DEV_API.
   */
  export function getBaseUrl(): string {
    const isProd = import.meta.env.MODE === "production";
    const base = isProd ? import.meta.env.VITE_SERVER_PATH : import.meta.env.VITE_URL_DEV_API;
    if (!base) {
      // Подсветить ошибку конфигурации окружения
      // Можно заменить на console.warn, если хотите «мягкое» поведение
      throw new Error("Base API URL is not configured. Set VITE_SERVER_PATH or VITE_URL_DEV_API.");
    }
    return String(base);
  }

  /**
   * Делает fetch на baseUrl + path, возвращает JSON или бросает Response с кодом ошибки.
   * Оставляет оригинальные заголовки content-type, чтобы роутер корректно обрабатывал ошибки.
   */
  export async function httpJson<T>(path: string, init: RequestInit & { signal?: AbortSignal } = {}): Promise<T> {
    const url = getBaseUrl() + path;
    const res = await fetch(url, init);

    if (!res.ok) {
      const contentType = res.headers.get("content-type") ?? "application/json";
      // Пытаемся отдать тело ошибки как есть, чтобы не терять детали
      const text = await res.text().catch(() => "");
      const body = text || JSON.stringify({ message: "Request failed" });
      throw new Response(body, { status: res.status, headers: { "Content-Type": contentType } });
    }

    // Если у ответа нет тела (204), вернём undefined as unknown as T
    if (res.status === 204) {
      return undefined as unknown as T;
    }

    return (await res.json()) as T;
  }
