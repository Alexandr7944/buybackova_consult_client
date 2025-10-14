import './App.css'
import {BrowserRouter} from "react-router-dom";
import {AppRouter} from "./router/AppRouter.tsx";

function App() {
    return (
        <div className="container">
            <BrowserRouter>
                <AppRouter/>
            </BrowserRouter>
        </div>
    )
}

export default App
