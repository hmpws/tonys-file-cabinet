// put functions to fetch articles here
import * as Realm from "realm-web";

const {
    BSON: { ObjectId },
} = Realm;
const app = new Realm.App({ id: "tonys-file-cabinet-ckhzu" });

export const loginAnonymous = async () => {
    const user = await app.logIn(Realm.Credentials.anonymous());
    return user;
};

export const getArticles = async () => {
    const mongo = app.currentUser.mongoClient("mongodb-atlas");
    const collection = mongo.db("substack").collection("asiancenturystocks");

    const data = await collection.find(
        { type: "ARTICLE" },
        { projection: { _id: 1, type: 1, article: { title: 1 } } }
    );
    return data;
};

export const getArticle = async (id) => {
    const mongo = app.currentUser.mongoClient("mongodb-atlas");
    const collection = mongo.db("substack").collection("asiancenturystocks");

    const data = await collection.findOne({
        _id: ObjectId(id),
    });
    return data;
};
