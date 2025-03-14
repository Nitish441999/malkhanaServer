import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import verifyJWT from "../middlewares/auth.Middleware.js";
import {
  deleteUnclaimedVehicle,
  getUnclaimedVehicle,
  getUnclaimedVehicleList,
  unclaimedVehicleEntry,
  updateUnclaimedVehicle,
} from "../controllers/unclaimedVehicle.controller.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getUnclaimedVehicleList)
  .post(
    upload.fields([
      {
        name: "avatar",
        maxCount: 10,
      },
    ]),
    unclaimedVehicleEntry
  );

router
  .route("/:id")
  .get(getUnclaimedVehicle)
  .patch(
    upload.fields([
      {
        name: "avatar",
        maxCount: 10,
      },
    ]),
    updateUnclaimedVehicle
  ).delete(deleteUnclaimedVehicle);;

export default router;
