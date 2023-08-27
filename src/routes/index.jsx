import {
    LegacyCard,
    EmptyState,
    Page,
    FormLayout,
    Button,
} from "@shopify/polaris";
import { Form, Link, redirect, useLoaderData } from "react-router-dom";
import { checkLogin, getDBCollections, loginApiKey } from "../articles";

export async function loader() {
    const user = checkLogin();
    let dbCollections = null;
    if (user) {
        dbCollections = await getDBCollections();
    }
    return { dbCollections: dbCollections && dbCollections.result };
}

export async function action({ request, params }) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const user = await loginApiKey(data.apiKey);
    return redirect("/loginSuccess");
}

export default function Index() {
    const user = checkLogin();
    const { dbCollections } = useLoaderData();
    const blogs = [];
    for (const db in dbCollections) {
        const collections = dbCollections[db];
        for (const collection of collections) {
            blogs.push({ s: db, b: collection });
        }
    }

    const blogLinks = (blogs) => {
        const components = blogs.map((blog) => {
            const blogMeta = blog.b.split("[");
            blogMeta[1] = blogMeta[1].replace("]", "");
            return (
                <p>
                    <Link to={`/?s=${blog.s}&b=${blogMeta[0]}`}>
                        {`${blogMeta[0]} (${new Date(
                            blogMeta[1]
                        ).toDateString()})`}
                    </Link>
                </p>
            );
        });
        return components.reduce((prev, curr) => [prev, , curr]);
    };

    return (
        <Page>
            <LegacyCard sectioned>
                {user ? (
                    <EmptyState
                        heading="Start reading!"
                        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                    >
                        <p>Please select a blog to see its articles</p>
                        {blogLinks(blogs)}
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
