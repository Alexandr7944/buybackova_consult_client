import { useState } from "react";
import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

type Details = {
  title: string;
  description?: string;
  status?: number;
  raw?: unknown;
};

/**
 * ErrorBoundary page: a full-screen page intended to be used as `errorElement`
 * in React Router. It handles:
 * - Unknown routes (404)
 * - Errors thrown in loaders/actions
 * - Manually thrown responses
 *
 * Usage (React Router):
 *   { path: '/', element: <RootLayout />, errorElement: <ErrorBoundary />, children: [...] }
 */
export default function ErrorBoundary() {
  const routeError = useRouteError();
  const [showDetails, setShowDetails] = useState(false);

  const details: Details = parseError(routeError);

  return (
    <div
      className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center px-4 py-12"
      role="alert"
      aria-live="assertive"
    >
      <div className="w-full max-w-2xl">
        {/* Logo slot (replace with your SVG/logo component if needed) */}
        <div className="mb-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h10M4 17h7" />
            </svg>
          </div>
          <div className="text-lg font-semibold tracking-tight">Ошибка</div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">
                {details.title}
                {typeof details.status === "number" ? (
                  <span className="ml-2 text-sm text-gray-400">({details.status})</span>
                ) : null}
              </h1>
              {details.description ? (
                <p className="mt-2 text-gray-300">{details.description}</p>
              ) : null}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition"
            >
              На главную
            </Link>
            <button
              type="button"
              onClick={() => window.history.length > 1 ? window.history.back() : (window.location.href = "/")}
              className="inline-flex items-center justify-center rounded-md border border-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-800 transition"
            >
              Назад
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-md border border-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-800 transition"
            >
              Обновить
            </button>

            {/* Toggle details */}
            <button
              type="button"
              onClick={() => setShowDetails((v) => !v)}
              className="ml-auto inline-flex items-center justify-center rounded-md border border-gray-700 px-3 py-2 text-xs font-medium text-gray-300 hover:bg-gray-800 transition"
              aria-expanded={showDetails}
              aria-controls="error-details"
            >
              {showDetails ? "Скрыть детали" : "Показать детали"}
            </button>
          </div>

          {showDetails ? (
            <div id="error-details" className="mt-4">
              <pre className="whitespace-pre-wrap text-xs text-gray-300 bg-gray-950/60 border border-gray-800 rounded-lg p-3 overflow-auto">
                {formatRaw(routeError)}
              </pre>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function parseError(err: unknown): Details {
  if (isRouteErrorResponse(err)) {
    const status = err.status;
    const base: Details = {
      status,
      title: statusTitle(status),
      description: err.statusText || (typeof err.data === "string" ? err.data : undefined),
      raw: err,
    };
    // Try to surface message from JSON if available
    if (!base.description && typeof err.data === "object" && err.data && "message" in err.data) {
      base.description = String((err.data as any).message);
    }
    return base;
  }

  if (err instanceof Error) {
    return {
      title: "Что-то пошло не так",
      description: err.message,
      raw: err.stack || err.message,
    };
  }

  if (typeof err === "string") {
    return { title: "Неожиданная ошибка", description: err, raw: err };
  }

  return {
    title: "Неизвестная ошибка",
    description: "Произошла непредвиденная ошибка.",
    raw: err,
  };
}

function statusTitle(status?: number): string {
  switch (status) {
    case 400:
      return "Некорректный запрос";
    case 401:
      return "Требуется авторизация";
    case 403:
      return "Доступ запрещён";
    case 404:
      return "Страница не найдена";
    case 408:
      return "Превышено время ожидания";
    case 409:
      return "Конфликт";
    case 422:
      return "Ошибка валидации";
    case 429:
      return "Слишком много запросов";
    case 500:
      return "Внутренняя ошибка сервера";
    case 502:
      return "Ошибка шлюза";
    case 503:
      return "Сервис временно недоступен";
    case 504:
      return "Таймаут шлюза";
    default:
      return "Произошла ошибка";
  }
}

function formatRaw(raw: unknown): string {
  if (raw == null) return "No details";
  if (typeof raw === "string") return raw;
  try {
    return JSON.stringify(raw, null, 2);
  } catch {
    return String(raw);
  }
}
