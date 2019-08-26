import express from "express";
import storeController from "../controllers/store";
import Middleware from "../middlewares";
const router = express.Router();

/* GET users listing. */
router
  .post("/meeting", Middleware.checkAuth, storeController.storeMeeting)
  .get("/meetings", storeController.fetchMeetings);

export default router;
