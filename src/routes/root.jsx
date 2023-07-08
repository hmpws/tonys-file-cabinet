import { Outlet } from "react-router-dom";
import { Page, Layout } from "@shopify/polaris";
import { AutocompleteExample } from "../components/AutocompleteExample";
import { BaseListboxExample } from "../components/BaseListboxExample";

export default function Root() {
    return (
        <Page>
            <Layout>
                <Layout.Section secondary>
                    <AutocompleteExample />
                    <BaseListboxExample />
                </Layout.Section>
                <Layout.Section>
                    <Outlet />
                </Layout.Section>
            </Layout>
        </Page>
    );
}
