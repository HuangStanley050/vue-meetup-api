import app from "../app";
import request from "supertest";
import axios from "axios";

jest.mock("axios");

test("To see if the login route fails with incorrect password", async done => {
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
  let login_result = await request(app)
    .post("/api/auth/login")
    .send({ email: "test@test.com", password: "123" });
  expect(login_result.statusCode).toBe(401);
  done();
});

test("To see if the login route succeed with correct password", async done => {
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
  let login_result = await request(app)
    .post("/api/auth/login")
    .send({ email: "test@test.com", password: "1234" });
  expect(login_result.statusCode).toBe(200);
  done();
});

test("to see if register route rejects registration if emails is invalid", async done => {
  function validateEmail(email) {
    console.log(email);
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  axios.post.mockImplementation((route, data) => {
    console.log(data.email);
    if (!validateEmail(data.email)) {
      return Promise.reject({
        response: {
          data: {
            error: {
              message: "This is not an valid email address"
            }
          }
        }
      });
    } else {
      return Promise.resolve({
        response: {
          register_result: {
            data: {
              email: data.email,
              password: data.password
            }
          }
        }
      });
    }
  });
  let register_result = await request(app)
    .post("/api/auth/register")
    .send({ email: "test@com", password: "1234" });
  expect(register_result.statusCode).toBe(500);
  done();
});
