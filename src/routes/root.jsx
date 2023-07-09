import {
    Link,
    NavLink,
    Outlet,
    useLoaderData,
    useSearchParams,
} from "react-router-dom";
import { Page } from "@shopify/polaris";
import { AutocompleteExample } from "../components/AutocompleteExample";
import { Frame, Navigation } from "@shopify/polaris";
import { getArticles, loginAnonymous } from "../articles";
import { useEffect, useState } from "react";

export async function loader({ request }) {
    const url = new URL(request.url);
    const s = url.searchParams.get("s");
    const b = url.searchParams.get("b");
    let articles = null;
    if (s && b) {
        articles = await getArticles(s, b);
    }
    return { articles };
}

export default function Root() {
    const { articles } = useLoaderData();
    const [searchParams] = useSearchParams();
    const site = searchParams.get("s");

    const [searchVal, setSearchVal] = useState("");

    const filteredArticles =
        articles.filter((article) => {
            let title = null;
            if (site === "substack") {
                title = article.article.title;
            } else if (site === "seekingAlpha") {
                title = article.article.attributes.title;
            }

            return title.match(new RegExp(`${searchVal}`, "i"));
        }) || [];

    const getNavlinks = (site, article) => {
        const link = `article/${article._id}?${searchParams.toString()}`;
        let title = null;
        if (site === "substack") {
            title = article.article.title;
        } else if (site === "seekingAlpha") {
            title = article.article.attributes.title;
        } else {
            title = "error";
        }
        if (link) {
            return (
                <NavLink
                    to={link}
                    className={({ isActive, isPending }) =>
                        isActive ? "active" : isPending ? "pending" : ""
                    }
                >
                    <Link to={link}>{title}</Link>
                </NavLink>
            );
        }
    };

    const navigationComponent = (
        <Navigation location="/">
            <AutocompleteExample setSearchVal={setSearchVal} />
            {/* <Navigation.Section
                items={
                    (articles || []).map((article) => {
                        return {
                            // url: `article/${article._id}`,
                            // label: `${article.article.title}`,
                            // icon: PageMajor,
                        };
                    })
                    //[
                    // {
                    //     url: "#",
                    //     label: "Home",
                    //     icon: PageMajor,
                    // },
                    // {
                    //     url: "#",
                    //     excludePaths: ["#"],
                    //     label: "Orders",
                    //     icon: PageMajor,
                    //     badge: "15",
                    // },
                    // {
                    //     url: "#",
                    //     excludePaths: ["#"],
                    //     label: "Products",
                    //     icon: PageMajor,
                    // },
                    //]
                }
            /> */}
            {filteredArticles.map((article) => {
                return (
                    <nav>
                        <li key={article._id}>{getNavlinks(site, article)}</li>
                    </nav>
                );
            })}
        </Navigation>
    );
    return (
        <>
            <Frame navigation={navigationComponent}>
                <Outlet />
            </Frame>
        </>
    );
}
