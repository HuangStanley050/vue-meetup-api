import request from "supertest";
import app from "../app";

test("if checkAuth middleware throws an error if there's no authoriaztion in request header", async done => {
  let result = await request(app).post("/api/store/meeting"); //no auth in request body
  expect(result.statusCode).toBe(401);
  done();
});

test("if checkAuth middleware throws error if token is wrong in request header", async done => {
  let result = await request(app)
    .post("/api/store/meeting")
    .set("Authorization", "bearer afdasf");

  expect(result.statusCode).toBe(500);
  done();
});
