import { Router } from "express";
import {
  createMalkhanaEntry,
  getMalkhanaEntry,
  getAllMalkhanaEntries,
  updateMalkhanaEntryDetails,
} from "../controllers/malkhanaEntry.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import verifyJWT from "../middlewares/auth.Middleware.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getAllMalkhanaEntries)
  .post(
    upload.fields([
      {
        name: "avatar",
        maxCount: 1,
      },
    ]),
    createMalkhanaEntry
  );

router.route("/:id").get(getMalkhanaEntry).patch(updateMalkhanaEntryDetails);

export default router;
