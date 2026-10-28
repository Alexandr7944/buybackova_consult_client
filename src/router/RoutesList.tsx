import {createBrowserRouter, Outlet, type RouteObject, useRouteLoaderData} from "react-router-dom";
import {AppSkeleton} from "@/pages/AppSkeleton";
import {withAuth} from "@/auth/guards";
import {Header} from "@/components/Header.tsx";
import ErrorBoundary from "@/pages/ErrorBoundary.tsx";
import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/hook.ts";
import {setUser, type User} from "@/store/useAuthStore.ts";
import {Container} from "@mui/material";
import {CLIENT_ROUTES, SEGMENTS} from "@/router/constants.ts";

const basename = import.meta.env.MODE === "production"
    ? import.meta.env.VITE_PRODUCT_PATH
    : undefined;

function RootLayout() {
    const user: User | undefined = useRouteLoaderData("auth");
    const savedUser = useAppSelector(state => state.useAuthStore.user);
    const dispatch = useAppDispatch();


    useEffect(() => {
        if (user && user?.username !== savedUser?.username) {
            dispatch(setUser(user));
        }
    }, [user]);

    return (
        <>
            <Header/>
            <Container maxWidth="xl">
                <Outlet/>
            </Container>
        </>
    );
}

export const routes: RouteObject[] = [
    {
        id:              "root",
        path:            CLIENT_ROUTES.HOME,
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
                        index: true,
                        lazy:  async () => {
                            const mod = await import("@/pages/audits/routes/auditable-objects.route.ts");
                            return {
                                Component: mod.Component,
                                loader:    mod.loader,
                                action:    mod.action,
                            };
                        },
                    },
                    {
                        path: SEGMENTS.AUDIT_LIST,
                        lazy: async () => {
                            const mod = await import("@/pages/audits/routes/audit-list.route");
                            return {
                                Component: mod.Component,
                                loader:    mod.loader,
                                action:    mod.action,
                            };
                        },
                    },
                    {
                        path:     CLIENT_ROUTES.AUDIT,
                        children: [
                            {
                                path: SEGMENTS.REPORT,
                                lazy: async () => {
                                    const mod = await import("@/pages/audits/routes/audit-item.route");
                                    return {
                                        Component: mod.Component,
                                        loader:    mod.loader,
                                        action:    mod.action,
                                    };
                                },
                            },
                            {
                                path: SEGMENTS.NEW_AUDIT,
                                lazy: async () => {
                                    const mod = await import("@/pages/audits/routes/new-audit.route");
                                    return {
                                        Component: mod.Component,
                                        loader:    mod.loader,
                                        action:    mod.action,
                                    };
                                },
                            },
                            {
                                path: SEGMENTS.EDITED_AUDIT,
                                lazy: async () => {
                                    const mod = await import("@/pages/audits/routes/audit-edit.route");
                                    return {
                                        Component: mod.Component,
                                        loader:    mod.loader,
                                        action:    mod.action,
                                    };
                                },
                            },
                        ]
                    },
                    {
                        path:     CLIENT_ROUTES.ADMIN,
                        loader:   withAuth({requireAuth: true, roles: ['admin']}),
                        children: [
                            {
                                path: SEGMENTS.COMPANIES,
                                lazy: async () => {
                                    const mod = await import('@/pages/admin/companies/companies.route');
                                    return {
                                        Component: mod.Component,
                                        loader:    mod.loader,
                                        action:    mod.action
                                    };
                                }
                            },
                            {
                                path: SEGMENTS.SETTINGS_REPORT,
                                lazy: async () => {
                                    const mod = await import('@/pages/admin/recategorize/index.route');
                                    return {
                                        Component: mod.Component,
                                        loader:    mod.loader,
                                        action:    mod.action
                                    };
                                }
                            }
                        ]
                    }
                ]
            },
            // {
            //     path: CLIENT_ROUTES.ABOUT,
            //     lazy: async () => {
            //         const mod = await import("@/pages/AboutUs");
            //         return {Component: mod.AboutUs};
            //     },
            // },
            {
                path: CLIENT_ROUTES.METHODOLOGY,
                lazy: async () => {
                    const mod = await import("@/pages/Methodology.tsx");
                    return {Component: mod.Methodology};
                },
            },
            {
                path: CLIENT_ROUTES.REGISTRATION,
                lazy: async () => {
                    const mod = await import("@/pages/Registration");
                    return {Component: mod.Registration};
                },
            },
            {
                path: CLIENT_ROUTES.LOGIN,
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
