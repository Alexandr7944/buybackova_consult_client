import {createRoot} from 'react-dom/client'
import {StrictMode} from "react";
import './index.css'
import {RouterProvider} from "react-router-dom";
import {router} from "@/router/RoutesList";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router}/>
    </StrictMode>
)
