import { useLoaderData, useSearchParams, useLocation } from "react-router-dom";
import { checkLogin, getArticle } from "../articles";
import parse from "html-react-parser";
import { Card, Divider, Page, VerticalStack } from "@shopify/polaris";
import { useEffect } from "react";

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
    // const { pathname } = useLocation();

    // useEffect(() => {
    //     const canControlScrollRestoration =
    //         "scrollRestoration" in window.history;
    //     if (canControlScrollRestoration) {
    //         window.history.scrollRestoration = "manual";
    //     }

    //     window.scrollTo(0, 0);
    // }, [pathname]);

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

    const getDate = (site, article) => {
        let date = null;
        if (site === "substack") {
            date = article.article.post_date;
        } else if (site === "seekingAlpha") {
            date = article.article.attributes.publishOn;
        }
        return date.split("T")[0];
    };

    // TODO: move <p></p> to return at the page level?
    const getSubtitle = (site, article) => {
        let subTitle = null;
        if (site === "substack") {
            subTitle = <p>{article.article.subtitle}</p>;
        } else if (site === "seekingAlpha") {
            const subTitles = article.article.attributes.summary.map((line) => {
                return <p>{line}</p>;
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
                return <p>{media}</p>;
            });
            const media = medias.reduce((prev, curr) => [prev, , curr]);
            return media;
        }
    };

    const getComments = (site, article) => {
        let comments = null;
        if (site === "substack") {
            const getCommentHtml = (thread, comment) => {
                thread.push(
                    <p>
                        <div>{comment.body}</div>
                        <div>
                            {comment.name} - {comment.date.split("T")[0]}
                        </div>
                    </p>
                );
                return comment.children;
            };

            function flattenComments(commentObj) {
                const result = [];

                function flattenRecursive(comment) {
                    result.push(comment);
                    comment.children.forEach((child) => {
                        flattenRecursive(child);
                    });
                }

                flattenRecursive(commentObj);
                return result;
            }

            const commentArr = (article?.comments?.comments || []).map(
                (comment) => {
                    const thread = [];
                    const flattenedComments = flattenComments(comment);
                    flattenedComments.forEach((comment) => {
                        return getCommentHtml(thread, comment);
                    });

                    // let children = [];
                    // let curComment = comment;
                    // do {
                    //     children = getComment(thread, curComment);
                    //     const child = children.shift();
                    //     if (children.length > 0) {
                    //         curComment = child;
                    //     } else {
                    //         curComment = null;
                    //     }
                    // } while (curComment); // NB: ahhh, you can do recursion in javascript

                    return thread.reduce((prev, curr) => [prev, , curr]);
                }
            );
            comments =
                commentArr.length > 0
                    ? commentArr.reduce((prev, curr) => [
                          prev,
                          <Divider />,
                          curr,
                      ])
                    : null;
        } else if (site === "seekingAlpha") {
            const commentArr = (article.comments || []).map((comment) => {
                return (
                    <p>
                        <div>{parse(comment.attributes.content)}</div>
                        <div>{comment.attributes.createdOn.split("T")[0]}</div>
                    </p>
                );
            });
            comments =
                commentArr.length > 0
                    ? commentArr.reduce((prev, curr) => [prev, , curr])
                    : null;
        }
        return comments;
    };

    return (
        <>
            <Page title={getTitle(site, article)}>
                <style>
                    {`
                            img {
                                max-width: 100%;
                                height: auto;
                                display: block;
                                margin-left: auto;
                                margin-right: auto;
                            }
                            p {
                                font-size:   12pt;
                                line-height: 150%;
                                margin-block-end: 1em;
                            }
                            h2 {
                                font-size:   14pt;
                                margin-block-end: 1em;
                            }
                            h3 {
                                font-size:   16pt;
                                margin-block-end: 1em;
                            }
                            h4 {
                                font-size:   18pt;
                                margin-block-end: 1em;
                            }
                            `}
                </style>
                <VerticalStack gap="4">
                    <h2>{getDate(site, article)}</h2>
                    <Card>{getSubtitle(site, article)}</Card>
                    {article.video ||
                    article.audio ||
                    getMedia(site, article) ? (
                        <Card>
                            <p>{article.video || null}</p>
                            <p>{article.audio || null}</p>
                            {getMedia(site, article)}
                        </Card>
                    ) : null}
                    <Card>{getBody(site, article)}</Card>
                    <Card>{getComments(site, article)}</Card>
                </VerticalStack>
            </Page>
        </>
    );
}
