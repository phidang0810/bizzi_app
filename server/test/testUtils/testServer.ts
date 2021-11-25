import { buildDataLoaders } from '../../src/utils/dataLoader';
import { Context } from '../../src/types/Context';
import { CommentResolver } from '../../src/resolvers/CommentResolver';
import { AuthResolver } from '../../src/resolvers/AuthResolver';
import { PostResolver } from '../../src/resolvers/PostResolver';
import { UserResolver } from '../../src/resolvers/UserResolver';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from "apollo-server-express";
import { createConnection } from "typeorm";

import { User } from "../../src/entities/User";
import { Post } from "../../src/entities/Post";
import { Comment } from "../../src/entities/Comment";
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

export async function createServerTest() {
    const connection = await createConnection({
        host: process.env.DB_HOST,
        type: "mysql",
        database: process.env.DB_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        logging: true,
        synchronize: process.env.ENV == 'production' ? false : true,
        entities: [Post, User, Comment]
    });
    
    const server = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver, PostResolver, AuthResolver, CommentResolver]
        }),
        context: ({ req, res }: Context) => ({
            req,
            res,            
            connection,
            dataLoaders: buildDataLoaders()
        }),
        formatError: (err) => {
            return err;
            // console.log(err)
            // return { message: err.message, code: err.extensions.code}
        },
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground] // From Apollo 3.x
    });

    return server;
}