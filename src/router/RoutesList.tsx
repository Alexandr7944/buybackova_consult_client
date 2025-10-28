import {createBrowserRouter, Outlet, type RouteObject, useRouteLoaderData} from "react-router-dom";
import {AppSkeleton} from "@/pages/AppSkeleton";
import {withAuth} from "@/auth/guards";
import {Header} from "@/components/Header.tsx";
import ErrorBoundary from "@/pages/ErrorBoundary.tsx";
import {useAppDispatch} from "@/hooks/hook.ts";
import {setUser, type User} from "@/store/useAuthStore.ts";

const basename = import.meta.env.MODE === "production"
    ? import.meta.env.VITE_PRODUCT_PATH
    : undefined;

function RootLayout() {
    const dispatch = useAppDispatch();
    const user: User | undefined = useRouteLoaderData("auth");
    if (user)
        dispatch(setUser(user));

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
            {
                id:       "auth",
                path:     "",
                loader:   withAuth({requireAuth: true, roles: ['user', 'admin']}),
                children: [
                    {
                        // objects list by owner
                        index: true,
                        lazy:  async () => {
                            const mod = await import("@/pages/auditable-objects/auditable-objects.route.ts");
                            return {
                                Component: mod.Component,
                                loader:    mod.loader,
                                action:    mod.action,
                            };
                        },
                    },
                    {
                        //audits list by object
                        path: '/object/:id',
                        lazy: async () => {
                            const mod = await import("@/pages/audits/audit-list.route");
                            return {
                                Component: mod.Component,
                                loader:    mod.loader,
                                // action:    mod.action, // TODO: копирование аудитов
                            };
                        },
                    },
                    {
                        // show audit item by id
                        path: '/audit/:id',
                        lazy: async () => {
                            const mod = await import("@/pages/audit-item/audit-item.route");
                            return {
                                Component: mod.Component,
                                loader:    mod.loader,
                                // action:    mod.action, // TODO: добавления описания для графиков
                            };
                        },
                    },
                    {
                        // create new audit by object id
                        path: '/audit/:objectId/create',
                        lazy: async () => {
                            const mod = await import("@/pages/new-audits/new-audit.route");
                            return {
                                Component: mod.Component,
                                loader:    mod.loader,
                                action:    mod.action,
                            };
                        },
                    },
                    {
                        // edit audit by id
                        path: '/audit/:id/edit',
                        lazy: async () => {
                            const mod = await import("@/pages/audit-edit/audit-edit.route");
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
                path: '/auth/registration',
                lazy: async () => {
                    const mod = await import("@/pages/Registration");
                    return {Component: mod.Registration};
                },
            },
            {
                path: '/auth/login',
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
