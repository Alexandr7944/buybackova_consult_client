import {Route, Routes} from "react-router";
import {routesList} from "./routesList.ts";

export const AppRouter = () => {
    const startPath = import.meta.env.MODE === "production" ? import.meta.env.VITE_PRODUCT_PATH : '';

    return (
        <div>
            <Routes>
                {
                    routesList.map((route, index) =>
                        <Route
                            key={index}
                            path={startPath + route.path}
                            element={<route.element/>}
                        />
                    )
                }
            </Routes>
        </div>
    )
}
