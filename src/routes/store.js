import express from "express";
import storeController from "../controllers/store";
import Middleware from "../middlewares";
import Multer from "multer";
const router = express.Router();

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  }
});

router
  .get("/fetchuserdata", Middleware.checkAuth, storeController.fetchUserData)
  .post("/meeting", Middleware.checkAuth, storeController.storeMeeting)
  .post("/register", Middleware.checkAuth, storeController.registerMeeting)
  .delete("/unregister", Middleware.checkAuth, storeController.unregisterMeetup)
  .patch(
    "/updateMeeting/:id",
    Middleware.checkAuth,
    storeController.updateMeeting
  )
  .post(
    "/image",
    Middleware.checkAuth,
    multer.single("file"),
    // (req, res, next) => {
    //   console.log(req.file);
    //   next();
    // },
    storeController.storeImage
  )
  .get("/meetings", storeController.fetchMeetings);

export default router;
