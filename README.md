# Fastify-Typescript
typescript based rest-API architecture with prisma and fastify framework.

## How to use

### 1. Clone this repo & install dependencies

Install Node dependencies:

`npm install`

### 2. Set up the database

This uses [Postgres database](https://www.postgresql.org/).

To set up your database, run:

```sh
pnpm run prisma migrate dev
```

### 3. Generate Prisma Client (type-safe database client)

Run the following command to generate [Prisma Client](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/generating-prisma-client):

```sh
npm run prisma:gen
```

### 4. Start the Fastify server

Launch your Fastify server with this command:

```sh
npm run dev
```

## For Build Generation

Build server with command: 

```sh
npm run build
```

## Prisma documentation
- Check out the [Prisma docs](https://www.prisma.io/docs/)
- Check out the [Fastify docs](https://www.fastify.io/docs/latest/)


# Getting Started with [Fastify-CLI](https://www.npmjs.com/package/fastify-cli)
This project was bootstrapped with Fastify-CLI.

## Available Scripts
 npx fastify generate fastify-erp --lang=ts 
In the project directory, you can run:

### `npm run dev`

To start the app in dev mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm start`

For production mode

### `npm run test`

Run the test cases.

## Learn More

To learn Fastify, check out the [Fastify documentation](https://fastify.dev/docs/latest/).

