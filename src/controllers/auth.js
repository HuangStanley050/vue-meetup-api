import axios from "axios";
const api_key = process.env.API_KEY;
const login_end_point = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${api_key}`;
const register_end_point = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${api_key}`;

export default {
  login: async (req, res, next) => {
    res.json({ message: "Login route" });
  },
  register: async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email, password);
    const data = {
      email,
      password,
      returnSecureToken: true
    };
    let register_result;
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
