import { ApolloServer } from "apollo-server";
import { PrismaClient } from "@prisma/client";

// import typeDefs from "./schema";

export const prisma = new PrismaClient();

const server = new ApolloServer({

});

server.listen().then(({ url }) => {
    console.log(`Server is ready run on ${url}`)
})