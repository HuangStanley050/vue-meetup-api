export default {
  login: (req, res, next) => {
    res.json({ message: "Login route" });
  },
  register: (req, res, next) => {
    res.json({ message: "Register route" });
  },
  greet: (req, res, next) => {
    res.send("Hi this is greeting");
  }
};
