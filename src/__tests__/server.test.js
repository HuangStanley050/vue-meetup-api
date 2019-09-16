import request from "supertest";
import app from "../app";

describe("Testing the auth Controller", () => {
  test("Test if login greet returns a greeting", async done => {
    //not passing email and password to the end point
    let greetResult = await request(app).get("/api/auth/");
    //console.log(greetResult);
    expect(greetResult.statusCode).toBe(200);
    //console.log(greetResult);
    expect(greetResult.text).toContain("Hi this is greeting");
    done();
  });
});
