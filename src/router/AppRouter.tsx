import {Route, Routes} from "react-router";
import {routesList} from "./routesList.ts";

export const AppRouter = () => {
    return (
        <Routes>
            {routesList.map((route, index) =>
                <Route key={index} path={route.path} element={<route.element/>}/>
            )}
        </Routes>
    )
}
