import { useLoaderData, useSearchParams } from "react-router-dom";
import { checkLogin, getArticle } from "../articles";
import parse from "html-react-parser";
import { Card, Page, VerticalStack } from "@shopify/polaris";

export async function loader({ request, params }) {
    const url = new URL(request.url);
    const s = url.searchParams.get("s");
    const b = url.searchParams.get("b");
    let article = null;
    if (s && b) {
        article = await getArticle(s, b, params._id);
    }
    return { article };
}

export default function Article() {
    const { article } = useLoaderData();
    const [searchParams] = useSearchParams();
    const site = searchParams.get("s");

    const getTitle = (site, article) => {
        let title = null;
        if (site === "substack") {
            title = article.article.title;
        } else if (site === "seekingAlpha") {
            title = article.article.attributes.title;
        }
        return title;
    };

    const getSubtitle = (site, article) => {
        let subTitle = null;
        if (site === "substack") {
            subTitle = article.article.subtitle;
        } else if (site === "seekingAlpha") {
            const subTitles = article.article.attributes.summary.map((line) => {
                return <div>- {line}</div>;
            });
            subTitle = subTitles.reduce((prev, curr) => [prev, , curr]);
        }
        return subTitle;
    };

    const getBody = (site, article) => {
        let body = null;
        if (site === "substack") {
            body = parse(article?.article?.body_html);
        } else if (site === "seekingAlpha") {
            body = parse(article.article.attributes.content);
        }
        return body;
    };

    const getMedia = (site, article) => {
        if (article.media) {
            const medias = article.media.map((media) => {
                return <div>{media}</div>;
            });
            const media = medias.reduce((prev, curr) => [prev, , curr]);
            return media;
        }
    };

    return (
        <>
            <Page title={getTitle(site, article)}>
                <VerticalStack gap="4">
                    <Card>{getSubtitle(site, article)}</Card>
                    <Card>
                        {article.video || null}
                        {article.audio || null}
                        {getMedia(site, article)}
                    </Card>
                    <Card>
                        <style>
                            {`img {
                                max-width: 100%;
                                height: auto;
                                display: block;
                                margin-left: auto;
                                margin-right: auto;
                            }`}
                        </style>
                        {getBody(site, article)}
                    </Card>
                </VerticalStack>
            </Page>
        </>
    );
}
