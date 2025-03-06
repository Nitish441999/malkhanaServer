import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import verifyJWT from "../middlewares/auth.Middleware.js";
import {
  deleteIpcVehicle,
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
        maxCount: 10,
      },
    ]),
    ipcVehicleEntry
  );

router
  .route("/:id")
  .get(getIpcVehicle)
  .patch(
    upload.fields([
      {
        name: "avatar",
        maxCount: 10,
      },
    ]),
    updateIpcVehicle
  ).delete(deleteIpcVehicle);

export default router;
