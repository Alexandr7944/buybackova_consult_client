import {useState} from "react";
import {Link as RouterLink, isRouteErrorResponse, useRouteError} from "react-router-dom";
import {Header} from "@/components/Header.tsx";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Divider from "@mui/material/Divider";
import CodeIcon from "@mui/icons-material/Code";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";

type Details = {
    title: string;
    description?: string;
    status?: number;
    raw?: unknown;
};

/**
 * ErrorBoundary page: Material UI version used as `errorElement` in React Router.
 * Light, friendly styling with helpful actions.
 */
export default function ErrorBoundary() {
    const routeError = useRouteError();
    const [showDetails, setShowDetails] = useState(false);

    const details: Details = parseError(routeError);

    const goBack = () => {
        if (window.history.length > 1) window.history.back();
        else window.location.href = "/";
    };

    const refresh = () => window.location.reload();

    return (
        <Stack
            direction="column"
            sx={{height: "100vh"}}
        >
            <Header/>
            <Box
                role="alert"
                aria-live="assertive"
                sx={{
                    flex:           1,
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    px:             2,
                    py:             {xs: 4, md: 8},
                    bgcolor:        (t) => t.palette.background.default,
                }}
            >
                <Paper elevation={1} sx={{p: {xs: 3, sm: 4}, maxWidth: 900, width: "100%"}}>
                    <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <CodeIcon color="primary"/>
                            <Typography variant="h6" sx={{fontWeight: 600}}>
                                Произошла ошибка
                            </Typography>
                        </Stack>

                        <Alert severity="error" variant="outlined">
                            <AlertTitle>
                                {details.title}
                                {typeof details.status === "number" ? (
                                    <Typography component="span" color="text.secondary" sx={{ml: 1}}>
                                        ({details.status})
                                    </Typography>
                                ) : null}
                            </AlertTitle>
                            {details.description || "Не удалось загрузить страницу или выполнить действие."}
                        </Alert>

                        <Stack direction={{xs: "column", sm: "row"}} spacing={2}>
                            <Button
                                variant="contained"
                                startIcon={<HomeIcon/>}
                                component={RouterLink}
                                to="/"
                            >
                                На главную
                            </Button>
                            <Button variant="outlined" startIcon={<ArrowBackIcon/>} onClick={goBack}>
                                Назад
                            </Button>
                            <Button variant="text" startIcon={<RefreshIcon/>} onClick={refresh}>
                                Обновить
                            </Button>
                            <Button
                                variant="text"
                                onClick={() => setShowDetails((v) => !v)}
                                sx={{ml: {sm: "auto"}}}
                                aria-expanded={showDetails}
                                aria-controls="error-details"
                            >
                                {showDetails ? "Скрыть детали" : "Показать детали"}
                            </Button>
                        </Stack>

                        {showDetails ? (
                            <Box id="error-details" sx={{mt: 1}}>
                                <Divider sx={{mb: 1}}/>
                                <Paper variant="outlined" sx={{p: 2, bgcolor: (t) => t.palette.grey[50]}}>
                                    <Typography
                                        component="pre"
                                        sx={{
                                            m:          0,
                                            whiteSpace: "pre-wrap",
                                            fontSize:   12,
                                            color:      (t) => t.palette.text.secondary,
                                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                                        }}
                                    >
                                        {formatRaw(routeError)}
                                    </Typography>
                                </Paper>
                            </Box>
                        ) : null}

                        <Typography variant="body2" color="text.secondary">
                            Если ошибка повторяется, опишите свои действия и пришлите скриншот — это поможет быстрее исправить проблему.
                        </Typography>
                    </Stack>
                </Paper>
            </Box>
        </Stack>
    );
}

function parseError(err: unknown): Details {
    if (isRouteErrorResponse(err)) {
        const status = err.status;
        const base: Details = {
            status,
            title:       statusTitle(status),
            description: err.statusText || (typeof err.data === "string" ? err.data : undefined),
            raw:         err,
        };
        if (!base.description && typeof err.data === "object" && err.data && "message" in err.data) {
            base.description = String((err.data as any).message);
        }
        return base;
    }

    if (err instanceof Error) {
        return {
            title:       "Что-то пошло не так",
            description: err.message,
            raw:         err.stack || err.message,
        };
    }

    if (typeof err === "string") {
        return {title: "Неожиданная ошибка", description: err, raw: err};
    }

    return {
        title:       "Неизвестная ошибка",
        description: "Произошла непредвиденная ошибка.",
        raw:         err,
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
