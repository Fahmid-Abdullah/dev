import { gql } from "apollo-server-express";

export const typeDefs = gql(`
    scalar JSON

    type Query {
        hello: String
    }

    type Mutation {
        initializeDB: JSON
    }
`)