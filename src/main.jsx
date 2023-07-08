import React from "react";
import ReactDOM from "react-dom/client";
import "@shopify/polaris/build/esm/styles.css";
import enTranslations from "@shopify/polaris/locales/en.json";
import { AppProvider } from "@shopify/polaris";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import Index from "./routes/index";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [{ index: true, element: <Index /> }],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AppProvider i18n={enTranslations}>
            <RouterProvider router={router} />
        </AppProvider>
    </React.StrictMode>
);
