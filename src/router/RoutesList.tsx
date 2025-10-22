import {createBrowserRouter, Outlet, type RouteObject} from "react-router-dom";
import {AppSkeleton} from "@/pages/AppSkeleton";
import {withAuth} from "@/auth/guards";
import {Header} from "@/components/Header.tsx";
import ErrorBoundary from "@/pages/ErrorBoundary.tsx";

const basename = import.meta.env.MODE === "production"
    ? import.meta.env.VITE_PRODUCT_PATH
    : undefined;

function RootLayout() {
    return (
        <>
            <Header/>
            <div className="container">
                <Outlet/>
            </div>
        </>
    );
}

export const routes: RouteObject[] = [
    {
        id:              "root",
        path:            "/",
        Component:       RootLayout,
        HydrateFallback: AppSkeleton,
        errorElement:    <ErrorBoundary/>,
        children:        [

            // Группа защищённых маршрутов: все дети требуют авторизацию
            // loader возвращает объект пользователя; доступен через useRouteLoaderData("auth")
            {
                id:       "auth",
                path:     "",
                loader:   withAuth({requireAuth: true, roles: ['user', 'admin']}),
                children: [
                    {
                        index: true,
                        lazy:  async () => {
                            const mod = await import("@/pages/MaturityLevel/maturity-level.route");
                            return {
                                Component: mod.Component,
                                loader:    mod.loader,
                                action:    mod.action,
                            };
                        },
                    },
                ],
            },
            {
                path: "/about",
                lazy: async () => {
                    const mod = await import("@/pages/About");
                    return {Component: mod.About};
                },
            },
            {
                path: '/auth',
                lazy: async () => {
                    const mod = await import("@/pages/Authorisation");
                    return {Component: mod.Authorisation};
                },
            },
            {
                path: "*",
                lazy: async () => {
                    const mod = await import("@/pages/NotFound");
                    return {Component: mod.NotFound};
                },
            },
        ],
    },
];

export const router = createBrowserRouter(routes, {basename});
