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
        success: Boolean!
        message: String!
        user: User
        token: String
    }
    
    type Query {
        me: User
        getUser(email: String!): User
        getUsers: [User!]!
    }

    type Mutation {
        createUser(firstName: String!, lastName: String!, email: String!, password: String!): UserPayload!
        loginUser(email: String!, password: String!): UserPayload!
    }
`)