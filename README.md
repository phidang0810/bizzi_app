# Bizzi Test

A simple web app using Graphql, Express, Reactjs and Algolia

## Prerequisites
The following must be done before following this guide:
- Install Node (we recommend you should install v16.3.0)
- Install yarn

## Installation Backend server using yarn

```bash
cd server
yarn install
cp .env.example .env
yarn start-dev
```

## Installation Frontend using yarn

```bash
cd frontend
yarn install
cp .env.example .env
yarn start
```

## Environment Variables
Stored in .env

## Log in using Facebook
To log in facebook in localhost you need to change FB_ID(frontent/.env) to our application id

## Log in with email and password
Use user@gmail.com / 123456 for default database in env.example .
If you use your database, you need to run register mutation in GraphQL.
We don't have register page now. Sorry for the inconvenience

## Unit Test
```bash
cd server
yarn test
```