import express from "express";
import logger from "morgan";
import * as admin from "firebase-admin";
import cors from "cors";
import authRouter from "./routes/auth";
import serviceAccount from "./pwagram-bd625-firebase-adminsdk-ew3ye-c8e2c861ac.json";

import storeRouter from "./routes/store";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://pwagram-bd625.appspot.com/"
});
const auth = admin.auth();
const db = admin.firestore();
const bucket = admin.storage().bucket();

const app = express();
app.set("auth", auth);
app.set("db", db);
app.set("bucket", bucket);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/store", storeRouter);
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  //console.log(message);
  res.status(status).json({ message });
});
export default app;
