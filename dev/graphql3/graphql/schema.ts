import { buildSchema } from "graphql";

export const schema = buildSchema(`
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        email: String!
        password: String!
    }

    type UserPayload {
        success: Boolean
        message: String
        user: User
        token: String
    }

    type Post {
        id: ID!
        title: String!
        author: User!
        authorId: ID!
    }

    type Query {
        me: User
        getUser(email: String): User
        getAllUsers: [User!]!
        getPosts(email: String): [Post!]!
    }

    type Mutation {
        createUser(firstName: String, lastName: String, email: String, password: String): UserPayload!
        loginUser(email: String, password: String): UserPayload!
        createPost(email: String, password: String, title: String): Post
    }
`)