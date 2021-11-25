import { Context } from "../types/Context";
import { MiddlewareFn } from "type-graphql";
import { verify } from 'jsonwebtoken';
import { ApolloError } from 'apollo-server-express'
import { ERROR_CODE } from "../constants";

export const checkAuth: MiddlewareFn<Context> = ({context}, next): any => {
    const authorization = context.req.headers['authorization'];

    if(!authorization) {                
        throw new ApolloError("Not authenticated.", ERROR_CODE.UNAUTHENTICATED)
    }

    try {
        const token = authorization.split(" ")[1];
        const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!)
        context.payload = payload as any;
    } catch(error: any) {        
        if (error instanceof SyntaxError) {
            throw new ApolloError(error.message, ERROR_CODE.SERVER_ERROR);
        }
        throw new ApolloError(error.message, ERROR_CODE.UNAUTHENTICATED)
    }
    return next();
}