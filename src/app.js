import express from "express";
import logger from "morgan";

// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

export default app;