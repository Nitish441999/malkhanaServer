import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import verifyJWT from "../middlewares/auth.Middleware.js";
import {
  artoSeizureEntry,
  deleteArtoSeizure,
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
        maxCount: 10,
      },
    ]),
    artoSeizureEntry
  );

router
  .route("/:id")
  .get(getArtoSeizure)
  .patch(
    upload.fields([
      {
        name: "avatar",
        maxCount: 10,
      },
    ]),
    updateArtoSeizure
  )
  .delete(deleteArtoSeizure);
export default router;
