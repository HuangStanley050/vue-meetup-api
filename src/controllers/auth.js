import axios from "axios";
const api_key = process.env.API_KEY;
const login_end_point = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${api_key}`;
const register_end_point = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${api_key}`;

export default {
  login: async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let login_result;
    const data = {
      email,
      password,
      returnSecureToken: true
    };
    try {
      login_result = await axios.post(login_end_point, data);
    } catch (err) {
      console.log(err.response);
      const error = new Error("Unable to login");
      error.statusCode = 401;
      return next(error);
    }
    res.json({ message: "Login successful", data: login_result.data });
  },
  register: async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let register_result;

    const data = {
      email,
      password,
      returnSecureToken: true
    };

    try {
      register_result = await axios.post(register_end_point, data);
    } catch (err) {
      console.log(err.response);
      const error = new Error("Unable to register user");
      error.statusCode = 500;
      return next(error);
    }
    //console.log(register_result.data);
    res.json({ message: "Register successful", data: register_result.data });
  },
  greet: (req, res, next) => {
    res.send("Hi this is greeting");
  }
};
