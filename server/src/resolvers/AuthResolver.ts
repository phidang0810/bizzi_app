import { Context } from '../types/Context';
import { ERROR_CODE } from '../constants';

import { LoginResponse } from "./../types/LoginResponse";
import { callRequest, createAccessToken, createRefreshToken, sendRefreshToken } from "./../helpers";
import { User } from "../entities/User";
import { Arg, Ctx, Query, UseMiddleware, Mutation, Resolver } from "type-graphql";
import { ApolloError } from "apollo-server-errors";
import { checkAuth } from '../middleware/checkAuth';
import { verify } from 'jsonwebtoken';
import { hash, compare } from "bcryptjs";
@Resolver()
export class AuthResolver {

    @Query(_return => User, { nullable: true })
    @UseMiddleware(checkAuth)
    async me(
        @Ctx() { payload }: Context
    ): Promise<User | null> {
        console.log(payload)
        const { userId } = payload;

        try {
            let user = await User.findOne({ id: userId });

            if (!user) {
                throw new ApolloError('User Not Found.', ERROR_CODE.NOT_FOUND);
            }

            return user;

        } catch (error) {
            if (error instanceof SyntaxError) {
                throw new ApolloError(error.message, ERROR_CODE.SERVER_ERROR);
            }
        }
        return null;
    }

    @Mutation(_return => LoginResponse)
    async loginSocialCallback(
        @Arg("token") token: string,
        @Arg("social") social: string,
        @Arg("userId") userId: string,
        @Ctx() { res }: Context
    ): Promise<LoginResponse> {
        const url = `https://graph.facebook.com/v12.0/${userId}/?fields=id,name,email&access_token=${token}`;

        try {
            let result: any = await callRequest(url);
            const { email, name } = JSON.parse(result);

            let existingUser = await User.findOne({
                email,
                social
            });

            if (!existingUser) {
                existingUser = await User.create({
                    email,
                    social,
                    name
                }).save();
            }
            sendRefreshToken(res, createRefreshToken(existingUser));

            const accessToken = createAccessToken(existingUser);

            return {
                accessToken: accessToken,
                user: existingUser
            };

        } catch (error) {
            if (error instanceof SyntaxError) {
                throw new ApolloError(error.message, ERROR_CODE.SERVER_ERROR);
            }
            throw new ApolloError('Not authenticated.', ERROR_CODE.UNAUTHENTICATED);
        }

    }

    @Mutation(_return => String)
    async refreshToken(
        @Ctx() { req, res }: Context
    ): Promise<string> {

        const refreshToken = req.cookies.jid;

        if (!refreshToken) throw new ApolloError('Refresh token is empty', ERROR_CODE.UNAUTHENTICATED);

        let payload: any = null;
        try {
            payload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);
        } catch (error) {
            throw new ApolloError('Invalid refresh token.', ERROR_CODE.UNAUTHENTICATED);
        }

        const user = await User.findOne({ id: payload.userId });

        if (!user) {
            throw new ApolloError('Invalid refresh token.', ERROR_CODE.UNAUTHENTICATED);
        }

        sendRefreshToken(res, createRefreshToken(user));

        return createAccessToken(user);
    }


    @Mutation(() => Boolean)
    async register(
        @Arg("email") email: string,
        @Arg("password") password: string
    ) {
        const hashedPassword = await hash(password, 12);

        try {
            await User.insert({
                email,
                password: hashedPassword
            });
        } catch (err) {
            console.log(err);
            return false;
        }

        return true;
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() { res }: Context
      
    ): Promise<LoginResponse> {
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        throw new Error("could not find user");
      }
  
      const valid = await compare(password, user.password);
  
      if (!valid) {
        throw new Error("bad password");
      }  
      
      sendRefreshToken(res, createRefreshToken(user));
  
      return {
        accessToken: createAccessToken(user),
        user
      };
    }

    @Mutation(_return => Boolean)
    logout(@Ctx() { res }: Context) {
        sendRefreshToken(res, "");
        return true;
    }
}
