import { useLoaderData } from "react-router-dom";
import { getArticle } from "../articles";
import parse from "html-react-parser";
import { Card, Text } from "@shopify/polaris";

export async function loader({ params }) {
    const article = await getArticle(params._id);
    return { article };
}

export default function Article() {
    const { article } = useLoaderData();
    console.log(parse(article?.article?.body_html));

    // return <div ref={myRef} />;
    return (
        <>
            <Card>
                <div>{parse(article?.article?.title)}</div>
                <div>{parse(article?.article?.subtitle)}</div>
                <div>{parse(article?.article?.body_html)}</div>
            </Card>
        </>
    );
}
