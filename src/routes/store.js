import express from "express";
import storeController from "../controllers/store";
const router = express.Router();

/* GET users listing. */
router.post("/meeting", storeController.storeMeeting);

export default router;
