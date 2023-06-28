import { ApolloServer } from "apollo-server";
import { PrismaClient } from "@prisma/client";

import typeDefs from "./schema";
import { getUserFromToken } from "./utils/get-user-from-token";
import { Query } from "./resolvers";

export const prisma = new PrismaClient();

const resolvers = {
    Query
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const userInfo = getUserFromToken(req.headers.authorization);
        return {
            prisma,
            userInfo,
        };
    },
});

server.listen().then(({ url }) => {
    console.log(`Server is ready run on ${url}`)
})