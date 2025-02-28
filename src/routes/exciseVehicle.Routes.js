import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import verifyJWT from "../middlewares/auth.Middleware.js";
import {
  exciseVehicleEntry,
  getExciseVehicle,
  getExciseVehicleList,
  updateExciseVehicle,
} from "../controllers/exciseVehicle.controller.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getExciseVehicleList)
  .post(
    upload.fields([
      {
        name: "avatar",
        maxCount: 1,
      },
    ]),
    exciseVehicleEntry
  );

router
  .route("/c/:id")
  .get(getExciseVehicle)
  .put(
    upload.fields([
      {
        name: "avatar",
        maxCount: 1,
      },
    ]),
    updateExciseVehicle
  );

export default router;
