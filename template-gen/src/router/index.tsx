import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../page/auth/Login";
import ItemPage from "@/page/item/Index";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        // Tất cả routes cần auth nằm trong đây
        element: <ProtectedRoute />,
        children: [
            { path: "/",        element: <div>Dashboard</div> },
            { path: "/item",    element: <ItemPage></ItemPage> },
            { path: "/dungeon", element: <div>Dungeon</div> },
            { path: "/entity",  element: <div>Entity</div> },
            { path: "/loottable", element: <div>Loot Table</div> },
            { path: "/room",    element: <div>Room</div> },
            { path: "/spawner", element: <div>Spawner</div> },
        ],
    },
]);