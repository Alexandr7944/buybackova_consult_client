export function getBaseUrl(): string {
    const isProd = import.meta.env.MODE === "production";
    const base = isProd ? import.meta.env.VITE_SERVER_PATH : import.meta.env.VITE_DEV_SERVER_PATH;
    if (!base) {
        // Подсветить ошибку конфигурации окружения
        // Можно заменить на console.warn, если хотите «мягкое» поведение
        throw new Error("Base API URL is not configured. Set VITE_SERVER_PATH or VITE_DEV_SERVER_PATH.");
    }
    return String(base);
}
