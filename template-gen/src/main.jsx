import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./index.css";
import {AuthProvider} from "./store/AuthContext.tsx";
import {TooltipProvider} from "@/components/ui/tooltip.tsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <TooltipProvider>
                <RouterProvider router={router} />
            </TooltipProvider>
        </AuthProvider>
    </React.StrictMode>
);