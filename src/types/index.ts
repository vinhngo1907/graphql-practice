import {PrismaClient, 
    // Prisma, User, Post
} from "@prisma/client";


export type Context = {

};

export type PostCreateArgs = {
    post: { title: string, content: string }
};


export type PostUpdateArgs = {
    postId: string,
    post: { title?: string, content?: string };
};

type UserErrors =
    | {
        message: string;
    }[]
    | {};

// export type PostPayload ={
//     userErrors: UserErrors;
//     post: null | Post;
// }