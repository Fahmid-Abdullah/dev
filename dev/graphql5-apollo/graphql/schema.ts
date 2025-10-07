import { gql } from "apollo-server-express";

export const typeDefs = gql(`
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        posts: [Post!]
    }

    type Post {
        id: ID!
        title: String!
        author: User
        authorId: ID!
    }

    type UserPayload {
        success: Boolean
        message: String
        user: User
        token: String
    }

    type Query {
        me: User
        getUser(email: String): User
        getAllUsers: [User!]!
        getUserPosts: [Post!]
    }

    type Mutation {
        createUser(firstName: String, lastName: String, email: String, password: String): UserPayload!
        loginUser(email: String, password: String): UserPayload
        createPost(title: String): Post
    }
`);