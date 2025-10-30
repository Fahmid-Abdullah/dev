import pool from "../lib/pool";

export const resolvers = {
    Query: {
        hello: async () => {
            return "Hello there!"
        }
    },

    Mutation: {
        initializeDB: async () => {
            await pool.query(`CREATE EXTENSION IF NOT EXISTS postgis;`);
            await pool.query(`
                    CREATE TABLE IF NOT EXISTS cities (
                        id SERIAL PRIMARY KEY,
                        name TEXT,
                        geom GEOMETRY(Point, 4326)
                );
            `);

            const { rows } = await pool.query(`SELECT * FROM cities`);
            return rows;
        }
    }
}