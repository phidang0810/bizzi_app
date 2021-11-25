import { ApolloServer, gql } from "apollo-server-express";
import { createServerTest } from "../testUtils/testServer";

describe('auth test:', () => {
    let server: ApolloServer;
    let emailExampleWithTimeStamp = `test${Date.now()}@example.com`;

    const REGISTER_ACCOUNT_QUERY = gql`
    mutation register($password: String!, $email: String!) {
        register (password: $password, email: $email)
    }
    `;

    const LOGIN_ACCOUNT_QUERY = gql`
    mutation login($password: String!, $email: String!) {
        login (password: $password, email: $email) {
        user {
            id,
            name,
            email
        }

      }
    }
    `;

    beforeAll(async () => {
        server = await createServerTest();
        await server.start();
    });

    afterAll(async () => {
        await server.stop();
    });

    it('server initial', () => {
        expect(server).toBeDefined();
    })

    it('throw could not find user when login with doesn\'t exist account', async () => {
        const res = await server.executeOperation({
            query: LOGIN_ACCOUNT_QUERY,
            variables: {
                password: '123123',
                email: emailExampleWithTimeStamp
            }
        });

        expect(res).toMatchObject({
            errors: [
                {
                    message: "could not find user"
                }
            ]
        });
    });

    it('created account successful', async () => {
        const res = await server.executeOperation({
            query: REGISTER_ACCOUNT_QUERY,
            variables: {
                password: '123123',
                email: emailExampleWithTimeStamp
            }
        });

        expect(res.data?.register).toBeTruthy();
    });

    it('throw bad password when login with valid account and wrong password', async () => {
        const res = await server.executeOperation({
            query: LOGIN_ACCOUNT_QUERY,
            variables: {
                password: 'wrong_password',
                email: emailExampleWithTimeStamp
            }
        });

        expect(res).toMatchObject({
            errors: [
                {
                    message: "bad password"
                }
            ]
        });
    });

    it('return access token and user info when login with valid account and password', async () => {
        const res = await server.executeOperation({
            query: LOGIN_ACCOUNT_QUERY,
            variables: {
                password: '123123',
                email: emailExampleWithTimeStamp
            }
        });

        expect(res).toMatchObject({
            "data": {
                "login": {
                    "user": {
                        "email": emailExampleWithTimeStamp
                    }
                }
            }
        });
    });
});