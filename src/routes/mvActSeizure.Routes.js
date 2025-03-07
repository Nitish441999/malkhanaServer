import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import verifyJWT from "../middlewares/auth.Middleware.js";
import {
  deleteMvActSeizure,
  getMvActSeizure,
  getMvActSeizureList,
  mvActSeizureEntry,
  updateMvActSeizure,
} from "../controllers/mvActSeizure.controller.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getMvActSeizureList)
  .post(
    upload.fields([
      {
        name: "avatar",
        maxCount: 10,
      },
    ]),
    mvActSeizureEntry
  );

router
  .route("/:id")
  .get(getMvActSeizure)
  .patch(
    upload.fields([
      {
        name: "avatar",
        maxCount: 10,
      },
    ]),
    updateMvActSeizure
  )
  .delete(deleteMvActSeizure);

export default router;
