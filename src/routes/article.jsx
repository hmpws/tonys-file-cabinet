import { useLoaderData } from "react-router-dom";
import { getArticle } from "../articles";
import { useRef, useEffect } from "react";
import parse from "html-react-parser";

export async function loader({ params }) {
    const article = await getArticle(params._id);
    return { article };
}

export default function Article() {
    // const myRef = useRef(null);
    // useEffect(() => {
    //     myRef.current.innerHTML =
    //         article?.article?.body_html || "<p>loading</p>";
    // }, [myRef]);

    const { article } = useLoaderData();
    console.log(article);

    // return <div ref={myRef} />;
    return (
        <>
            <div>{parse(article?.article?.title)}</div>
            <div>{parse(article?.article?.subtitle)}</div>
            <div>{parse(article?.article?.body_html)}</div>
        </>
    );
}
