import React from "react";
import ReactDOM from "react-dom/client";
import "@shopify/polaris/build/esm/styles.css";
import enTranslations from "@shopify/polaris/locales/en.json";
import { AppProvider } from "@shopify/polaris";
import {
    RouterProvider,
    createBrowserRouter,
    createHashRouter,
} from "react-router-dom";
import Root, { loader as rootLoader } from "./routes/root";
import Index, {
    loader as indexLoader,
    action as indexAction,
} from "./routes/index";
import Article, { loader as articleLoader } from "./routes/article";
import LoginSuccess from "./routes/loginSuccess";

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Root />,
            loader: rootLoader,
            children: [
                {
                    index: true,
                    element: <Index />,
                    loader: indexLoader,
                    action: indexAction,
                },
                {
                    path: "article/:id",
                    element: <Article />,
                    loader: articleLoader,
                },
                {
                    path: "loginSuccess",
                    element: <LoginSuccess />,
                },
            ],
        },
    ],
    { basename: "/tonys-file-cabinet" }
);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AppProvider i18n={enTranslations}>
            <RouterProvider router={router} />
        </AppProvider>
    </React.StrictMode>
);
