import { Router } from "express";

import { upload } from "../middlewares/multer.middlewares.js";
import verifyJWT from "../middlewares/auth.Middleware.js";
import {
  createFslEntry,
  deleteFslEntry,
  getAllFslEntry,
  getFslEntry,
  updateFslEntryDetails,
} from "../controllers/fslEntry.controller.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getAllFslEntry)
  .post(
    upload.fields([
      {
        name: "avatar",
        maxCount: 10,
      },
    ]),
    createFslEntry
  );

router
  .route("/:id")
  .get(getFslEntry)
  .patch( upload.fields([
    {
      name: "avatar",
      maxCount: 10,
    },
  ]),updateFslEntryDetails)
  .delete(deleteFslEntry);

export default router;
