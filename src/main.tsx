import {createRoot} from 'react-dom/client'
import {StrictMode} from "react";
import './styles/index.css'
import {RouterProvider} from "react-router-dom";
import {router} from "@/router/RoutesList";
import {Provider} from "react-redux";
import store from "@/store";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider router={router}/>
        </Provider>
    </StrictMode>
)
