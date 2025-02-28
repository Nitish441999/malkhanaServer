import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import verifyJWT from "../middlewares/auth.Middleware.js";
import {
  getIpcVehicle,
  getIpcVehicleList,
  ipcVehicleEntry,
  updateIpcVehicle,
} from "../controllers/ipcVehicle.controller.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getIpcVehicleList)
  .post(
    upload.fields([
      {
        name: "avatar",
        maxCount: 1,
      },
    ]),
    ipcVehicleEntry
  );

router
  .route("/c/:id")
  .get(getIpcVehicle)
  .put(
    upload.fields([
      {
        name: "avatar",
        maxCount: 1,
      },
    ]),
    updateIpcVehicle
  );

export default router;
