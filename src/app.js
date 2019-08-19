import express from "express";
import logger from "morgan";
import * as admin from "firebase-admin";
import cors from "cors";
import authRouter from "./routes/auth";
import serviceAccount from "./pwagram-bd625-firebase-adminsdk-ew3ye-c8e2c861ac.json";
// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/auth", authRouter);
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  //const data = error.data;
  res.status(status).json({ message });
});
export default app;
