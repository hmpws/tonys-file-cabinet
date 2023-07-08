import { Link, NavLink, Outlet, useLoaderData } from "react-router-dom";
import { Page } from "@shopify/polaris";
import { AutocompleteExample } from "../components/AutocompleteExample";
import { Frame, Navigation } from "@shopify/polaris";
import { PageMajor } from "@shopify/polaris-icons";
import { getArticles, loginAnonymous } from "../articles";

export async function loader() {
    const user = await loginAnonymous();
    const articles = await getArticles();
    return { articles };
}

export default function Root() {
    const { articles } = useLoaderData();

    const navigationComponent = (
        <Navigation location="/">
            <AutocompleteExample />
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
            {(articles || []).map((article) => {
                return (
                    <li key={article._id}>
                        <NavLink
                            to={`contacts/${article._id}`}
                            className={({ isActive, isPending }) =>
                                isActive ? "active" : isPending ? "pending" : ""
                            }
                        >
                            <Link to={`article/${article._id}`}>
                                {article.article.title}
                            </Link>
                        </NavLink>
                    </li>
                );
            })}
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
