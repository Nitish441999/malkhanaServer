import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import verifyJWT from "../middlewares/auth.Middleware.js";
import {
  getSeizureVehicle,
  getSeizureVehicleList,
  seizureVehicleEntry,
  updateSeizureVehicle,
} from "../controllers/seizureVehicle.controller.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getSeizureVehicleList)
  .post(
    upload.fields([
      {
        name: "avatar",
        maxCount: 1,
      },
    ]),
    seizureVehicleEntry
  );

router
  .route("/c/:id")
  .get(getSeizureVehicle)
  .put(
    upload.fields([
      {
        name: "avatar",
        maxCount: 1,
      },
    ]),
    updateSeizureVehicle
  );

export default router;
