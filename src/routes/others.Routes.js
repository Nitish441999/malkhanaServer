import { Router } from "express";

import { upload } from "../middlewares/multer.middlewares.js";
import verifyJWT from "../middlewares/auth.Middleware.js";
import {
  createOthersEntry,
  getAllOthersEntry,
  getOthersEntry,
  updateOthersEntryDetails,
} from "../controllers/otherEntry.controller.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getAllOthersEntry)
  .post(
    upload.fields([
      {
        name: "avatar",
        maxCount: 1,
      },
    ]),
    createOthersEntry
  );

router.route("/:id").get(getOthersEntry).put(updateOthersEntryDetails);

export default router;
