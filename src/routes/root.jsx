import { Outlet } from "react-router-dom";
import { Page, Layout } from "@shopify/polaris";
import { AutocompleteExample } from "../components/AutocompleteExample";
import { BaseListboxExample } from "../components/BaseListboxExample";
import { Frame, Navigation } from "@shopify/polaris";
import { HomeMinor, OrdersMinor, ProductsMinor } from "@shopify/polaris-icons";

export default function Root() {
    const navigationComponent = (
        <Navigation location="/">
            <AutocompleteExample />
            <Navigation.Section
                items={
                    [
                        // {
                        //     url: "#",
                        //     label: "Home",
                        //     icon: HomeMinor,
                        // },
                        // {
                        //     url: "#",
                        //     excludePaths: ["#"],
                        //     label: "Orders",
                        //     icon: OrdersMinor,
                        //     badge: "15",
                        // },
                        // {
                        //     url: "#",
                        //     excludePaths: ["#"],
                        //     label: "Products",
                        //     icon: ProductsMinor,
                        // },
                    ]
                }
            />
        </Navigation>
    );
    return (
        <>
            <Frame navigation={navigationComponent}>
                <Page>
                    <Outlet />
                </Page>
            </Frame>
        </>
    );
}
