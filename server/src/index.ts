require("dotenv").config();
import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import { User } from "./entities/User";
import { Post } from "./entities/Post";
import { Comment } from "./entities/Comment";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { AuthResolver } from "./resolvers/authResolver";
import { PostResolver } from "./resolvers/PostResolver";
import { UserResolver } from "./resolvers/UserResolver";
import cookieParser from "cookie-parser";
import cors from "cors";
import { buildDataLoaders } from "./dataLoaders";
import { CommentResolver } from "./resolvers/CommentResolver";

var routes = require("./routes");

const main = async () => {
    const connection = await createConnection({
        type: "mysql",
        database: process.env.DB_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        logging: true,
        synchronize: process.env.ENV == 'production' ? false : true,
        migrations: ["./src/migrations/*.ts"],
        entities: [Post, User, Comment]
    });
    const app = express();

    app.use(
        cors({
            origin: process.env.CORS_ORIGIN,
            credentials: true
        })
    );
    
    app.use(cookieParser());
    app.use("/api", routes);

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver, PostResolver, AuthResolver, CommentResolver]
        }),
        context: ({ req, res }) => ({
            req,
            res,
            connection,
            dataLoaders: buildDataLoaders()
        }),
        formatError: err => {
            return err;
            // console.log(err)
        },
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground] // From Apollo 3.x
    });

    await apolloServer.start();
    
    apolloServer.applyMiddleware({ app, cors: false });

    module.exports = app;
    const POST = process.env.PORT || 4000;
    app.listen(4000, () => console.log(`Server started on port ${POST}. GraphQL server started on localhost:${POST}${apolloServer.graphqlPath}`));
};

main().catch(error => console.log(error));
