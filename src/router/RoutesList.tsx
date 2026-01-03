import {createBrowserRouter, Outlet, type RouteObject, useRouteLoaderData} from "react-router-dom";
import {AppSkeleton} from "@/pages/AppSkeleton";
import {withAuth} from "@/auth/guards";
import {Header} from "@/components/Header.tsx";
import ErrorBoundary from "@/pages/ErrorBoundary.tsx";
import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/hook.ts";
import {logout, setUser, type User} from "@/store/useAuthStore.ts";
import {Container} from "@mui/material";

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
        } else if (!user) {
            dispatch(logout());
        }
    }, [user]);

    return (
        <>
            <Header/>
            <Container maxWidth="lg">
                <Outlet/>
            </Container>
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
                            const mod = await import("@/pages/audits/auditable-objects.route.ts");
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
                                action:    mod.action,
                            };
                        },
                    },
                    {
                        path:     '/audit',
                        children: [
                            {
                                // show audit item by id
                                path: ':id',
                                lazy: async () => {
                                    const mod = await import("@/pages/audits/audit-item.route");
                                    return {
                                        Component: mod.Component,
                                        loader:    mod.loader,
                                        action:    mod.action,
                                    };
                                },
                            },
                            {
                                // create new audit by object id
                                path: ':objectId/create',
                                lazy: async () => {
                                    const mod = await import("@/pages/audits/new-audit.route");
                                    return {
                                        Component: mod.Component,
                                        loader:    mod.loader,
                                        action:    mod.action,
                                    };
                                },
                            },
                            {
                                // edit audit by id
                                path: ':id/edit',
                                lazy: async () => {
                                    const mod = await import("@/pages/audits/audit-edit.route");
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
                        path:     '/admin',
                        loader:   withAuth({requireAuth: true, roles: ['admin']}),
                        children: [
                            {
                                path: 'settings',
                                lazy: async () => {
                                    const mod = await import('@/pages/admin/settings.route');
                                    return {
                                        Component: mod.Component,
                                        loader:    mod.loader,
                                        action:    mod.action
                                    };
                                }
                            },
                        ]
                    }
                ]
            },
            // {
            //     path: "/about",
            //     lazy: async () => {
            //         const mod = await import("@/pages/AboutUs");
            //         return {Component: mod.AboutUs};
            //     },
            // },
            {
                path: "/methodology",
                lazy: async () => {
                    const mod = await import("@/pages/Methodology.tsx");
                    return {Component: mod.Methodology};
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
