import {createBrowserRouter, Outlet, type RouteObject} from "react-router-dom";
import {AppSkeleton} from "@/pages/AppSkeleton";
import {withAuth} from "@/auth/guards";

const basename = import.meta.env.MODE === "production"
    ? import.meta.env.VITE_PRODUCT_PATH
    : undefined;

function RootLayout() {
    return <Outlet/>;
}

export const routes: RouteObject[] = [
    {
        id:              "root",
        path:            "/",
        Component:       RootLayout,
        HydrateFallback: AppSkeleton,
        children:        [
            {
                index: true,
                lazy: async () => {
                    const mod = await import("@/pages/MaturityLevel/maturity-level.route");
                    return {
                        Component: mod.Component,
                        loader: mod.loader,
                        action: mod.action,
                    };
                },
            },

            // Группа защищённых маршрутов: все дети требуют авторизацию
            // loader возвращает объект пользователя; доступен через useRouteLoaderData("auth")
            {
                id: "auth",
                path: "",
                loader: withAuth({ requireAuth: true }),
                children: [
                    // Пример: /about только для авторизованных с ролью admin
                    {
                        path: "about",
                        loader: withAuth({ requireAuth: true, roles: ["admin"] }),
                        lazy: async () => {
                            const mod = await import("@/pages/About");
                            return { Component: mod.About };
                        },
                    },
                    // сюда можно добавлять другие защищённые маршруты:
                    // {
                    //   path: "profile",
                    //   lazy: async () => ({ Component: (await import("@/pages/Profile")).Profile }),
                    // }
                ],
            },
            // {
            //     path: '/about',
            //     lazy: async () => {
            //         const mod = await import("@/pages/About");
            //         return {Component: mod.About};
            //     },
            // },
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
