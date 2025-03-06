import { Router } from "express";

import { upload } from "../middlewares/multer.middlewares.js";
import verifyJWT from "../middlewares/auth.Middleware.js";
import {
  createOthersEntry,
  deleteOtherEntry,
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
        maxCount: 10,
      },
    ]),
    createOthersEntry
  );

router
  .route("/:id")
  .get(getOthersEntry)
  .patch( upload.fields([
    {
      name: "avatar",
      maxCount: 10,
    },
  ]),updateOthersEntryDetails)
  .delete(deleteOtherEntry);

export default router;
