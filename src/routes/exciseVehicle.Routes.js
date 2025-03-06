import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import verifyJWT from "../middlewares/auth.Middleware.js";
import {
  deleteExciseVehicle,
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
        maxCount: 10,
      },
    ]),
    exciseVehicleEntry
  );

router
  .route("/:id")
  .get(getExciseVehicle)
  .patch(
    upload.fields([
      {
        name: "avatar",
        maxCount: 10,
      },
    ]),
    updateExciseVehicle
  ).delete(deleteExciseVehicle);

export default router;
