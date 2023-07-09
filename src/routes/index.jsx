import {
    LegacyCard,
    EmptyState,
    Page,
    FormLayout,
    Button,
} from "@shopify/polaris";
import { Form, Link, redirect } from "react-router-dom";
import { checkLogin, loginApiKey } from "../articles";

export async function action({ request, params }) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const user = await loginApiKey(data.apiKey);
    return redirect("/loginSuccess");
}

export default function Index() {
    const user = checkLogin();
    return (
        <Page>
            <LegacyCard sectioned>
                {user ? (
                    <EmptyState
                        heading="Start reading!"
                        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                    >
                        <p>Please select a blog to see its articles</p>
                        <Link to={`/?s=substack&b=asiancenturystocks`}>
                            Asian Century Stocks
                        </Link>
                        <div></div>
                        <Link to={`/?s=seekingAlpha&b=VIE`}>
                            Value Investor's Edge
                        </Link>
                    </EmptyState>
                ) : (
                    <EmptyState
                        heading="Please enter Tony's favourite meal!"
                        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                    >
                        <p>Nothing to see here!</p>
                        <Form method="post" id="apiKey-form">
                            <FormLayout>
                                <input
                                    placeholder="Your answer"
                                    aria-label="Your answer"
                                    type="text"
                                    name="apiKey"
                                />
                                <Button primary submit>
                                    Check answer
                                </Button>
                            </FormLayout>
                        </Form>
                    </EmptyState>
                )}
            </LegacyCard>
        </Page>
    );
}
