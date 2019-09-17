import request from "supertest";
import app from "../app";

test("if checkAuth middleware throws an error if there's no authoriaztion in request header", async done => {
  let result = await request(app).post("/api/store/meeting"); //no auth in request body
  expect(result.statusCode).toBe(401);
  done();
});
