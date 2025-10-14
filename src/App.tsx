import {BrowserRouter} from "react-router-dom";
import {AppRouter} from "@/router/AppRouter.tsx";

function App() {
    const basename = import.meta.env.MODE === "production"
        ? import.meta.env.VITE_PRODUCT_PATH
        : undefined;

    return (
        <div className="container">
            <BrowserRouter basename={basename}>
                <AppRouter/>
            </BrowserRouter>
        </div>
    )
}

export default App
