import {
    Link,
    NavLink,
    Outlet,
    useLoaderData,
    useSearchParams,
    useNavigation,
    useNavigate,
} from "react-router-dom";
import { Page } from "@shopify/polaris";
import { AutocompleteExample } from "../components/AutocompleteExample";
import { Frame, Navigation, Loading, TopBar } from "@shopify/polaris";
import { getArticles, loginAnonymous } from "../articles";
import { useEffect, useState, useCallback } from "react";
import { HomeMinor, PageMajor } from "@shopify/polaris-icons";

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
    const navigation = useNavigation();
    const navigate = useNavigate();

    const [searchVal, setSearchVal] = useState("");

    const filteredArticles = (articles || []).filter((article) => {
        let title = null;
        if (site === "substack") {
            title = article.article.title;
        } else if (site === "seekingAlpha") {
            title = article.article.attributes.title;
        }

        return (
            searchVal.length === 0 ||
            title.match(new RegExp(`${searchVal}`, "i"))
        );
    });

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

    const getArticleTitle = (site, article) => {
        let title = null;
        if (site === "substack") {
            title = article.article.title;
        } else if (site === "seekingAlpha") {
            title = article.article.attributes.title;
        } else {
            title = "error";
        }
        return title;
    };

    const getLink = (article) => {
        const link = `article/${article._id}?${searchParams.toString()}`;

        if (link) {
            return link;
        }
    };

    const navigationComponent = (
        <Navigation location="/">
            <Navigation.Section
                items={[
                    {
                        label: "Home",
                        onClick: () => navigate("/"),
                        icon: HomeMinor, // TODO: use premium status for icon
                    },
                ]}
            />
            <AutocompleteExample setSearchVal={setSearchVal} />
            <Navigation.Section
                items={
                    filteredArticles.map((article, index) => {
                        return {
                            label: `[${index}] ${getArticleTitle(
                                site,
                                article
                            )}`,
                            onClick: () => navigate(getLink(article)),
                            icon: PageMajor,
                        };
                    })
                    // [
                    //     {
                    //         label: "Home",
                    //         onClick: () => navigate("/loginSuccess"),
                    //     },
                    // ]
                }
            />
            {/* {filteredArticles.map((article) => {
                return (
                    <nav>
                        <li key={article._id}>{getNavlinks(site, article)}</li>
                    </nav>
                );
            })} */}
        </Navigation>
    );

    const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
    const toggleMobileNavigationActive = useCallback(
        () =>
            setMobileNavigationActive(
                (mobileNavigationActive) => !mobileNavigationActive
            ),
        []
    );
    const topBarMarkup = (
        <TopBar
            showNavigationToggle
            onNavigationToggle={toggleMobileNavigationActive}
        />
    );

    return (
        <>
            <Frame topBar={topBarMarkup} navigation={navigationComponent}>
                {navigation.state === "loading" ? <Loading /> : null}
                <Outlet />
            </Frame>
        </>
    );
}
