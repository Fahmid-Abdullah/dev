// src/graphql/schema.ts
import { buildSchema } from "graphql";

export const schema = buildSchema(`
  type User {
    id: ID!
    email: String!
    password: String!
    posts: [Post!]
  }

  type UserPayload {
    success: Boolean!
    message: String!
    user: User
    token: String
  }

  type Post {
    id: ID!
    title: String!
    author: User!
  }

  type Query {
    me: User
    getUser(email: String!): User
    getUsers: [User!]!
    getPosts: [Post!]!
  }

type Mutation {
    createUser(email: String!, password: String!): UserPayload!
    loginUser(email: String!, password: String!): UserPayload!
    createPost(title: String!): Post
  }
`);
