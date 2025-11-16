import App from "@/App";
import Home from "@/page/Home";
import NotFound from "@/page/NotFound";
import { createBrowserRouter } from "react-router-dom";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "*",
                element: <NotFound />,
            }
        ]
    }
])