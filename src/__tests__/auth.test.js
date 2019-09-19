import app from "../app";
import request from "supertest";
import axios from "axios";

jest.mock("axios");
axios.post.mockImplementation((route, data) => {
  //console.log(data);
  if (data.email === "test@test.com" && data.password === "1234") {
    return Promise.resolve({ data: { name: "stuff" } });
  } else {
    return Promise.reject({
      response: {
        data: {
          error: {
            message: "You have failed to login"
          }
        }
      }
    });
  }
});

test("To see if the login route fails with incorrect password", async done => {
  let login_result = await request(app)
    .post("/api/auth/login")
    .send({ email: "test@test.com", password: "123" });
  expect(login_result.statusCode).toBe(401);
  done();
});

test("To see if the login route succeed with correct password", async done => {
  let login_result = await request(app)
    .post("/api/auth/login")
    .send({ email: "test@test.com", password: "1234" });
  expect(login_result.statusCode).toBe(200);
  done();
});
