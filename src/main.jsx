import React from "react";
import ReactDOM from "react-dom/client";
import "@shopify/polaris/build/esm/styles.css";
import enTranslations from "@shopify/polaris/locales/en.json";
import { AppProvider } from "@shopify/polaris";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root, { loader as rootLoader } from "./routes/root";
import Index, { action as indexAction } from "./routes/index";
import Article, { loader as articleLoader } from "./routes/article";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        loader: rootLoader,
        children: [
            { index: true, element: <Index />, action: indexAction },
            {
                path: "article/:_id",
                element: <Article />,
                loader: articleLoader,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AppProvider i18n={enTranslations}>
            <RouterProvider router={router} />
        </AppProvider>
    </React.StrictMode>
);
