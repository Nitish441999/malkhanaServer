import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import verifyJWT from "../middlewares/auth.Middleware.js";
import {
  artoSeizureEntry,
  getArtoSeizure,
  getArtoSeizureList,
  updateArtoSeizure,
} from "../controllers/artoSeizure.controller.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getArtoSeizureList)
  .post(
    upload.fields([
      {
        name: "avatar",
        maxCount: 1,
      },
    ]),
    artoSeizureEntry
  );

router
  .route("/c/:id")
  .get(getArtoSeizure)
  .put(
    upload.fields([
      {
        name: "avatar",
        maxCount: 1,
      },
    ]),
    updateArtoSeizure
  );

export default router;
