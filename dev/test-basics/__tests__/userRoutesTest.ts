import app from "../src/app";

import request from "supertest";

describe("POST /user", () => {
    it("returns status code 201 if email is passed", async () => {
        const res = await request(app)
        .post("/user")
        .send({ email: "bobtest2@gmail.com" });

        expect(res.statusCode).toEqual(201);
    })
})