import { Router } from "express";

import { upload } from "../middlewares/multer.middlewares.js";
import verifyJWT from "../middlewares/auth.Middleware.js";
import {
  createKurkiEntry,
  deleteKurkiEntry,
  getAllKurkiEntry,
  getKurkiEntry,
  updateKurkiEntryDetails,
} from "../controllers/kurkiEntry.controller.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getAllKurkiEntry)
  .post(
    upload.fields([
      {
        name: "avatar",
        maxCount: 10,
      },
    ]),
    createKurkiEntry
  );

router
  .route("/:id")
  .get(getKurkiEntry)
  .patch(  upload.fields([
    {
      name: "avatar",
      maxCount: 10,
    },
  ]),updateKurkiEntryDetails)
  .delete(deleteKurkiEntry);

export default router;
