import { gql } from "apollo-server";
const typeDefs = gql`
    type: Query{
        posts: PostsGet!
        me: User!
        profile(userId: ID!): Profile!
    }

    type User {
        id: ID!
        name: String
        profile: Profile!
        posts: [Post!]!
    }

    type Post {
        id: ID!
        title: String!
        content: String!
        createdAt: String!
        published: Boolean!
        user: User!
    }

    type Profile {
        id: ID!
        bio: String!
        user: User!
    }

    type Mutation {
        postCreate(post: PostInput!): PostPayload!
    }

    type AuthPayload {
        userErrors: [UserError!]
        token: String
    }

    type PostPayload{
        userErrors: [UserError!]
        post: Post
    }
    
    type UserError{
        message: String!
    }

    type PostInput {
        title: String
        content: String
    }

    input Credential {
        email: String!
        password: String!
    }
`