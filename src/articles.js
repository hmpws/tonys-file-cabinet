// put functions to fetch articles here
import * as Realm from "realm-web";

const {
    BSON: { ObjectId },
} = Realm;
const app = new Realm.App({ id: "tonys-file-cabinet-ckhzu" });

export const checkLogin = () => {
    return app.currentUser;
};

export const loginAnonymous = async () => {
    const user = await app.logIn(Realm.Credentials.anonymous());
    return user;
};

export const loginApiKey = async (apiKey) => {
    // Create an API Key credential
    const credentials = Realm.Credentials.apiKey(apiKey);
    // Authenticate the user
    const user = await app.logIn(credentials);
    // `App.currentUser` updates to match the logged in user
    console.assert(user.id === app.currentUser.id);
    return user;
};

export const getDBCollections = async () => {
    const data = await app.currentUser.callFunction("getDBCollections");
    return data;
};

export const getArticles = async (site, blog) => {
    if (checkLogin()) {
        const mongo = app.currentUser.mongoClient("mongodb-atlas");
        const collection = mongo.db(site).collection(blog);

        const query = {
            projection: {
                _id: 1,
                type: 1,
                article: {
                    title: 1,
                    post_date: 1,
                    attributes: { title: 1, publishOn: 1 },
                },
            },
        };

        const data = await collection.find({ type: "ARTICLE" }, query);

        const datePath =
            site === "substack"
                ? "article.post_date"
                : "article.attributes.publishOn";

        const getValByPath = (data, paths) => {
            let val = data;
            for (const path of paths.split(".")) {
                val = val[path];
            }
            return val;
        };

        data.sort(
            (objA, objB) =>
                new Date(getValByPath(objB, datePath)) -
                new Date(getValByPath(objA, datePath))
        );

        return data;
    }
};

export const getArticle = async (site, blog, id) => {
    if (checkLogin()) {
        const mongo = app.currentUser.mongoClient("mongodb-atlas");
        const collection = mongo.db(site).collection(blog);

        const data = await collection.findOne({
            _id: ObjectId(id),
        });
        return data;
    }
};
